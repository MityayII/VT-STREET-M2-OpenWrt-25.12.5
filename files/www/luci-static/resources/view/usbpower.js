'use strict';
'require view';
'require form';
'require uci';
'require fs';
'require ui';

return view.extend({
    render: function() {
        var m, s, o;

        m = new form.Map('system', 'Управление питанием USB',
            'Переключение питания модема (GPIO power_usb).');

        s = m.section(form.NamedSection, 'power_usb', 'gpio_switch');
        s.anonymous = true;

        o = s.option(form.ListValue, 'value', 'Состояние',
            'Включить или выключить питание USB-порта.');
        o.value('1', 'Включено (1)');
        o.value('0', 'Выключено (0)');
        o.rmempty = false;

        o = s.option(form.Button, '_apply', ' ',
            'Нажмите, чтобы применить изменения.');
        o.inputtitle = 'Применить';
        o.inputstyle = 'apply';
        o.onclick = function() {
            return uci.save()
                .then(function() {
                    return fs.exec('/etc/init.d/gpio_switch', ['restart']);
                })
                .then(function() {
                    ui.addNotification(null, E('p', 'Питание USB переключено!'), 'info');
                })
                .catch(function(e) {
                    ui.addNotification(null, E('p', 'Ошибка: ' + e.message), 'error');
                });
        };

        return m.render();
    }
});
