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
		self.dom.innerHTML = "";
		self.slideIndex = -1;
		self.currentSlide = null;
	};
	self.reset();

	// Remove ALL
	self.removeAll = function(INSTANT){
		for(var id in self.objects){
			self.removeObject({id:id}, INSTANT);
		}
	};

	// Go to next slide
	self.nextSlide = function(INSTANT){

		// removeAllOnKill?
		if(self.currentSlide && self.currentSlide.removeAllOnKill){
			self.removeAll(true);
		}

		// Update the information
		if(self.slideIndex >= self.slides.length-1) return;
		self.slideIndex++;
		self.currentSlide = self.slides[self.slideIndex];

		// Remove whatever
		var remove = self.currentSlide.remove || [];
		var promisesToRemove = [];
		for(var i=0; i<remove.length; i++){
			var promiseToRemove = self.removeObject(remove[i], INSTANT);
			if(promiseToRemove) promisesToRemove.push(promiseToRemove);
		}
		
		// After removing, add whatever
		var addObjects = function(){
			var add = self.currentSlide.add || [];
			for(var i=0; i<add.length; i++) self.addObject(add[i], INSTANT);
		};
		if(INSTANT || promisesToRemove.length==0) addObjects();
		else Q.all(promisesToRemove).then(addObjects);

		// Send out message!
		publish("slideshow/slideChange", [self.currentSlide.id]);

	};

	// Subscribe to "next slide" message...
	subscribe("slideshow/next", function(){
		self.nextSlide();
	});

	// FORCE go to a certain slide
	self.gotoSlide = function(id){

		// Go ALL the way to the past
		self.reset();

		// And just move all the way forward, what a hack.
		// TODO: a more efficient one that looks at id's FIRST.
		self.nextSlide(true);
		while(self.currentSlide.id != id){
			self.nextSlide(true);
		}

	};

	// Subscribe to the "force goto" message...
	subscribe("slideshow/goto", function(id){
		self.gotoSlide(id);
	});

	// Objects!
	self.objects = {};

	// Add Object
	self.addObject = function(objectConfig, INSTANT){

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
	self.removeObject = function(objectConfig, INSTANT){

		// Find it...
		var obj = self.objects[objectConfig.id];

		// Remove from memory & DOM
		delete self.objects[objectConfig.id];
		return obj.remove(INSTANT); // return a possible promise

	};

}
