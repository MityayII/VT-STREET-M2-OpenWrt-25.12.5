'use strict';
'require view';
'require fs';
'require ui';

return view.extend({
	load: function() {
		return fs.read('/sys/class/gpio/power_usb/value').then(function(data) {
			return data.trim();
		}).catch(function() {
			return '1';
		});
	},

	handlePower: function(state) {
		var self = this;
		return fs.write('/sys/class/gpio/power_usb/value', state)
			.then(function() {
				ui.addNotification(null, E('p', 'Питание USB ' + (state === '1' ? 'включено' : 'выключено')), 'info');
				return self.render();
			})
			.catch(function(e) {
				ui.addNotification(null, E('p', 'Ошибка GPIO: ' + e.message), 'error');
			});
	},

	handleReboot: function() {
		var self = this;
		ui.addNotification(null, E('p', 'Перезагрузка модема (выключение на 5 секунд)...'), 'info');
		
		return fs.write('/sys/class/gpio/power_usb/value', '0')
			.then(function() {
				return new Promise(function(resolve) { setTimeout(resolve, 5000); });
			})
			.then(function() {
				return fs.write('/sys/class/gpio/power_usb/value', '1');
			})
			.then(function() {
				ui.addNotification(null, E('p', 'Модем перезагружен!'), 'info');
				return self.render();
			})
			.catch(function(e) {
				ui.addNotification(null, E('p', 'Ошибка перезагрузки: ' + e.message), 'error');
			});
	},

	render: function(status) {
		var isOn = (status === '1');
		var statusColor = isOn ? 'green' : 'red';
		var statusText = isOn ? 'ВКЛЮЧЕНО' : 'ВЫКЛЮЧЕНО';

		return E('div', { 'class': 'cbi-map' }, [
			E('h2', 'Управление питанием USB'),
			E('div', { 'class': 'cbi-section' }, [
				E('div', { 'style': 'margin-bottom: 20px; font-size: 1.2em;' }, [
					E('b', 'Текущий статус: '),
					E('span', { 'style': 'color: ' + statusColor + '; font-weight: bold;' }, statusText)
				]),
				E('div', { 'style': 'display: flex; gap: 10px; flex-wrap: wrap;' }, [
					E('button', {
						'class': 'btn cbi-button cbi-button-apply',
						'click': ui.createHandlerFn(this, function() { return this.handlePower('1'); }),
						'disabled': isOn ? 'disabled' : null
					}, 'Включить'),
					
					E('button', {
						'class': 'btn cbi-button cbi-button-remove',
						'click': ui.createHandlerFn(this, function() { return this.handlePower('0'); }),
						'disabled': !isOn ? 'disabled' : null
					}, 'Выключить'),
					
					E('button', {
						'class': 'btn cbi-button cbi-button-action',
						'click': ui.createHandlerFn(this, function() { return this.handleReboot(); })
					}, 'Перезагрузить модем (5с)')
				])
			])
		]);
	}
});
