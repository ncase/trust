var SLIDES = [];

function Slideshow(config){

	var self = this;
	self.config = config;

	// DOM
	self.dom = config.dom;

	// Slide information
	self.slides = config.slides;

	// Reset: INITIAL VARIABLES
	self.reset = function(){

		// On End?
		if(self.currentSlide && self.currentSlide.onend){
			self.currentSlide.onend(self);
		}

		// Reset
		self.dom.innerHTML = "";
		self.slideIndex = -1;
		self.currentSlide = null;
		self.objects = {};

	};
	self.reset();

	//////////////////////////////////////////////////
	/////////////// GO TO NEXT SLIDE /////////////////
	//////////////////////////////////////////////////

	// Go to next slide
	self.nextSlide = function(INSTANT){

		// On End?
		if(self.currentSlide && self.currentSlide.onend){
			self.currentSlide.onend(self);
		}

		// Update the information
		if(self.slideIndex >= self.slides.length-1) return;
		self.slideIndex++;
		self.currentSlide = self.slides[self.slideIndex];

		// On Start
		if(self.currentSlide.onstart){
			self.currentSlide.onstart(self);
		}

		// Send out message!
		publish("slideshow/slideChange", [self.currentSlide.id]);

	};

	// Subscribe to "next slide" message...
	subscribe("slideshow/next", function(){
		self.nextSlide();
	});



	//////////////////////////////////////////////////
	///////////// SLIDESHOW OBJECTS //////////////////
	//////////////////////////////////////////////////

	// Objects!
	self.objects = {};

	// Add Object
	self.add = function(objectConfig, INSTANT){

		INSTANT = true; // hack, sure.

		// Create object
		var Classname = window[objectConfig.type];
		var obj = new Classname(objectConfig);
		obj.slideshow = self;

		// Remember it
		self.objects[objectConfig.id] = obj;

		// Add it for real!
		return obj.add(INSTANT); // return a possible promise

	};

	// Remove Object
	self.remove = function(objectID, INSTANT){

		INSTANT = true; // hack, sure.

		// Find it...
		var obj = self.objects[objectID];

		// Remove from memory & DOM
		delete self.objects[objectID];
		return obj.remove(INSTANT); // return a possible promise

	};

	// Clear: Remove ALL objects
	self.clear = function(INSTANT){
		for(var id in self.objects){
			self.remove(id, INSTANT);
		}
	};


	//////////////////////////////////////////////////
	///////////// FORCE GO TO SLIDE //////////////////
	//////////////////////////////////////////////////

	// FORCE go to a certain slide
	self.gotoSlide = function(id){

		// Go ALL the way to the past
		self.reset();

		// Slide & SlideIndex
		self.currentSlide = self.slides.find(function(slide){
			return slide.id==id;
		});
		self.slideIndex = self.slides.indexOf(self.currentSlide);

		// On JUMP & on Start
		if(self.currentSlide.onjump) self.currentSlide.onjump(self);
		if(self.currentSlide.onstart) self.currentSlide.onstart(self);

		// Send out message!
		publish("slideshow/slideChange", [self.currentSlide.id]);

	};

	// Subscribe to the "force goto" message...
	subscribe("slideshow/goto", function(id){
		self.gotoSlide(id);
	});

}
