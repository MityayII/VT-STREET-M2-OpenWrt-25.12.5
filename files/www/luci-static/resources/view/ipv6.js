'use strict';
'require view';
'require form';
'require uci';
'require fs';
'require ui';

return view.extend({
    render: function() {
        var m, s, o;
        var currentState = '0';

        // Читаем статус из нашего файла. Если файла нет, пробуем UCI.
        return fs.read('/tmp/ipv6-status').then(function(data) {
            currentState = data.trim();
        }).catch(function() {
            currentState = uci.get('ipv6', 'settings', 'enabled') || '0';
        }).then(function() {
            var isOn = (currentState === '1');
            var statusColor = isOn ? '#4caf50' : '#f44336';
            var statusText = isOn ? 'Включено' : 'Выключено';
            
            var statusHtml = '<div style="margin-top: 10px; margin-bottom: 15px; font-size: 1.1em; display: flex; align-items: center;">' +
                '<b style="margin-right: 10px;">Текущий статус: </b>' +
                '<span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: ' + statusColor + '; margin-right: 8px; box-shadow: 0 0 5px ' + statusColor + ';"></span>' +
                '<span style="color: ' + statusColor + '; font-weight: bold;">' + statusText + '</span>' +
            '</div>';

            m = new form.Map('ipv6', 'Управление IPv6',
                'Включение или выключение IPv6 на уровне ядра и DHCP.' + statusHtml);

            s = m.section(form.NamedSection, 'settings', 'settings');
            s.anonymous = true;

            o = s.option(form.ListValue, 'enabled', 'Состояние IPv6');
            o.value('1', 'Включено');
            o.value('0', 'Выключено');
            o.rmempty = false;
            o.default = currentState; // Устанавливаем выбранное значение

            m.save = function() {
                var opt = m.lookupOption('enabled', 'settings');
                var state = (opt && opt[0]) ? opt[0].formvalue('settings') : '0';

                return fs.exec('/usr/bin/ipv6-toggle.sh', [state]).then(function() {
                    ui.addNotification(null, E('p', 'Настройки IPv6 ' + (state === '1' ? 'включены' : 'выключены')), 'info');
                    return new Promise(function(resolve) {
                        setTimeout(function() {
                            window.location.reload();
                            resolve();
                        }, 500);
                    });
                }).catch(function(e) {
                    ui.addNotification(null, E('p', 'Ошибка: ' + e.message), 'error');
                });
            };

            return m.render();
        });
    }
});
