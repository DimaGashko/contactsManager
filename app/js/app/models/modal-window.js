(function () {
	'use strict';

	app.models.ModalWindow = Backbone.Model.extend({
		defaults: {
			title: 'Contact List',
			body: '',
			width: 600,
			height: 400,
		},
	});
	
})();