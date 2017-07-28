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
	var pathending = window.location.pathname.split('/').pop();

	if (pathending.substring(pathending.length-5) == '.html') {
        lang = pathending.substring(0, pathending.length-5);
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

	var request = lang ? pegasus(lang + '_' + filepath) : pegasus(filepath);

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