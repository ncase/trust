function TextBox(config){

	var self = this;
	self.id = config.id;

	// Create DOM
	self.dom = document.createElement("div");
	self.dom.className = "object";
	self.dom.classList.add("textbox");

	// Customize
	_configText(config, self.dom);

	// Set Text!
	self.setText = function(words){
		self.dom.innerHTML = words;
	};
	self.setTextID = function(id){
		self.text_id = id;
		self.setText(Words.get(self.text_id));
	};
	if(config.text_id) self.setTextID(config.text_id);
	else if(config.text) self.setText(config.text);

	// Add & Remove
	self.add = function(){ _add(self); };
	self.remove = function(){ _remove(self); };

}

function CharacterTextBox(config){

	var self = this;
	self.id = config.id;

	// Create DOM
	self.dom = document.createElement("div");
	self.dom.className = "object";
	self.dom.classList.add("textbox");
	self.dom.classList.add("character");
	self.dom.classList.add(config.character);

	// Customize
	_configText(config, self.dom);

	// Peep
	var peep = document.createElement("div");
	peep.id = "peep";
	peep.setAttribute("char", config.character);
	self.dom.appendChild(peep);

	// Description
	var desc = document.createElement("div");
	desc.id = "desc";
	desc.innerHTML = Words.get("character_"+config.character);
	self.dom.appendChild(desc);

	// Add & Remove
	self.add = function(){ _add(self); };
	self.remove = function(){ _remove(self); };

}