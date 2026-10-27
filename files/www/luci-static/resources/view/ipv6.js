'use strict';
'require view';
'require uci';
'require fs';
'require ui';

return view.extend({
    load: function() {
        return uci.load('ipv6').then(function() {
            return uci.get('ipv6', 'settings', 'enabled') || '0';
        });
    },

    handleToggle: function() {
        var self = this;
        var current = uci.get('ipv6', 'settings', 'enabled') || '0';
        var newValue = (current === '1') ? '0' : '1';
        
        // 1. Меняем UCI
        uci.set('ipv6', 'settings', 'enabled', newValue);
        
        // 2. Сохраняем и применяем UCI
        return uci.save().then(function() {
            return uci.apply();
        }).then(function() {
            // 3. Вызываем скрипт для применения к sysctl и dhcp
            return fs.exec('/usr/bin/ipv6-toggle.sh');
        }).then(function() {
            ui.addNotification(null, E('p', 'Статус IPv6 изменен!'), 'info');
            return self.render();
        }).catch(function(e) {
            ui.addNotification(null, E('p', 'Ошибка: ' + e.message), 'error');
        });
    },

    render: function(enabled) {
        var isEnabled = (enabled === '1');
        var statusColor = isEnabled ? 'green' : 'red';
        var statusText = isEnabled ? 'ВКЛЮЧЕН' : 'ВЫКЛЮЧЕН';

        return E('div', { 'class': 'cbi-map' }, [
            E('h2', 'Управление IPv6'),
            E('div', { 'class': 'cbi-section' }, [
                E('div', { 'style': 'margin-bottom: 20px; font-size: 1.2em;' }, [
                    E('b', 'Текущий статус: '),
                    E('span', { 'style': 'color: ' + statusColor + '; font-weight: bold;' }, statusText)
                ]),
                E('div', { 'style': 'display: flex; gap: 10px;' }, [
                    E('button', {
                        'class': 'btn cbi-button cbi-button-apply',
                        'click': ui.createHandlerFn(this, function() { return this.handleToggle(); })
                    }, 'Переключить IPv6')
                ])
            ])
        ]);
    }
});
