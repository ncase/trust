function ImageBox(config){

	var self = this;
	self.id = config.id;

	// Create DOM
	self.dom = new Image();
	self.dom.className = "object";
	self.dom.src = config.src;

	// Customize
	_configText(config, self.dom);

	// Add & Remove
	self.add = function(){ _add(self); };
	self.remove = function(){ _remove(self); };

}