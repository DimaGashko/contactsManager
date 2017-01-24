(function ($) {
	'use strict'
	
	app.views.ContactsList = Backbone.View.extend({
		el: '.contacts__list',
		
		tmpl: _.template($('#tmpl-contact-list').html()),
		
		events: {
			'click .contacts__item': 'showInfo',
		},
		
		initialize: function() {	
			this.searchQuery = '';
			this.components = {}
			
			this.render();
			
			this.listenTo(this, 'search', this.search);
			this.listenTo(this.collection, 'sync', this.rerender);
			this.listenTo(this.collection, 'destroy', this.removeContact);
		},
		
		render: function render() {
			console.time('render');
			
			var config = this.collection.getSortConfig();
			this.$el.html(this.tmpl({config: config}));
			
			console.timeEnd('render');
		},
		
		search: function (q) {
			console.time('search');
			
			this.searchQuery = q;			
			var models = this.collection.getWithStr(q);
			
			var check = this.prevModels && 
				models.length === this.prevModels.length;
				
			if (check) return;
			
			this.collection.trigger('search', models.length);
			
			this.prevModels = models;
			this.showModels(models);
			
			console.timeEnd('search');
		},
		
		rerender: function() {			
			this.render();
			this.prevModels = null;
			this.search(this.searchQuery);
		},
		
		removeContact: function() {	
			this.rerender();
			this.getComponent('modalInfo').hide();
		},
		
		showInfo: function(event) {
			var contact = $(event.target.closest('.contacts__item'));
			var id = contact.attr('data-contact-id');
			var model = this.collection.where({id: id})[0];
			
			this.getComponent('infoContact').render(model);
			this.getComponent('modalInfo').show();
		},
		
		showModels: function(models) {
			var groups = this.el.querySelectorAll('.contacts__section');
			var items = this.el.querySelectorAll('.contacts__item');
		
			if (!models.length) {
				_.each(groups, (g) => g.hidden = true);
				_.each(items, (i) => i.hidden = true);
				return;
			}
			
			if (models.length === this.collection.models.length) {
				_.each(groups, (g) => g.hidden = false);
				_.each(items, (i) => i.hidden = false);
				return;
			}
			
			_.each(groups, (g) => g.hidden = true);
			_.each(items, (i) => i.hidden = true);
			
			this.contactsShow(models);
			this.groupShow(models);
		},
		
		contactsShow: function (models) {
			for (var i = 0; i < models.length; i++) {
				var sel = '[data-contact-id="' + models[i].id + '"]'
				this.el.querySelector(sel).hidden = false;
			}
		},
		
		groupShow: function (models) {
			var groups = this.collection.getSortConfig(models);
			
			for (var i = 0; i < groups.length; i++) {
				var sel = '[data-section-word="' + groups[i].word + '"]';
				this.el.querySelector(sel).hidden = false;
			}
		},
		
		getComponent: function(name) {
			if (!name || typeof name !== 'string') return;
			
			var c = this.components;
			
			if (name === 'modalInfo') {
				if (c.modalInfo) return c.modalInfo;
				
				var modalModel = new app.models.ModalWindow({
					title: 'Профиль контакта',
					body: this.getComponent('infoContact').el,
				});
				c.modalInfo = new app.views.ModalWindow({model: modalModel})
				
				return c.modalInfo;
				
			} else if (name === 'infoContact') {
				if (c.infoContact) return c.infoContact;
				
				c.infoContact = new app.views.InfoContact({
					collection: this.collection,
				});
				return c.infoContact;
				
			} else if (name === '...') {
				
				
			}			
			
		}
		
	});
	
}(jQuery));