(function ($) {
	'use strict'
	
	app.views.AppView = Backbone.View.extend({
		el:  '.contacts',
		
		events: {
			'keyup .contacts__search-text': 'setLocation',
			'click .contacts__add': 'showAddModal',
		},
		
		tmpls: {
			footer: _.template($('#tmpl-footer').html()),
		},
		
		initialize: function() {
			this.getElements();
			this.createComponents();
			this.initEvents();
		},
		
		initEvents: function() {
			this.listenTo(this.components.contacts, 'add', this.addContact);
		},
		
		getElements: function() {
			this.elements = {
				addItem: this.$('.contacts__add'),
				search: this.$('.contacts__search-text'),
				contactsList: this.$('.contacts__list'),
				modalContainer: this.$('.contacts__modals_container'),
				footer: this.$('.contacts__footer'),
			}
		},
		
		//Показывает модальное окно добавления контакта
		showAddModal: function() {
			this.getComponent('modalAdd').show();
			setTimeout(() => {
				this.getComponent('contactAdd').form.name.focus();
			}, 50);
		},
		
		addContact: function(newContact) {
			this.getComponent('modalAdd').hide();
			this.getComponent('contactAdd').addAfter();
		},
		
		setLocation: function(event) {
			location.href = '#search/' + event.target.value.trim();
		},
		
		renderFooter: function(showN) {
			var all = this.components.contacts.length;
			
			var html = this.tmpls.footer({
				show: (showN !== undefined) ? showN : all,
				all: all,
			})
			
			this.elements.footer.html(html);
		},
		
		/**
		 * Создает компоненты используются всегда
		 */
		createComponents: function() {
			this.components = {
				contacts: new app.collections.Contacts(),
			}
			
			this.components.contacts.fetch({reset: true});
			this.listenTo(this.components.contacts, 'search', this.renderFooter);			
			
			this.components.contactsList = new app.views.ContactsList({
				collection: this.components.contacts,
			});
			
			this.components.router = new app.routers.Router({
				contactsList: this.components.contactsList,
				input: this.elements.search,
			});
			
			Backbone.history.start();
		},
		
		/**
		 * Возвращает компонент по его имени
		 * Если он еще не был создан - создает
		 *
		 * @param {string} name - имя компонента
		 */
		getComponent: function(name) {
			if (!name || typeof name !== 'string') return;
			
			var c = this.components;
			
			if (name === 'modalAdd') {
				if (c.modalAdd) return c.modalAdd;
				
				var modalModel = new app.models.ModalWindow({
					title: 'Добавление контакта',
					body: this.getComponent('contactAdd').el,
					height: '80%',
				});
				c.modalAdd = new app.views.ModalWindow({model: modalModel})
				
				return c.modalAdd;
				
			} else if (name === 'contactAdd') {
				if (c.addContact) return c.addContact;
				
				c.addContact = new app.views.AddContact({
					collection: this.components.contacts,
					type: 'add',
				});
				
				window.add = c.addContact;
				
				return c.addContact;
				
			} else if (name === '...') {
				
				
			}			
			
		}

	});
	
}(jQuery));