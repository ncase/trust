SLIDES.push({

	id: "sandbox",
	onstart: function(self){

		// The tournament simulation
		Tournament.resetGlobalVariables();
		self.add({id:"tournament", type:"Tournament", x:-20, y:-20},);

		// Screw it, just ALL of the Sandbox UI
		self.add({id:"sandbox", type:"SandboxUI"});

		// Label & Button for next...
		self.add({
			id:"label_next", type:"TextBox",
			x:14, y:481, width:800, align:"right",
			text_id: "sandbox_end"
		});
		self.add({
			id:"button_next", type:"Button",
			x:831, y:465, size:"short",
			text_id:"label_next",
			message: "slideshow/scratch"
		});
		
	},
	onend: function(self){
		self.clear();
	}

});