'use strict';
'require view';
'require form';
'require uci';
'require fs';
'require ui';

return view.extend({
    render: function() {
        var m, s, o;

        // Проверяем, есть ли секция. Если нет — создаем в памяти.
        if (!uci.get('ipv6', 'settings', 'enabled')) {
            uci.set('ipv6', 'settings', 'enabled', '0');
        }

        // Получаем текущее состояние для отрисовки статуса
        var currentState = uci.get('ipv6', 'settings', 'enabled') || '0';
        var isOn = (currentState === '1');
        
        // Формируем HTML для красивого статуса
        var statusColor = isOn ? '#4caf50' : '#f44336'; // Зеленый или красный
        var statusText = isOn ? 'Включено' : 'Выключено';
        
        // Создаем блок статуса
        var statusHtml = E('div', { 'style': 'margin-bottom: 20px; font-size: 1.1em; display: flex; align-items: center;' }, [
            E('b', { 'style': 'margin-right: 10px;' }, 'Текущий статус: '),
            E('span', { 
                'style': 'display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: ' + statusColor + '; margin-right: 8px; box-shadow: 0 0 5px ' + statusColor + ';' 
            }),
            E('span', { 'style': 'color: ' + statusColor + '; font-weight: bold;' }, statusText)
        ]);

        m = new form.Map('ipv6', 'Управление IPv6',
            'Включение или выключение IPv6 на уровне ядра и DHCP.');

        // Вставляем наш красивый статус перед формой
        m.children.unshift(statusHtml);

        s = m.section(form.NamedSection, 'settings', 'settings');
        s.anonymous = true;

        o = s.option(form.ListValue, 'enabled', 'Состояние IPv6');
        o.value('1', 'Включено');
        o.value('0', 'Выключено');
        o.rmempty = false;

        // Переопределяем сохранение
        m.save = function() {
            var state = this.get('settings', 'enabled') || '0';

            return uci.save().then(function() {
                return fs.exec('/usr/bin/ipv6-toggle.sh', [state]);
            }).then(function() {
                ui.addNotification(null, E('p', 'Настройки IPv6 ' + (state === '1' ? 'включены' : 'выключены')), 'info');
                // Перезагружаем страницу, чтобы статус-кружок обновился
                window.location.reload();
            }).catch(function(e) {
                ui.addNotification(null, E('p', 'Ошибка: ' + e.message), 'error');
            });
        };

        return m.render();
    }
});
