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

// Place Your Bets
SLIDES.push({
	onstart: function(self){

		// Tournament
		Tournament.INITIAL_AGENTS = [
			{strategy:"all_c", count:15},
			{strategy:"all_d", count:5},
			{strategy:"tft", count:5}
		];
		self.add({id:"tournament", type:"Tournament", x:-20, y:20});

		// Words to the side
		self.add({
			id:"text", type:"TextBox",
			x:510, y:30, width:450, height:500,
			text_id:"evo_bets"
		});

		// Button
		self.add({
			id:"button_step", type:"Button",
			x:510, y:300, size:"short",
			text_id:"button_step",
			message: "tournament/step"
		});

		// Button
		self.add({
			id:"button_next", type:"Button",
			x:510, y:400, size:"short",
			text_id:"label_next",
			onclick:function(){
				_.answer = "tft";
				publish("slideshow/scratch");
			}
		});

	},
	onend: function(self){
		self.clear();
	}
});

// Result: First Round

// Result: Second Round

// Result: til the end...

// Explanation

// (Yup, even w Grudgers & Detectives)

// Problem 1: Number of interactions

// Problem 2: Payoffs

// Teaser...


