// Show the characters
SLIDES.push({

	id: "tournament",

	onstart: function(self){

		// Text
		self.add({
			id:"text", type:"TextBox",
			x:160, y:10, width:640, height:500, align:"center", size:19,
			text_id:"characters"
		});

		// Button
		self.add({
			id:"button", type:"Button", x:385, y:466, 
			text_id:"characters_button", fontSize:16, upperCase:false,
			message:"slideshow/scratch"
		});

	},
	onend: function(self){
		self.clear();
	}

});

// round-robin tournament, place your bets
SLIDES.push({
	onstart: function(self){

		// Tournament
		Tournament.INITIAL_AGENTS = [
			{strategy:"tft", count:1},
			{strategy:"all_d", count:1},
			{strategy:"all_c", count:1},
			{strategy:"grudge", count:1},
			{strategy:"prober", count:1}
		];
		self.add({id:"tournament", type:"Tournament", x:-20, y:20});

		// Words to the side
		self.add({
			id:"text", type:"TextBox",
			x:510, y:30, width:450, height:500,
			text_id:"place_your_bets"
		});

		// Button
		self.add({
			id:"button", type:"Button",
			x:510, y:400, 
			text_id:"label_tft",
			onclick:function(){
				_.answer = "tft";
				publish("slideshow/next");
			}
		});

	},
	onend: function(self){
		self.remove("text");
		self.remove("button");
	}
});

// go through it ONE BY ONE
SLIDES.push({
	onstart: function(self){

		// Button
		self.add({
			id:"button", type:"Button",
			x:510, y:400, 
			text_id:"next_match",
			onclick:function(){
				_.answer = "tft";
				publish("slideshow/next");
			}
		});

	},
	onend: function(self){
		self.remove("button");
	}
});

// who the winner is!
SLIDES.push({
	onstart: function(self){

		// Words to the side
		self.add({
			id:"text", type:"TextBox",
			x:510, y:30, width:450, height:500,
			text_id:"tournament_winner"
		});

		// Button
		self.add({
			id:"button", type:"Button", x:385, y:466, 
			text_id:"tournament_teaser", fontSize:16, upperCase:false,
			message:"slideshow/scratch"
		});

	},
	onend: function(self){
		self.clear();
	}
});