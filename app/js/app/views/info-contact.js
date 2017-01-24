(function ($) {
	'use strict'
	
	app.views.InfoContact = Backbone.View.extend({
		tag: 'div',
		className: 'contacts__form_info',
		
		tmpl: _.template($('#tmpl-info-contact').html()),
		
		events: {
			'click .contacts__info-edit': 'showModalEdit',
			'click .contacts__info-remove': 'remove',
		},
		
		initialize: function() {
			this.components = {};			
			this.listenTo(this.collection, 'sync', this.rerender);
		},
		
		render: function(model) {
			this.model = model;
			this.$el.html(this.tmpl(model.toJSON()));
			
			return this;
		},
		
		showModalEdit: function() {
			this.getComponent('modalEdit').show();
			this.getComponent('editContact').render(this.model);
		},
		
		rerender: function() {
			this.getComponent('modalEdit').hide();
			this.render(this.model);
		},
		
		remove: function() {
			if (confirm('Вы действительно хотите удалить этот контакт?')) {
				this.model.destroy({whait: true});
			}
		},
		
		getComponent: function(name) {
			if (!name || typeof name !== 'string') return;
			
			var c = this.components;
			
			if (name === 'modalEdit') {
				if (c.modalEdit) return c.modalEdit;
				
				var modalModel = new app.models.ModalWindow({
					title: 'Редактирование контакта',
					body: this.getComponent('editContact').el,
					height: '80%',
				});
				c.modalEdit = new app.views.ModalWindow({model: modalModel})
				
				return c.modalEdit;
				
			} else if (name === 'editContact') {
				if (c.editContact) return c.editContact;
				
				c.editContact = new app.views.AddContact({
					type: 'edit',
				});
				
				window.edit = c.editContact;
				return c.editContact;
				
			} else if (name === '...') {
				
				
			}			
			
		}
		
	});
	
}(jQuery));