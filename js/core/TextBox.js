/*

*/
function TextBox(config){

	var self = this;
	self.id = config.id;

	// Create DOM
	self.dom = document.createElement("div");
	self.dom.className = "object";
	self.dom.classList.add("fader");
	self.dom.classList.add("textbox");

	// Customize
	self.dom.style.left = config.x+"px";
	self.dom.style.top = config.y+"px";
	self.dom.style.width = config.width+"px";
	self.dom.style.height = config.height+"px";

	// Optional params
	if(config.align) self.dom.style.textAlign = config.align;
	if(config.size) self.dom.style.fontSize = config.size;

	// Set Text!
	self.setText = function(words){
		self.dom.innerHTML = words;
	};
	self.setTextID = function(id){
		self.text_id = id;
		self.setText(Words.get(self.text_id));
	};
	self.setTextID(config.text_id);

	// Add...
	self.add = function(INSTANT){
		return _addFade(self, INSTANT);
	};

	// Remove...
	self.remove = function(INSTANT){
		return _removeFade(self, INSTANT);
	};

}