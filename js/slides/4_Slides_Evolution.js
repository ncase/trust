// Evolution Intro
SLIDES.push({
	id: "evolution",
	onstart: function(self){

		// Words to the side
		self.add({
			id:"text", type:"TextBox",
			x:510, y:30, width:450, height:500,
			text_id:"evolution_intro"
		});

		// Button
		self.add({
			id:"button", type:"Button", x:385, y:466, 
			text_id:"evolution_intro_button", fontSize:16, upperCase:false,
			message:"slideshow/scratch"
		});

	},
	onend: function(self){
		self.clear();
	}
});