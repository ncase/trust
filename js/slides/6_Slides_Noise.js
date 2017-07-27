// [FOR DEBUGGING]

// One-off with noise
SLIDES.push({
	id: "noise",
	onstart: function(self){

		var o = self.objects;

		Tournament.resetGlobalVariables();

		// Iterated Simulation
		self.add({id:"iterated", type:"Iterated", x:130, y:133});
		o.iterated.dehighlightPayoff();
		o.iterated.playerA.chooseHat("tft");

		// Words on top & bottom
		self.add({
			id:"topWords", type:"TextBox", text_id:"noise_1",
			x:130, y:35, width:700, height:100, align:"center"
		});
		self.add({
			id:"btmWords", type:"TextBox", text_id:"noise_1_end",
			x:130, y:410, width:700, height:100, align:"center"
		});

		// STAGES
		var STAGES = [
			{button:"cooperate", message:"cooperate"},
			{button:"cooperate", message:"TRIP"},
			{button:"cooperate", message:"cooperate"},
			{button:"cheat", message:"cheat"}
		];
		var STAGE_INDEX = 0;

		// ONE Button
		self.add({
			id:"button", type:"Button",
			x:383, y:463, text_id:"label_cooperate", uppercase:true,
			onclick: function(){

				// Make sim go
				var s = STAGES[STAGE_INDEX];
				publish("iterated/"+s.message);
				o.button.deactivate();

				// Hide words
				_hide(o.topWords); 
				_hide(o.btmWords); 

			}
		});

		// Re-activate...
		var _foreverWar = false;
		var _foreverMove = "cheat";
		listen(self, "iterated/round/end", function(){

			if(_foreverWar){
				publish("iterated/"+_foreverMove);
				if(_foreverMove=="cheat") _foreverMove="cooperate";
				else if(_foreverMove=="cooperate") _foreverMove="cheat";
			}else{

				STAGE_INDEX++;

				// New words
				o.topWords.setTextID("noise_"+(STAGE_INDEX+1));
				o.btmWords.setTextID("noise_"+(STAGE_INDEX+1)+"_end");
				_fadeIn(o.topWords, 100);
				_fadeIn(o.btmWords, 300);

				// Next stage
				if(STAGE_INDEX>=STAGES.length){

					publish("iterated/cooperate");
					_foreverWar = true;
					
					// The FINAL buttons... remove the button & put it back in.
					self.remove("button");
					self.add({
						id:"button", type:"Button",
						x:304, y:463, text_id:"noise_5_btn", size:"long",
						message: "slideshow/scratch"
					});

				}else{

					// Reactivate buttons
					var s = STAGES[STAGE_INDEX];
					o.button.setText("label_"+s.button);
					o.button.activate();

				}

			}

		});

	},
	onend: function(self){
		unlisten(self);
		self.clear();
	}
});

// New characters
SLIDES.push({

	onstart: function(self){

		// WORDS
		self.add({
			id:"score1", type:"TextBox",
			x:160, y:20, width:640,
			text_id:"noise_characters"
		});

		// CHARS
		self.add({
			id:"char_tf2t", type:"CharacterTextBox",
			x:160, y:70, width:640,
			character: "tf2t"
		});
		self.add({
			id:"char_pavlov", type:"CharacterTextBox",
			x:160, y:190, width:640,
			character: "pavlov"
		});
		self.add({
			id:"char_random", type:"CharacterTextBox",
			x:160, y:320, width:640,
			character: "random"
		});

		// Next...
		self.add({
			id:"next", type:"TextBox",
			x:160, y:420, width:640, align:"right",
			text_id: "noise_characters_end"
		});

		// Next Button!
		self.add({
			id:"next_button", type:"Button", x:460, y:460, size:"long",
			text_id:"noise_characters_btn",
			message:"slideshow/scratch"
		});

	},
	onend: function(self){
		self.clear();
	}

});

// Tournament: simpleton wins
SLIDES.push({
	
	//id:"noise",// [FOR DEBUGGING]
	
	onstart: function(self){

		var o = self.objects;

		// Tournament
		Tournament.resetGlobalVariables();
		Tournament.INITIAL_AGENTS = [
			{strategy:"tf2t", count:3},
			{strategy:"pavlov", count:3},
			{strategy:"random", count:3},
			{strategy:"tft", count:3},
			{strategy:"all_c", count:13}
		];
		PD.NOISE = 0.05;
		self.add({id:"tournament", type:"Tournament", x:-20, y:20});

		// Words to the side
		self.add({
			id:"text", type:"TextBox",
			x:510, y:30, width:450, height:500,
			text_id:"noise_evo_1"
		});

		// BETS
		var _addButton = function(character, x, y){
			(function(character, x, y){
				self.add({
					id:"bet_"+character, type:"Button", x:x, y:y, 
					text_id: "icon_"+character,
					tooltip: "who_"+character,
					onclick:function(){
						_.answer = character;
						publish("slideshow/next");
					}
				});
			})(character, x, y);
		};
		var x = 510;
		var y = 295;
		var dx = 200;
		var dy = 70;
		_addButton("tf2t", x, y); _addButton("pavlov", x+dx, y);
		_addButton("random", x, y+dy); _addButton("tft", x+dx, y+dy);
		_addButton("all_c", x, y+dy*2);

		// WHO'S WHO?
		self.add({
			id:"forgot", type:"TextBox",
			x:715, y:435, width:190, height:50,
			align:"center", color:"#aaa", size:15,
			text_id:"forgot_whos_who"
		});

	},
	onend: function(self){
		self.remove("bet_all_c");
		self.remove("bet_tft");
		self.remove("bet_tf2t");
		self.remove("bet_pavlov");
		self.remove("bet_random");
		self.remove("forgot");
	}
});

SLIDES.push({
	onstart: function(self){

		var o = self.objects;

		// Words
		var words = Words.get("noise_evo_2").replace(/\[CHAR\]/g, "<span class='"+_.answer+"'>"+Words.get("label_"+_.answer)+"</span>");
		o.text.setText(words);
		_hide(o.text); _fadeIn(o.text, 100);

		/////////////////////////////////////////
		// BUTTONS for playing //////////////////
		/////////////////////////////////////////

		var x = 172;
		var y = 175;
		var dy = 70;
		self.add({
			id:"playButton", type:"Button", size:"short",
			x:x, y:y, text_id:"label_start",
			onclick: function(){
				if(o.tournament.isAutoPlaying){
					publish("tournament/autoplay/stop");
				}else{
					publish("tournament/autoplay/start");
				}
			}
		});
		listen(_, "tournament/autoplay/stop",function(){
			o.playButton.setText("label_start");
		});
		listen(_, "tournament/autoplay/start",function(){
			o.playButton.setText("label_stop");
		});
		self.add({
			id:"stepButton", type:"Button",  size:"short",
			x:x, y:y+dy, text_id:"label_step", message:"tournament/step"
		});
		self.add({
			id:"resetButton", type:"Button", size:"short",
			x:x, y:y+dy*2, text_id:"label_reset", message:"tournament/reset"
		});

		/////////////////////////////////////////
		// SHOW THE NEXT WORDS, and a NEXT

		// NEXT
		var reproduceSteps = 0;
		_.misc = {};
		listen(_.misc, "tournament/step/completed", function(step){
			if(step=="reproduce"){
				reproduceSteps++;
				if(reproduceSteps==6){
					
					// WORDS
					var words = (_.answer=="pavlov") ? Words.get("noise_evo_2_2_correct") : Words.get("noise_evo_2_2_incorrect");
					words += " ";
					words += Words.get("noise_evo_2_2");
					self.add({
						id:"text_next", type:"TextBox",
						x:510, y:160, width:450,
						text: words
					});
					_hide(o.text_next); _fadeIn(o.text_next, 100);

					// BUTTON
					self.add({
						id:"btn_next", type:"Button", x:510, y:366, 
						text_id:"noise_evo_2_2_btn", size:"long",
						message:"slideshow/next"
					});
					_hide(o.btn_next); _fadeIn(o.btn_next, 300);


				}
			}
		});

	},
	onend: function(self){
		self.remove("text_next");
		self.remove("btn_next");
		unlisten(_.misc);
	}
});

SLIDES.push({
	onstart: function(self){

		var o = self.objects;

		// Words
		o.text.setTextID("noise_evo_3");
		_hide(o.text); _fadeIn(o.text, 100);

		// Tournament
		Tournament.resetGlobalVariables();
		Tournament.INITIAL_AGENTS = [
			{strategy:"tf2t", count:3},
			{strategy:"pavlov", count:3},
			{strategy:"random", count:3},
			{strategy:"tft", count:3},
			{strategy:"all_d", count:13}
		];
		PD.NOISE = 0.05;
		o.tournament.reset();

		// HIDE PLAYER
		_hide(o.playButton); o.playButton.deactivate();
		_hide(o.stepButton); o.stepButton.deactivate();
		_hide(o.resetButton); o.resetButton.deactivate();

		// BETS
		var _addButton = function(character, x, y){
			(function(character, x, y){
				self.add({
					id:"bet_"+character, type:"Button", x:x, y:y, 
					text_id: "icon_"+character,
					tooltip: "who_"+character,
					onclick:function(){
						_.answer = character;
						publish("slideshow/next");
					}
				});
			})(character, x, y);
		};
		var x = 510;
		var y = 295;
		var dx = 200;
		var dy = 70;
		_addButton("tf2t", x, y); _addButton("pavlov", x+dx, y);
		_addButton("random", x, y+dy); _addButton("tft", x+dx, y+dy);
		_addButton("all_d", x, y+dy*2);

		// WHO'S WHO?
		self.add({
			id:"forgot", type:"TextBox",
			x:715, y:435, width:190, height:50,
			align:"center", color:"#aaa", size:15,
			text_id:"forgot_whos_who"
		});

	},
	onend: function(self){
		self.remove("bet_all_d");
		self.remove("bet_tft");
		self.remove("bet_tf2t");
		self.remove("bet_pavlov");
		self.remove("bet_random");
		self.remove("forgot");
	}
});

SLIDES.push({
	onstart: function(self){

		var o = self.objects;

		// SHOW PLAYER
		_fadeIn(o.playButton,1); o.playButton.activate();
		_fadeIn(o.stepButton,1); o.stepButton.activate();
		_fadeIn(o.resetButton,1); o.resetButton.activate();
		o.playButton.setText("label_start");

		// Words
		var words = Words.get("noise_evo_4").replace(/\[CHAR\]/g, "<span class='"+_.answer+"'>"+Words.get("label_"+_.answer)+"</span>");
		o.text.setText(words);
		_hide(o.text); _fadeIn(o.text, 100);

		/////////////////////////////////////////
		// SHOW THE NEXT WORDS, and a NEXT

		// NEXT
		var reproduceSteps = 0;
		_.misc = {};
		listen(_.misc, "tournament/step/completed", function(step){
			if(step=="reproduce"){
				reproduceSteps++;
				if(reproduceSteps==8){

					// WORDS
					var words = (_.answer=="tf2t") ? Words.get("noise_evo_4_2_correct") : Words.get("noise_evo_4_2_incorrect");
					words += " ";
					words += Words.get("noise_evo_4_2");
					self.add({
						id:"text_next", type:"TextBox",
						x:510, y:116, width:450,
						text: words
					});
					_hide(o.text_next); _fadeIn(o.text_next, 100);

					// BUTTON
					self.add({
						id:"btn_next", type:"Button", x:510, y:446, 
						text_id:"noise_evo_4_2_btn", size:"long",
						message:"slideshow/next"
					});
					_hide(o.btn_next); _fadeIn(o.btn_next, 300);

				}
			}
		});

	},
	onend: function(self){
		self.remove("text_next");
		self.remove("btn_next");
		unlisten(_.misc);
	}
});

SLIDES.push({
	onstart: function(self){

		var o = self.objects;
		_.misc = {};

		// Words
		o.text.setTextID("noise_evo_5");
		_hide(o.text); _fadeIn(o.text, 100);

		// Tournament
		o.tournament.reset();

		// Slider!
		var x = 510;
		var y = 200;
		self.add({
			id:"noiseLabel", type:"TextBox",
			x:x, y:y, width:450, noSelect:true
		});
		self.add({
			id:"noiseSlider", type:"Slider",
			x:x, y:y+55, width:450,
			min:0.00, max:0.50, step:0.01,
			message: "rules/noise"
		});
		var _updateLabel = function(value){
			value = Math.round(value*100);
			var words = Words.get("sandbox_rules_3");
			words = words.replace(/\[N\]/g, value+""); // replace [N] with the number value
			o.noiseLabel.setText("<i>"+words+"</i>");
		};
		listen(_.misc, "rules/noise", function(value){
			_updateLabel(value);
			o.tournament.reset();
		});
		o.noiseSlider.setValue(0.05);
		_updateLabel(0.05);
		_hide(o.noiseLabel); _fadeIn(o.noiseLabel, 300);
		_hide(o.noiseSlider); _fadeIn(o.noiseSlider, 300);

		// Continue whenever you want to...
		listen(_.misc, "tournament/autoplay/start",function(){
			if(_showContinue) _showContinue();
		});
		var _showContinue = function(){
			_showContinue = null;
			self.add({
				id:"continueLabel", type:"TextBox",
				x:565, y:405, width:400,
				align:"right", color:"#aaa", size:17,
				text_id:"noise_evo_5_continue"
			});
			self.add({
				id:"continueButton", type:"Button",
				x:855, y:440, size:"short",
				text_id:"label_continue",
				message: "slideshow/next"
			});
			_hide(o.continueLabel); _fadeIn(o.continueLabel, 100);
			_hide(o.continueButton); _fadeIn(o.continueButton, 100);
		};

	},
	onend: function(self){
		unlisten(_.misc);
		self.remove("noiseLabel");
		self.remove("noiseSlider");
		var o = self.objects;
		if(o.continueLabel) self.remove("continueLabel");
		if(o.continueButton) self.remove("continueButton");
		self.remove("text");
	}
});

SLIDES.push({
	onstart: function(self){

		var o = self.objects;

		// Words
		self.add({
			id:"text", type:"TextBox",
			x:510, y:10, width:450, height:500,
			text_id:"noise_evo_6"
		});
		_hide(o.text); _fadeIn(o.text, 100);

		// Next button
		self.add({
			id:"button", type:"Button", x:510, y:466, 
			text_id:"noise_evo_6_btn", size:"long",
			message:"slideshow/scratch"
		});
		_hide(o.button); _fadeIn(o.button, 500);

	},
	onend: function(self){
		self.clear();
		unlisten(self);
		unlisten(_);
		unlisten(_.misc);
	}
});
