// One-off with noise
SLIDES.push({
	id: "noise",
	onstart: function(self){

		var o = self.objects;

		// Iterated Simulation
		self.add({id:"iterated", type:"Iterated", x:130, y:133});
		self.objects.iterated.dehighlightPayoff();

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
			{button:"cooperate", message:"cheat"},
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
	id: "noise",
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

	},
	onend: function(self){
		self.remove("bet_all_c");
		self.remove("bet_tft");
		self.remove("bet_tf2t");
		self.remove("bet_pavlov");
		self.remove("bet_random");
	}
});

SLIDES.push({
	onstart: function(self){

		var o = self.objects;

		// Words
		o.text.setTextID("noise_evo_2");
		_hide(o.text); _fadeIn(o.text, 100);

		/////////////////////////////////////////
		// BUTTONS for playing //////////////////
		/////////////////////////////////////////

		var x = 135;
		var y = 175;
		var dy = 70;
		self.add({
			id:"playButton", type:"Button",
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
			id:"stepButton", type:"Button", 
			x:x, y:y+dy, text_id:"label_step", message:"tournament/step"
		});
		self.add({
			id:"resetButton", type:"Button",
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
					publish("slideshow/next");
				}
			}
		});

	},
	onend: function(self){
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

	},
	onend: function(self){
		self.remove("bet_all_c");
		self.remove("bet_tft");
		self.remove("bet_tf2t");
		self.remove("bet_pavlov");
		self.remove("bet_random");
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
		o.text.setTextID("noise_evo_4");
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
					publish("slideshow/next");
				}
			}
		});

	},
	onend: function(self){
		unlisten(_.misc);
	}
});

// TODO: SMALLER SANDBOX-PLAY BUTTONS

SLIDES.push({
	onstart: function(self){

		var o = self.objects;

		// Words
		o.text.setTextID("noise_evo_5");
		_hide(o.text); _fadeIn(o.text, 100);

		// Tournament
		o.tournament.reset();

		// Slider!
		var x = 510;
		var y = 100;
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
		_.misc = {};
		var _updateLabel = function(value){
			value = Math.round(value*100);
			var words = Words.get("sandbox_rules_3");
			words = words.replace(/\[N\]/g, value+""); // replace [N] with the number value
			o.noiseLabel.setText(words);
		};
		listen(_.misc, "rules/noise", function(value){
			_updateLabel(value);
			o.tournament.reset();
		});
		o.noiseSlider.setValue(0.05);
		_updateLabel(0.05);

		// Continue whenever you want to...
		var x = 510;
		var y = 300;
		self.add({
			id:"continueLabel", type:"TextBox",
			x:x, y:y+5, width:200, height:50,
			align:"right", color:"#aaa", size:17,
			text_id:"noise_evo_6_continue"
		});
		self.add({
			id:"continueButton", type:"Button",
			x:x+215, y:y, size:"short",
			text_id:"label_continue",
			message: "slideshow/next"
		});

	},
	onend: function(self){
		unlisten(_.misc);
		self.remove("noiseLabel");
		self.remove("noiseSlider");
		self.remove("continueLabel");
		self.remove("continueButton");
	}
});

SLIDES.push({
	onstart: function(self){

		var o = self.objects;

		// Words
		o.text.setTextID("noise_evo_6");
		_hide(o.text); _fadeIn(o.text, 100);

		// Next button
		self.add({
			id:"button", type:"Button", x:510, y:466, 
			text_id:"noise_evo_6_btn", size:"long",
			message:"slideshow/scratch"
		});

	},
	onend: function(self){
		self.clear();
		unlisten(self);
		unlisten(_);
		unlisten(_.misc);
	}
});
