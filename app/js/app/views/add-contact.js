(function ($) {
	'use strict'
	
	app.views.AddContact = Backbone.View.extend({
		tag: 'div',
		className: 'contacts__form_add',
		
		tmplAdd: $('#tmpl-add-contact').html(),
		tmplEdit: _.template($('#tmpl-edit-contact').html()),
		
		params: {
			photoSrc: '',
			maxPhotoSize: 500, //Кбайт
		},
		
		events: {
			'click .contacts__form_add-add': 'add',
			'click .contacts__photo-clear': 'clearPhoto',
			'change .contacts__load_img': 'chandePhoto',
		},
		
		initialize: function(options) {
			this.type = options.type;
			
			if (this.type === 'add') {
				this.render();
			}
		},
		
		render: function(model) {
			if (this.type === 'add') {
				this.$el.html(this.tmplAdd);
				
			} else if (this.type === 'edit') {
				this.model = model;
				this.$el.html(this.tmplEdit(model.toJSON()));
				
			}
			
			this.getElements();
		},
		
		add: function() {	
			var f = this.form;
			var name = f.name.value.trim();
			
			if (!name) {
				alert('Поле "Имя" - обязательное');
				f.name.focus();
				return;
			}
			
			var newContact = {
				name: name,
				skype: f.skype.value.trim(),
				phoneNumbers: this.getInArray(f.phoneNumbers.value.trim()),
				email: this.getInArray(f.email.value.trim()),
				social: this.getSocial(),
				date: f.date.value.trim(),
				address: f.address.value.trim(),
				comment: f.comment.value.trim(),
				photoSrc: this.params.photoSrc || 'img/default.jpg', 
			}
			
			if (this.type === 'add') {
				this.collection.create(newContact);
				
			} else if(this.type === 'edit') {
				this.model.set(newContact).save();
			}
		},
		
		getSocial: function() {
			var social = this.getInArray(this.form.social.value.trim());
			
			if (!social[0]) return social;
			
			for (var i = 0; i < social.length; i++) {
				social[i] = social[i].replace(/^http:\/\/|https:\/\//, '');
			}
			
			return social;
		},
		
		getInArray: function(str) {
			var inArr = str.split(',');
			
			for (var i = 0; i < inArr.length; i++) {
				inArr[i] = inArr[i].trim();
			}
			
			return inArr;
		},
		
		chandePhoto: function() {
			var file = this.form.photoFile.files[0];
			var maxSize = this.params.maxPhotoSize
			
			if (file.size > maxSize * 1024) {
				alert('Максимальный размер фотографии - ' + maxSize + ' Кбайт');
				return;
			}
			
			readFile(file, (src) => {
				setTimeout(() => {
					this.params.photoSrc = src;
					this.chandePhotoBg(src);
					this.form.photoFile.value = '';
					this.params.chandePhoto = true;
				}, 50);
			});
		},
		
		clearPhoto: function() { 			
			this.params.photoSrc = '';
			this.chandePhotoBg('img/default.jpg');
			this.form.photoFile.value = '';
		},
		
		chandePhotoBg: function change(newBg) {
			if (!('prevBg' in change)) change.prevBg = 'img/default.jpg'; 
			
			if (newBg === change.prevBg) return;
		
			this.$photo.fadeTo(200, 0.01, null, () => {
				this.$photo.css('background-image', 'url(' + newBg + ')');
				this.$photo.fadeTo(200, 1);
			});
			
			change.prevBg = newBg
		},
		
		getElements: function() {
			this.form = this.$el.find('.contacts__add-form')[0];
			this.$photo = this.$el.find('.contacts__form_add-img');
		},
		
		addAfter: function() {
			this.form.reset();
			this.chandePhotoBg('img/default.jpg');
		}

	});
	
}(jQuery));