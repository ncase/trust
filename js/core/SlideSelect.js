function SlideSelect(config){

	var self = this;
	self.config = config;

	// DOM
	self.dom = config.dom;

	// Slides
	self.slides = config.slides;

	// Create a dot, and onclick
	self.addDot = function(slide){
		var dot = new SlideSelectDot(slide);
		self.dom.appendChild(dot.dom);
	};

	// Populate dots
	for(var i=0; i<slides.length; i++) self.addDot(slides[i]);

}

function SlideSelectDot(slide){

	var self = this;
	self.slide = slide;

	// DOM
	self.dom = document.createElement("div");
	self.dom.className = "dot";
	
	// On Click
	self.dom.onclick = function(){
		publish("slideshow/goto", [slide.id]);
	};

	// Listen to when the slide changes
	subscribe("slideshow/slideChange", function(id){
		if(id==slide.id){
			self.dom.setAttribute("selected","yes");
		}else{
			self.dom.removeAttribute("selected");
		}
	});

}