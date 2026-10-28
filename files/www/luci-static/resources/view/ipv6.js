'use strict';
'require view';
'require form';
'require uci';
'require fs';
'require ui';

return view.extend({
    render: function() {
        var m, s, o;

        // Создаем форму
        m = new form.Map('ipv6', 'Управление IPv6',
            'Включение или выключение IPv6 на уровне ядра и DHCP.');

        // Секция
        s = m.section(form.NamedSection, 'settings', 'settings');
        s.anonymous = true;

        // Выпадающий список
        o = s.option(form.ListValue, 'enabled', 'Состояние IPv6');
        o.value('1', 'Включено');
        o.value('0', 'Выключено');
        o.rmempty = false;

        // Переопределяем сохранение
        m.save = function() {
            return uci.save().then(function() {
                return uci.apply();
            }).then(function() {
                return fs.exec('/usr/bin/ipv6-toggle.sh');
            }).then(function() {
                ui.addNotification(null, E('p', 'Настройки IPv6 применены!'), 'info');
            }).catch(function(e) {
                ui.addNotification(null, E('p', 'Ошибка: ' + e.message), 'error');
            });
        };

        // Возвращаем форму
        return m.render();
    }
});
