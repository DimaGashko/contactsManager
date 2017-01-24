(function () {
	'use strict';

	app.models.Contact = Backbone.Model.extend({
		defaults: {
			name: '',
			skype: '',
			phoneNumbers: [],
			email: [],
			social: [],
			date: '',
			address: '',
			comment: '',
			photoSrc: '',
		},
		
	});
	
})();