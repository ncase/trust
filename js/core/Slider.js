/**************************************
{
	x:0, y:0, width:433,
	min:1, max:25, step:1,
	message: "rules/turns"
}
**************************************/
function Slider(config){

	var self = this;
	self.id = config.id;

	// Create DOM
	var dom = document.createElement("div");
	dom.className = "slider";
	dom.style.left = config.x+"px";
	dom.style.top = config.y+"px";
	dom.style.width = config.width+"px";
	self.dom = dom;

	// Background
	var bg = document.createElement("div");
	bg.className = "slider_bg";
	dom.appendChild(bg);

	// Knob
	var knob = document.createElement("div");
	knob.className = "slider_knob";
	dom.appendChild(knob);

	// Set value
	self.value = 0;
	var _paramToValue = function(param){
		var value = config.min + (config.max-config.min)*param;
		value = Math.round(value/config.step)*config.step;
		return value;
	};
	var _valueToParam = function(value){
		var param = (value-config.min)/(config.max-config.min); // to (0-1)
		return param;
	};
	self.setParam = function(param){

		// Bounds
		var value = config.min + (config.max-config.min)*param;
		value = Math.round(value/config.step)*config.step;
		self.value = value;

		// DOM
		knob.style.left = self.value*config.width-15;

	};
	self.setValue = function(value){

		// Set
		self.value = value;

		// DOM with param
		var param = _valueToParam(self.value);
		knob.style.left = param*(config.width-30);

	};
	if(config.message) subscribe(config.message, self.setValue);

	// Mouse events
	var _isDragging = false;
	var _offsetX = 0;
	var _mouseToParam = function(event){

		// Mouse to Param to Value
		var param = (event.clientX - _offsetX - dom.getBoundingClientRect().left - 8)/(config.width-30);
		if(param<0) param=0;
		if(param>1) param=1;
		var value = _paramToValue(param);

		// Publish these changes! (only if ACTUALLY changed)
		if(self.value != value){
			if(config.message) publish(config.message, [value]);
			if(config.onchange) config.onchange(value);
		}

	};
	dom.addEventListener("mousedown",function(event){
		if(config.onselect) config.onselect();
		_mouseToParam(event);
		_isDragging = true;
		_offsetX = 0;
	},false);
	knob.addEventListener("mousedown",function(event){
		_isDragging = true;
		if(config.onselect) config.onselect();
		_offsetX = event.clientX - knob.getBoundingClientRect().left;
	},false);
	window.addEventListener("mousemove",function(event){
		if(_isDragging) _mouseToParam(event);
	},false);
	window.addEventListener("mouseup",function(){
		_isDragging = false;
	},false);

	////////////////////////////////////////

	// Add...
	self.add = function(INSTANT){
		return _add(self, INSTANT);
	};

	// Remove...
	self.remove = function(INSTANT){
		return _remove(self, INSTANT);
	};

}
