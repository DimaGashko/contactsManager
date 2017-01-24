;(function() {
	window.readFile = function(file, callback) {	
		if (!file || !callback) return;
		
		var reader = new FileReader();
		reader.readAsDataURL(file);
		
		reader.addEventListener('load', function(event) {
			callback(event.target.result || null);
		});
	}
}());