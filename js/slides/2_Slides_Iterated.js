SLIDES.push({

	id: "iterated",
	
	onjump: function(self){

		// Iterated Simulation
		self.add({id:"iterated", type:"Iterated", x:130, y:183});
		self.objects.iterated.dehighlightPayoff();
		
	},

	onstart: function(self){

		// Move it
		self.objects.iterated.dom.style.top = 183;

		// Scoreboard!
		self.add({id:"scoreboard", type:"IteratedScoreboard", x:378, y:85});

		// Extra info up top
		_.yourTotalScore = 0;
		self.add({
			id:"info", type:"TextBox",
			x:378, y:45, width:200, height:50, align:"center", size:15
		});
		var _showInfo = function(){
			var infoWords = Words.get("iterated_info_1")+ROUND_INDEX+"/"+ROUNDS.length;
			infoWords += "<br>";
			infoWords += Words.get("iterated_info_2")+_.yourTotalScore;
			self.objects.info.setText(infoWords);
		};

		// ROUNDS
		var ROUNDS = [
			{id:"tft", num:5},
			{id:"all_d", num:4},
			//{id:"all_c", num:4},
			//{id:"grudge", num:5},
			//{id:"prober", num:7}
		];
		ROUND_INDEX = 0;
		ROUND_NUM = 0;

		self.add({
			id:"buttonCheat", type:"Button", x:275, y:453, uppercase:true,
			text_id:"label_cheat",
			message:"iterated/cheat"
		});

		self.add({
			id:"buttonCooperate", type:"Button", x:495, y:450, uppercase:true,
			text_id:"label_cooperate",
			message:"iterated/cooperate"
		});

		listen(self, "iterated/round/start", function(){
			publish("buttonCheat/deactivate");
			publish("buttonCooperate/deactivate");
		});
		listen(self, "iterated/round/end", function(payoffA, payoffB){

			publish("buttonCheat/activate");
			publish("buttonCooperate/activate");

			// Add score!
			self.objects.scoreboard.addScore(payoffA, payoffB);
			_.yourTotalScore += payoffA;
			_showInfo();

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
					self.objects.scoreboard.reset();
					_showInfo();
				}

			}
			
		});

		_showInfo();

	},

	onend: function(self){
		unlisten(self);
		self.clear();
	}

});