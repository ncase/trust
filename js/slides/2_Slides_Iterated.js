SLIDES.push({

	id: "iterated",
	
	onjump: function(self){

		Tournament.resetGlobalVariables();

		// Iterated Simulation
		self.add({id:"iterated", type:"Iterated", x:130, y:133});
		self.objects.iterated.dehighlightPayoff();

		// Labels
		self.add({
			id:"labelYou", type:"TextBox",
			x:211, y:201, width:50, height:50,
			align:"center", color:"#aaa", size:17,
			text_id:"label_you"
		});
		self.add({
			id:"labelThem", type:"TextBox",
			x:702, y:189, width:50, height:50,
			align:"center", color:"#aaa", size:17,
			text_id:"label_them"
		});
		
	},

	onstart: function(self){

		var o = self.objects;

		o.iterated.introMachine(); // RING RING RING!

		// Words on top & bottom
		self.add({
			id:"topWords", type:"TextBox", text_id:"iterated_intro_top",
			x:130, y:10, width:700, height:100, align:"center"
		});
		self.add({
			id:"btmWords", type:"TextBox", text_id:"iterated_intro_btm",
			x:130, y:410, width:700, height:100, align:"center"
		});

		// Buttons
		self.add({
			id:"buttonCheat", type:"Button", x:275, y:453, uppercase:true,
			text_id:"label_cheat",
			onclick:function(){
				_.answer = "CHEAT";
				publish("slideshow/next");
			}
		});
		self.add({
			id:"buttonCooperate", type:"Button", x:495, y:450, uppercase:true,
			text_id:"label_cooperate",
			onclick:function(){
				_.answer = "COOPERATE";
				publish("slideshow/next");
			}
		});

		// Hide & fade
		_hide(o.topWords); _fadeIn(o.topWords, 150+10);
		_hide(o.btmWords); _fadeIn(o.btmWords, 150+600);
		_hide(o.buttonCheat); _fadeIn(o.buttonCheat, 150+1200);
		_hide(o.buttonCooperate); _fadeIn(o.buttonCooperate, 150+1200);

	},
	onend: function(self){
		self.remove("topWords");
		self.remove("btmWords");
		self.remove("labelYou");
		self.remove("labelThem");
	}

});

SLIDES.push({

	onstart: function(self){

		var o = self.objects;

		// PUBLISH IT
		if(_.answer=="COOPERATE"){
			publish("iterated/cooperate");
		}else{
			publish("iterated/cheat");
		}

		//////////////////////////

		// CHANGE THE BUTTONS
		setTimeout(function(){
			o.buttonCheat.config.onclick = null;
			o.buttonCheat.config.message = "iterated/cheat";
			o.buttonCooperate.config.onclick = null;
			o.buttonCooperate.config.message = "iterated/cooperate";

			publish("buttonCheat/deactivate");
			publish("buttonCooperate/deactivate");
		},1);

		//////////////////////////

		// Move it
		o.iterated.dom.style.top = 183;

		// Scoreboard!
		self.add({id:"scoreboard", type:"IteratedScoreboard", x:378, y:85});

		// Extra info up top
		_.yourTotalScore = 0;
		self.add({
			id:"info", type:"TextBox",
			x:378, y:45, width:200, height:50, align:"center", size:15
		});
		var _showInfo = function(){
			var infoWords = Words.get("iterated_info_1");
			infoWords += "<br>";
			infoWords += Words.get("iterated_info_2")+_.yourTotalScore;
			infoWords = infoWords.replace(/\[X\]/g, (ROUND_INDEX+1)+"");
			infoWords = infoWords.replace(/\[Y\]/g, (ROUNDS.length)+"");
			self.objects.info.setText(infoWords);
		};

		// HIDE
		var _hidden = true;
		_hide(o.scoreboard);
		_hide(o.info);

		// ROUNDS
		// [FOR DEBUGGING]
		/*var ROUNDS = [
			{id:"tft", num:1},
		];*/
		var ROUNDS = [ // and min & max score...
			{id:"tft", num:5}, // min 2, max 11
			{id:"all_d", num:4}, // min -4, max 0
			{id:"all_c", num:4}, // min 8, max 12
			{id:"grudge", num:5}, // min -1, max 11
			{id:"prober", num:7} // min 2, max 15
		]; // TOTAL... MIN 7, MAX 49
		ROUND_INDEX = 0;
		ROUND_NUM = 0;

		listen(self, "iterated/round/start", function(){
			publish("buttonCheat/deactivate");
			publish("buttonCooperate/deactivate");
		});
		listen(self, "iterated/round/end", function(payoffA, payoffB){

			// UN-HIDE
			if(_hidden){
				_hidden = false;
				_fadeIn(o.scoreboard,10);
				_fadeIn(o.info,10);
			}

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

					// NEW OPPONENT
					Scratcher.smallScratch(700, 260, 150, 162,
					function(){
						publish("iterated/newOpponent",[ROUNDS[ROUND_INDEX].id]);
						self.objects.scoreboard.reset();
						_showInfo();
					},function(){
						publish("buttonCheat/activate");
						publish("buttonCooperate/activate");
					});

				}

			}else{
				publish("buttonCheat/activate");
				publish("buttonCooperate/activate");
			}
			
		});

		_showInfo();

	},

	onend: function(self){
		unlisten(self);
		self.clear();
	}

});

// Show your SCORE: and the characters!
SLIDES.push({

	onstart: function(self){

		// Score Text ID
		var scoreTextID;
		var score = _.yourTotalScore;
		if(score==49) scoreTextID="5";
		else if(score>=34) scoreTextID="4";
		else if(score>=22) scoreTextID="3";
		else if(score>=8) scoreTextID="2";
		else if(score==7) scoreTextID="1";
		else scoreTextID="x";
		scoreTextID = "iterated_score_"+scoreTextID;

		// Score text part 1
		self.add({
			id:"score1", type:"TextBox",
			x:24, y:32, width:243, height:26,
			text_id:"iterated_score_start"
		});

		// Score
		self.add({
			id:"score2", type:"TextBox",
			x:114, y:44, width:151, height:132, align:"right", size:123,
			text: _.yourTotalScore+""
		});

		// Score text part 2
		self.add({
			id:"score3", type:"TextBox",
			x:290, y:62, width:639, height:123,
			text: Words.get(scoreTextID)+" "+Words.get("iterated_score_end")+"<br><br>"+Words.get("who_were")
		});

		//////////////////////////////
		//////////////////////////////

		self.add({
			id:"char_tft", type:"CharacterTextBox",
			x:39, y:208, width:470, height:114,
			character: "tft"
		});
		self.add({
			id:"char_all_d", type:"CharacterTextBox",
			x:511, y:208, width:190, height:114,
			character: "all_d"
		});
		self.add({
			id:"char_all_c", type:"CharacterTextBox",
			x:731, y:208, width:200, height:114,
			character: "all_c"
		});
		self.add({
			id:"char_grudge", type:"CharacterTextBox",
			x:39, y:333, width:380, height:114,
			character: "grudge"
		});
		self.add({
			id:"char_prober", type:"CharacterTextBox",
			x:431, y:333, width:500, height:114,
			character: "prober"
		});

		//////////////////////////////
		//////////////////////////////

		// Next...
		self.add({
			id:"next", type:"TextBox",
			x:104, y:478, width:447, height:37,
			text_id: "characters_teaser"
		});

		// Next Button!
		self.add({
			id:"next_button", type:"Button", x:544, y:471, size:"long",
			text_id:"characters_button",
			message:"slideshow/scratch"
		});

	},
	onend: function(self){
		self.clear();
	}

});
