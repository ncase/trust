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
	for(var i=0; i<self.slides.length; i++){
		var slide = self.slides[i];
		if(slide.id){
			self.addDot(slide);
		}
	}

}

function SlideSelectDot(slide){

	var self = this;
	self.slide = slide;

	// DOM
	self.dom = document.createElement("div");
	self.dom.className = "dot";
	self.dom.setAttribute("data-balloon", Words.get("chapter_"+slide.id));
	self.dom.setAttribute("data-balloon-pos", "up");
	
	// On Click
	self.dom.onclick = function(){
		publish("slideshow/scratch", [slide.id]);
	};

	// Listen to when the slide changes
	subscribe("slideshow/slideChange", function(id){
		if(!id) return; // nah
		if(id==slide.id){
			self.dom.setAttribute("selected","yes");
		}else{
			self.dom.removeAttribute("selected");
		}
	});

}