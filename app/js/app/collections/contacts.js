(function () {
	'use strict';

	app.collections.Contacts = Backbone.Collection.extend({
		model: app.models.Contact,

		localStorage: new Backbone.LocalStorage('contactsList'),
		
		getWithStr: function(searchQuery) {
			return _.filter(this.models, (contact) => {
				return this._checkContact(contact, searchQuery);
			});
		},
		
		getSortConfig: function(models) {			
			var config = _.sortBy(this._getRenderConfig(models), 'name');
			
			var inGroup = {};
			var resultConfig = [];
			var words = [];
			
			for (var i = 0; i < config.length; i++) {
				var word = config[i].name[0].toLowerCase(); 
				
				if (words.indexOf(word) === -1) {
					words.push(word);
				}
				
				inGroup[word] = inGroup[word] || [];
				inGroup[word].push(config[i]);				
			}
			
			for (var i = 0; i < words.length; i++) {
				resultConfig.push({
					word: words[i],
					contacts: inGroup[words[i]],
				})
			}
			
			return resultConfig;			
		},
		
		_getRenderConfig: function(models) {
			return _.map(models || this.models, (contact) => {
				return contact.toJSON();
			});
		},
		
		_checkContact: function(contact, searchQuery) {
			if (!searchQuery) return true;
			
			searchQuery = searchQuery.toLowerCase();
			
			var attrs = contact.toJSON();
			attrs.phoneNumbers = attrs.phoneNumbers.join();
			attrs.email = attrs.email.join();
			attrs.social = attrs.social.join();
			
			for (var i = 0; i < this._searchBy.length; i++) {
				var attr = attrs[this._searchBy[i]].toLowerCase();
				if (~attr.search(searchQuery)) return true;
			}
		},
		
		_searchBy: ['name', 'skype', 'phoneNumbers', 'email', 'social'],
	});
	
})();