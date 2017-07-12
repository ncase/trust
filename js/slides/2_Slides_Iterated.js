SLIDES.push({

	id: "iterated",
	
	onjump: function(self){

		// Iterated Simulation
		self.add({id:"iterated", type:"Iterated", x:130, y:133});
		self.objects.iterated.dehighlightPayoff();
		
	},

	onstart: function(self){

		// ROUNDS
		var ROUNDS = [
			{id:"tft", num:5},
			//{id:"all_d", num:4},
			//{id:"all_c", num:4},
			//{id:"grudge", num:5},
			//{id:"prober", num:7}
		];
		ROUND_INDEX = 0;
		ROUND_NUM = 0;

		self.add({
			id:"buttonCheat", type:"Button", x:275, y:403, 
			text_id:"label_cheat",
			message:"iterated/cheat"
		});

		self.add({
			id:"buttonCooperate", type:"Button", x:495, y:400, 
			text_id:"label_cooperate",
			message:"iterated/cooperate"
		});

		_.listenerRoundStart = subscribe("iterated/round/start", function(){
			publish("buttonCheat/deactivate");
			publish("buttonCooperate/deactivate");
		});
		_.listenerRoundEnd = subscribe("iterated/round/end", function(){

			publish("buttonCheat/activate");
			publish("buttonCooperate/activate");

			// Next round
			ROUND_NUM++;
			if(ROUND_NUM >= ROUNDS[ROUND_INDEX].num){

				// Next opponent
				ROUND_NUM = 0;
				ROUND_INDEX++; 
				if(ROUND_INDEX >= ROUNDS.length){
					publish("slideshow/scratch"); // NEXT SLIDE, WHATEVER
				}else{
					publish("iterated/newOpponent",[ROUNDS[ROUND_INDEX].id]);
				}

			}
			
		});

	},

	onend: function(self){
		self.clear();
	}

});