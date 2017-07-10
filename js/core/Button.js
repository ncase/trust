function Button(config){

	var self = this;
	self.id = config.id;

	// Create DOM
	var button = document.createElement("div");
	button.className = "object";
	button.classList.add("fader");
	button.classList.add("button");
	self.dom = button;

	// BG
	var bg = document.createElement("div");
	bg.id = "background";
	var text = document.createElement("div");
	text.id = "text";
	var hitbox = document.createElement("div");
	hitbox.id = "hitbox";
	button.appendChild(bg);
	button.appendChild(text);
	button.appendChild(hitbox);

	// Customize DOM
	button.style.left = config.x+"px";
	button.style.top = config.y+"px";
	if(config.fontSize){
		text.style.fontSize = config.fontSize;
		text.style.top = 14+(20-config.fontSize);
	}
	config.upperCase = (config.upperCase===undefined) ? true : config.upperCase;
	self.setText = function(text_id){
		var words = Words.get(text_id);
		if(config.upperCase) words=words.toUpperCase();
		text.innerHTML = words;
	};
	self.setText(config.text_id);

	// On hover...
	hitbox.onmouseover = function(){
		if(self.active) button.setAttribute("hover","yes");
	};
	hitbox.onmouseout = function(){
		if(self.active) button.removeAttribute("hover");
	};

	// On click...
	hitbox.onclick = function(){
		if(self.active){
			if(config.onclick) config.onclick();
			if(config.message) publish(config.message);
		}
	};

	// Activate/Deactivate
	self.active = true;
	self.activate = function(){
		self.active = true;
		button.removeAttribute("deactivated");
	};
	self.deactivate = function(){
		self.active = false;
		button.setAttribute("deactivated","yes");
		button.removeAttribute("hover");
	};
	if(config.active===undefined) config.active=true;
	if(!config.active) self.deactivate();

	// Listeners!
	subscribe(self.id+"/activate", self.activate);
	subscribe(self.id+"/deactivate", self.deactivate);

	// Add...
	self.add = function(INSTANT){
		return _addFade(self, INSTANT);
	};

	// Remove...
	self.remove = function(INSTANT){
		return _removeFade(self, INSTANT);
	};

}