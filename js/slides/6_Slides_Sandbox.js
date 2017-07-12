SLIDES.push({

	id: "sandbox",
	onstart: function(self){

		// The tournament simulation
		Tournament.resetGlobalVariables();
		self.add({id:"tournament", type:"Tournament", x:-20, y:-20},);

		// Screw it, just ALL of the Sandbox UI
		self.add({id:"sandbox", type:"SandboxUI"});

		// Button for next...
		self.add({
			id:"button_next", type:"Button",
			x:510, y:500, 
			text_id:"label_next",
			message: "slideshow/scratch"
		});
		
	},
	onend: function(self){
		self.clear();
	}

});