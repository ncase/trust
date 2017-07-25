/*****************************

{
	x:x, y:y, max:5, min:-5,
	value: PD.PAYOFFS_DEFAULT[letter],
	onchange: function(value){
		publish("pd/editPayoffs/"+letter,[value]);
	}
}

*****************************/
function IncDecNumber(config){

	var self = this;
	self.id = config.id;

	// Properties
	self.value = config.value;

	// Create DOM
	var dom = document.createElement("div");
	dom.className = "incdec";
	dom.style.left = config.x+"px";
	dom.style.top = config.y+"px";
	self.dom = dom;

	// Number
	var num = document.createElement("div");
	num.className = "incdec_num";
	dom.appendChild(num);
	self.setValue = function(value){

		// Bounds
		if(value>config.max) value=config.max;
		if(value<config.min) value=config.min;

		// Value & UI
		self.value = value;
		num.innerHTML = (self.value>0) ? "+"+self.value : self.value;

	};
	self.setValue(config.value);

	// Two buttons
	var up = document.createElement("div");
	up.className = "incdec_control";
	up.setAttribute("arrow","up");
	up.onclick = function(){
		self.setValue(self.value+1);
		self.onchange(self.value);
		Loader.sounds.button2.play(); // higher pitch
	};
	dom.appendChild(up);

	var down = document.createElement("div");
	down.className = "incdec_control";
	down.setAttribute("arrow","down");
	down.onclick = function(){
		self.setValue(self.value-1);
		self.onchange(self.value);
		Loader.sounds.button1.play(); // lower pitch
	};
	dom.appendChild(down);

	// On Change...
	self.onchange = function(value){
		config.onchange(value);
	};

	///////////////////////////////////////
	///////////////////////////////////////

	// Add...
	self.add = function(){
		_add(self);
	};

	// Remove...
	self.remove = function(){
		_remove(self);
	};

}