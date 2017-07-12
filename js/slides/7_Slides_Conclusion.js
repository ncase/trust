SLIDES.push({
	id: "conclusion",
	onstart: function(self){

		// Splash in background
		self.add({ id:"splash", type:"Splash" });

		// Circular Wordbox
		self.add({
			id:"text", type:"TextBox",
			x:160, y:10, width:640, height:500, align:"center", size:19,
			text_id:"conclusion"
		});

		// Button
		self.add({
			id:"button", type:"Button", x:385, y:466, 
			text_id:"conclusion_button", fontSize:16, upperCase:false,
			message:"slideshow/scratch"
		});

	},
	onend: function(self){
		self.clear();
	}
});