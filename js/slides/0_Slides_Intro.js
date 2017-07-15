/********************

0. Introduction
1. One Game
2. Repeated Game
3. One Tournament
4. Repeated Tournament
5. Making Mistaeks
6. Sandbox
7. Conclusion
X. Credits

Labels should be in the en.html folder

*********************/
SLIDES.push({

	id: "intro",
	onstart: function(self){

		// Splash in background
		self.add({ id:"splash", type:"Splash" });

		// Circular Wordbox
		self.add({
			id:"intro_text", type:"TextBox",
			x:130, y:10, width:700, height:500, align:"center",
			text_id:"intro"
		});

		// Button
		self.add({
			id:"intro_button", type:"Button", x:304, y:466, size:"long",
			text_id:"intro_button", 
			message:"slideshow/scratch"
		});

	},
	onend: function(self){
		self.clear();
	}

});