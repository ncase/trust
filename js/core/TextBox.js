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

	// All the text boxes, yo
	self.boxes = config.boxes ? config.boxes : [config.box];

	// Create each textbox...
	for(var i=0; i<self.boxes.length; i++){

		// DOM
		var textbox = document.createElement("div");
		self.dom.appendChild(textbox);

		// Customize
		var box = self.boxes[i];
		textbox.style.left = box.x+"px";
		textbox.style.top = box.y+"px";
		textbox.style.width = box.width+"px";
		textbox.style.height = box.height+"px";
		textbox.innerHTML = Words.get(box.text_id);

		// Optional params
		if(box.align) textbox.style.textAlign = box.align;
		if(box.size) textbox.style.fontSize = box.size;

	}

	// Add...
	self.add = function(INSTANT){
		return _addFade(self, INSTANT);
	};

	// Remove...
	self.remove = function(INSTANT){
		return _removeFade(self, INSTANT);
	};

}