SLIDES.push({
	id: "distrust",
	onjump: function(self){

		// Tournament
		Tournament.resetGlobalVariables();
		self.add({id:"tournament", type:"Tournament", x:-20, y:20});

	},
	onstart: function(self){
		
		var o = self.objects;

		// Reset Tournament
		_.resetTournament = function(){
			Tournament.resetGlobalVariables();
			Tournament.INITIAL_AGENTS = [
				{strategy:"all_c", count:23},
				{strategy:"all_d", count:1},
				{strategy:"tft", count:1}
			];
			o.tournament.reset();
		};
		_.resetTournament();

		// Move tournament
		o.tournament.dom.style.left = 480;

		// Words to the side
		self.add({
			id:"text", type:"TextBox",
			x:0, y:30, width:450, height:500,
			text_id:"distrust_1"
		});
		_hide(o.text); _fadeIn(o.text, 600);

		/////////////////////////////////////////
		// BUTTONS for playing //////////////////
		/////////////////////////////////////////

		var x = 671;
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
			id:"stepButton", type:"Button", size:"short",
			x:x, y:y+dy, text_id:"label_step", message:"tournament/step"
		});
		self.add({
			id:"resetButton", type:"Button", size:"short",
			x:x, y:y+dy*2, text_id:"label_reset", message:"tournament/reset"
		});
		_hide(o.playButton); _fadeIn(o.playButton, 800);
		_hide(o.stepButton); _fadeIn(o.stepButton, 900);
		_hide(o.resetButton); _fadeIn(o.resetButton, 1000);

		///////////

		_.misc = {};
		listen(_.misc, "tournament/step/completed", function(step){
			if(step=="reproduce"){
				publish("slideshow/next");
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
		o.text.setTextID("distrust_2");
		_hide(o.text); _fadeIn(o.text, 100);

		// Slider Label & Slider
		var x = 0;
		var y = 350;
		self.add({
			id:"roundsLabel", type:"TextBox",
			x:0, y:y, width:450, size:25, noSelect:true
		});
		self.add({
			id:"roundsSlider", type:"Slider",
			x:0, y:y+30, width:450,
			min:1, max:20, step:1,
			message: "rules/turns"
		});
		_.misc = {};
		var _updateLabel = function(value){
			var words = (value==1) ? Words.get("sandbox_rules_1_single") : Words.get("sandbox_rules_1"); // plural?
			words = words.replace(/\[N\]/g, value+""); // replace [N] with the number value
			o.roundsLabel.setText("<b>"+words+"</b>");
		};
		listen(_.misc, "rules/turns", function(value){
			_updateLabel(value);
			o.tournament.reset();
		});
		o.roundsSlider.setValue(10);
		_updateLabel(10);
		_hide(o.roundsLabel); _fadeIn(o.roundsLabel, 500);
		_hide(o.roundsSlider); _fadeIn(o.roundsSlider, 500);

		// Continue...
		listen(_.misc, "tournament/autoplay/start",function(){
			if(_showContinue) _showContinue();
		});
		var _showContinue = function(){
			_showContinue = null;
			var x = 125;
			var y = 430;
			self.add({
				id:"continueLabel", type:"TextBox",
				x:x, y:y+5, width:200, height:50,
				align:"right", color:"#aaa", size:17,
				text_id:"distrust_2_end"
			});
			self.add({
				id:"continueButton", type:"Button",
				x:x+215, y:y, size:"short",
				text_id:"label_continue",
				message: "slideshow/next"
			});
			_hide(o.continueLabel); _fadeIn(o.continueLabel, 100);
			_hide(o.continueButton); _fadeIn(o.continueButton, 100);
		};

	},
	onend: function(self){
		unlisten(_.misc);
		self.remove("roundsLabel");
		self.remove("roundsSlider");
		var o = self.objects;
		if(o.continueLabel) self.remove("continueLabel");
		if(o.continueButton) self.remove("continueButton");
	}
});

// Explain that...
SLIDES.push({
	onstart: function(self){

		var o = self.objects;

		// Words
		o.text.setTextID("distrust_3");
		_hide(o.text); _fadeIn(o.text, 100);

		// Worse...
		self.add({
			id:"next", type:"Button",
			x:0, y:450, size:"long",
			text_id:"distrust_3_btn",
			message: "slideshow/next"
		});
		_hide(o.next); _fadeIn(o.next, 400);

	},
	onend: function(self){	
		self.remove("text");
		self.remove("next");
	}
});

// Change PAYOFFS
SLIDES.push({
	onstart: function(self){

		var o = self.objects;
		_.misc = {};

		// Words
		self.add({
			id:"text", type:"TextBox",
			x:0, y:0, width:450, height:500,
			text_id:"distrust_4"
		});
		_hide(o.text); _fadeIn(o.text, 100);

		// PAYOFFS
		self.add({
			id:"payoffs", type:"PayoffsUI",
			x:105, y:73, scale:0.8, slideshow:self
		});
		_hide(o.payoffs); _fadeIn(o.payoffs, 300);
		listen(_.misc, "payoffs/onchange", function(value){
			o.tournament.reset();
		});

		// More words
		self.add({
			id:"text2", type:"TextBox",
			x:0, y:320, width:450, height:500,
			text_id:"distrust_4_2"
		});
		_hide(o.text2); _fadeIn(o.text2, 500);

		// Note 1
		var _showContinue = function(){
			_showContinue = null;
			self.add({
				id:"continueLabel", type:"TextBox",
				x:0, y:480, width:320, 
				align:"right", color:"#aaa", size:17,
				text_id:"distrust_4_note"
			});
			self.add({
				id:"continueButton", type:"Button",
				x:340, y:471, size:"short",
				text_id:"label_continue",
				message: "slideshow/next"
			});
			_hide(o.continueLabel); _fadeIn(o.continueLabel, 100);
			_hide(o.continueButton); _fadeIn(o.continueButton, 100);
		};
		listen(_.misc, "tournament/autoplay/start",function(){
			if(_showContinue) _showContinue();
		});

		// Note 2
		self.add({
			id:"note2", type:"TextBox",
			x:583, y:510, width:300, height:50,
			align:"center", color:"#aaa", size:17,
			text_id:"distrust_4_note_2"
		});
		_hide(o.note2); _fadeIn(o.note2, 500);

		// TOURNAMENT
		Tournament.resetGlobalVariables();
		Tournament.INITIAL_AGENTS = [
			{strategy:"all_c", count:23},
			{strategy:"all_d", count:1},
			{strategy:"tft", count:1}
		];
		Tournament.NUM_TURNS = 10;
		o.tournament.reset();

	},
	onend: function(self){
		unlisten(_.misc);
		self.remove("text");
		self.remove("payoffs");
		self.remove("text2");
		self.remove("note2");
		var o = self.objects;
		if(o.continueLabel) self.remove("continueLabel");
		if(o.continueButton) self.remove("continueButton");
	}
});

// Explain that...
SLIDES.push({
	onstart: function(self){

		var o = self.objects;

		// Words
		self.add({
			id:"text", type:"TextBox",
			x:0, y:30, width:450, height:500,
			text_id:"distrust_5"
		});
		_hide(o.text); _fadeIn(o.text, 100);

		// Worse...
		self.add({
			id:"next", type:"Button",
			x:0, y:450, size:"long",
			text_id:"distrust_5_btn",
			message: "slideshow/scratch"
		});
		_hide(o.next); _fadeIn(o.next, 400);

	},
	onend: function(self){	
		unlisten(_);
		unlisten(_.misc);
		self.clear();
	}
});
