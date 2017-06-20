function WordBox(config){

	var self = this;
	self.id = config.id;

	// Create DOM
	var words = document.createElement("div");
	words.className = "object";
	words.classList.add("fader");
	self.dom = words;

	// Customize DOM
	words.style.left = config.x+"px";
	words.style.top = config.y+"px";
	words.style.width = config.width+"px";
	words.style.height = config.height+"px";
	words.innerHTML = config.text;

	// Add...
	self.add = function(INSTANT){
		return _addFade(self, INSTANT);
	};

	// Remove...
	self.remove = function(INSTANT){
		return _removeFade(self, INSTANT);
	};

}
