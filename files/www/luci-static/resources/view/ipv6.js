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

        m = new form.Map('ipv6', 'Управление IPv6',
            'Включение или выключение IPv6 на уровне ядра и DHCP.');

        s = m.section(form.NamedSection, 'settings', 'settings');
        s.anonymous = true;

        o = s.option(form.ListValue, 'enabled', 'Состояние IPv6');
        o.value('1', 'Включено');
        o.value('0', 'Выключено');
        o.rmempty = false;

        // Переопределяем сохранение
        m.save = function() {
            // 1. Получаем выбранное значение (1 или 0)
            var state = this.get('settings', 'enabled') || '0';

            // 2. Сохраняем в UCI (чтобы LuCI не ругался)
            return uci.save().then(function() {
                // 3. Вызываем скрипт и ПЕРЕДАЕМ ему аргумент (1 или 0)
                return fs.exec('/usr/bin/ipv6-toggle.sh', [state]);
            }).then(function() {
                ui.addNotification(null, E('p', 'Настройки IPv6 ' + (state === '1' ? 'включены' : 'выключены')), 'info');
            }).catch(function(e) {
                ui.addNotification(null, E('p', 'Ошибка: ' + e.message), 'error');
            });
        };

        return m.render();
    }
});
