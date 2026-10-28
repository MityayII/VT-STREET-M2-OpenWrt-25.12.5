#!/bin/sh

# Если аргумент передан — используем его. 
# Если нет (например, вызов из 99-system-cleanups) — читаем UCI или ставим 0 по умолчанию.
if [ -n "$1" ]; then
    ENABLED="$1"
else
    ENABLED=$(uci -q get ipv6.settings.enabled)
    [ -z "$ENABLED" ] && ENABLED="0"
fi

if [ "$ENABLED" = "1" ]; then
    # Включаем IPv6
    sysctl -w net.ipv6.conf.all.disable_ipv6=0
    sysctl -w net.ipv6.conf.default.disable_ipv6=0
    sysctl -w net.ipv6.conf.lo.disable_ipv6=0
    rm -f /etc/sysctl.d/99-disable-ipv6.conf
    
    uci set dhcp.lan.dhcpv6='server'
    uci set dhcp.lan.ra='server'
    uci commit dhcp
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
    
    uci set dhcp.lan.dhcpv6='disabled'
    uci set dhcp.lan.ra='disabled'
    uci commit dhcp
    /etc/init.d/odhcpd restart 2>/dev/null
    
    echo "IPv6 выключен"
fi
