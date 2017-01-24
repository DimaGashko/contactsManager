(function () {
	'use strict';

	// Todo Router
	// ----------
	app.routers.Router = Backbone.Router.extend({
		routes: {
			'': 'defaults',
			'search/:q': 'search',
			'*q': 'defaults'
		},
		
		initialize: function(options) {
			this.options = options;
		},

		search: function (q) {
			this.setRout(q);
		},
		
		defaults: function () {
			this.setRout('');
		},
		
		setRout: function(q) {
			this.options.contactsList.trigger('search', q);
			this.options.input.val(q);
		}
	});
	
})();