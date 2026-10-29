#!/bin/sh

if [ -n "$1" ]; then
    ENABLED="$1"
else
    ENABLED=$(uci -q get ipv6.settings.enabled)
    [ -z "$ENABLED" ] && ENABLED="0"
fi

# Сохраняем в UCI
uci set ipv6.settings.enabled="$ENABLED"
uci commit ipv6

if [ "$ENABLED" = "1" ]; then
    # Включаем IPv6
    sysctl -w net.ipv6.conf.all.disable_ipv6=0
    sysctl -w net.ipv6.conf.default.disable_ipv6=0
    sysctl -w net.ipv6.conf.lo.disable_ipv6=0
    rm -f /etc/sysctl.d/99-disable-ipv6.conf
    
    # Явно задаем ULA-префикс
    uci set network.globals.ula_prefix='fd00:1234:5678::/48'
    uci commit network
    
    uci set dhcp.lan.dhcpv6='server'
    uci set dhcp.lan.ra='server'
    uci commit dhcp
    /etc/init.d/network reload 2>/dev/null
    /etc/init.d/odhcpd restart 2>/dev/null
    
    echo "IPv6 включен"
else
    # Выключаем IPv6
    sysctl -w net.ipv6.conf.all.disable_ipv6=1
    sysctl -w net.ipv6.conf.default.disable_ipv6=1
    sysctl -w net.ipv6.conf.lo.disable_ipv6=1
    
    echo "net.ipv6.conf.all.disable_ipv6=1" > /etc/sysctl.d/99-disable-ipv6.conf
    echo "net.ipv6.conf.default.disable_ipv6=1" >> /etc/sysctl.d/99-disable-ipv6.conf
    echo "net.ipv6.conf.lo.disable_ipv6=1" >> /etc/sysctl.d/99-disable-ipv6.conf
    
    # Удаляем ULA-префикс
    uci -q delete network.globals.ula_prefix
    uci commit network
    
    uci set dhcp.lan.dhcpv6='disabled'
    uci set dhcp.lan.ra='disabled'
    uci commit dhcp
    
    # Принудительная очистка адреса и обновление ubus
    ip -6 addr flush dev br-lan scope global 2>/dev/null
    ubus call network reload
    /etc/init.d/odhcpd restart 2>/dev/null
    
    echo "IPv6 выключен"
fi

# Записываем статус для LuCI
echo "$ENABLED" > /tmp/ipv6-status
