function Button(config){

	var self = this;
	self.id = config.id;

	// Create DOM
	var button = document.createElement("button");
	button.className = "object";
	button.classList.add("fader");
	self.dom = button;

	// Customize DOM
	button.style.left = config.x+"px";
	button.style.top = config.y+"px";
	button.innerHTML = config.text;

	// On click...
	button.onclick = function(){
		publish(config.message);
	};

	// Add...
	self.add = function(INSTANT){
		return _addFade(self, INSTANT);
	};

	// Remove...
	self.remove = function(INSTANT){
		return _removeFade(self, INSTANT);
	};

}