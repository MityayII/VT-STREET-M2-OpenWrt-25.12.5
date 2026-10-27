#!/bin/sh

# Читаем текущее состояние из UCI (по умолчанию '0' = выключено)
ENABLED=$(uci -q get ipv6.settings.enabled)
[ -z "$ENABLED" ] && ENABLED="0"

if [ "$ENABLED" = "1" ]; then
    # Сейчас включено -> Выключаем
    uci set ipv6.settings.enabled='0'
    uci commit ipv6
    
    sysctl -w net.ipv6.conf.all.disable_ipv6=1
    sysctl -w net.ipv6.conf.default.disable_ipv6=1
    sysctl -w net.ipv6.conf.lo.disable_ipv6=1
    
    # Сохраняем в sysctl.d для перезагрузки
    echo "net.ipv6.conf.all.disable_ipv6=1" > /etc/sysctl.d/99-disable-ipv6.conf
    echo "net.ipv6.conf.default.disable_ipv6=1" >> /etc/sysctl.d/99-disable-ipv6.conf
    echo "net.ipv6.conf.lo.disable_ipv6=1" >> /etc/sysctl.d/99-disable-ipv6.conf
    
    uci set dhcp.lan.dhcpv6='disabled'
    uci set dhcp.lan.ra='disabled'
    uci commit dhcp
    /etc/init.d/odhcpd restart 2>/dev/null
    
    echo "IPv6 выключен"
else
    # Сейчас выключено -> Включаем
    uci set ipv6.settings.enabled='1'
    uci commit ipv6
    
    sysctl -w net.ipv6.conf.all.disable_ipv6=0
    sysctl -w net.ipv6.conf.default.disable_ipv6=0
    sysctl -w net.ipv6.conf.lo.disable_ipv6=0
    rm -f /etc/sysctl.d/99-disable-ipv6.conf
    
    uci set dhcp.lan.dhcpv6='server'
    uci set dhcp.lan.ra='server'
    uci commit dhcp
    /etc/init.d/odhcpd restart 2>/dev/null
    
    echo "IPv6 включен"
fi
