(function ($) {
	'use strict'
	
	var allModalWindows = [];
	
	app.views.ModalWindow = Backbone.View.extend({
		tag:  'div',
		className: 'contacts__modal',
		
		tmpl: _.template($('#tmpl-modal').html()),
		$container: $('.contacts__modals_container'),
		
		options: {
			fadeSpeed: 200,
		},
		
		events: {
			'mouseup .contacts__modal-exit': 'hide',
		},
		
		status: {
			show: false,
		},
		
		initialize: function() {			
			this.render();
			this.getElements();
			this.initEvents();
			this.setSize();
			this.addBody();
			
			allModalWindows.push(this);
		},
		
		render: function() {
			this.$el.html(this.tmpl(this.model.toJSON()));
			this.$container.append(this.$el);
		},
		
		initEvents: function() {
			document.addEventListener('keyup', (event) => {
				if (event.keyCode === app.KEYS.esc) this.hide();
			});
		},

		show: function() {
			setTimeout(() => {
				this.$el.fadeIn(this.options.fadeSpeed);
			}, 50);
			
			this.status.show = true;
		},
		
		hide: function() {
			this.$el.fadeOut(this.options.fadeSpeed);
			this.status.show = false;
		},
		
		hideAll: function() {
			for (var i = 0; i < allModalWindows.length; i++) {
				allModalWindows[i].hide();
			}
			
			return this;
		},
		
		setSize: function() {
			this.$main.css({
				width: this.model.get('width'),
				height: this.model.get('height'),
			})
		},
		
		addBody: function() {
			this.$body.append(this.model.get('body'));
		},
		
		getElements: function() {
			this.$main = this.$('.contacts__modal-main');
			this.$body = this.$('.contacts__modal-body');
		},

	});
	
}(jQuery));