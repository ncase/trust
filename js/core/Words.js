/**********************

Convert a word.html to a JSON containing innerHTMLs

**********************/

window.Words = {};
Words.text = null;

Words.get = function(id){
	return Words.text[id];
};

Words.convert = function(filepath){

	// Promise
	var deferred = Q.defer();

	// check language
	var lang = undefined;
	var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == 'lang') {
            lang = decodeURIComponent(pair[1]);
        }
    }

	// Get dat stuff
	var load_words = function(data, xhr) {
        // Convert HTML...
        var words = document.createElement("div");
        words.innerHTML = xhr.response;
        var paragraphs = words.querySelectorAll("p");

        // ...to a JSON
        Words.text = {}; // new one!
        for(var i=0;i<paragraphs.length;i++){
            var p = paragraphs[i];
            var id = p.id;
            var html = p.innerHTML;
            Words.text[id] = html;
        }

        // Fulfil promise!
        deferred.resolve(Words.text);
    };

	var request = lang ? pegasus('languages/'+ lang + '_' + filepath) : pegasus(filepath);

	request.then(
		
		// success handler
		load_words,

		// error handler
		function(data, xhr) {
			alert("Couldn't find language " + lang + ". Falling back to English.");

            request = pegasus(filepath);
			request.then(
			    load_words,
			    function(data, xhr) {
			        console.error(data, xhr.status)
			    }
			    );
		}
	);

	// Return Promise
	return deferred.promise;

};