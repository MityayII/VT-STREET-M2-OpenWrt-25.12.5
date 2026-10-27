'use strict';
'require view';
'require form';
'require uci';
'require fs';
'require ui';

return view.extend({
    render: function() {
        var m, s, o;

        // 1. Создаем форму
        m = new form.Map('ipv6', 'Управление IPv6',
            'Включение или выключение IPv6 на уровне ядра и DHCP.');

        // 2. Создаем секцию
        s = m.section(form.NamedSection, 'settings', 'settings');
        s.anonymous = true;

        // 3. Создаем выпадающий список
        o = s.option(form.ListValue, 'enabled', 'Состояние IPv6');
        o.value('1', 'Включено');
        o.value('0', 'Выключено');
        o.rmempty = false;

        // 4. Создаем элемент для статуса (текст)
        var statusEl = E('div', { 
            'style': 'margin-bottom: 20px; font-size: 1.2em; font-weight: bold; color: #666;' 
        }, 'Текущий статус: загрузка...');

        // 5. Функция обновления статуса
        var updateStatus = function() {
            uci.load('ipv6').then(function() {
                var isEnabled = (uci.get('ipv6', 'settings', 'enabled') === '1');
                statusEl.style.color = isEnabled ? 'green' : 'red';
                statusEl.textContent = 'Текущий статус: ' + (isEnabled ? 'ВКЛЮЧЕН' : 'ВЫКЛЮЧЕН');
            });
        };

        // 6. Переопределяем сохранение
        m.save = function() {
            return uci.save().then(function() {
                return uci.apply();
            }).then(function() {
                return fs.exec('/usr/bin/ipv6-toggle.sh');
            }).then(function() {
                ui.addNotification(null, E('p', 'Настройки IPv6 применены!'), 'info');
                updateStatus(); // Обновляем текст статуса без перезагрузки страницы
            }).catch(function(e) {
                ui.addNotification(null, E('p', 'Ошибка: ' + e.message), 'error');
            });
        };

        // 7. Рендерим форму и добавляем статус перед ней
        var formView = m.render();
        
        // Возвращаем контейнер, в котором сначала статус, потом форма
        return E('div', {}, [
            statusEl,
            formView
        ]);
    },

    // При загрузке страницы сразу обновляем статус
    load: function() {
        return uci.load('ipv6').then(function() {
            return uci.get('ipv6', 'settings', 'enabled');
        });
    }
});
