Loader.addToManifest(Loader.manifest,{
	// SFX
	drumroll: "assets/sounds/drumroll.mp3"
});

// round-robin tournament, place your bets
SLIDES.push({
	id: "tournament",
	onstart: function(self){

		// Tournament
		Tournament.resetGlobalVariables();
		Tournament.INITIAL_AGENTS = [
			{strategy:"tft", count:1},
			{strategy:"all_d", count:1},
			{strategy:"all_c", count:1},
			{strategy:"grudge", count:1},
			{strategy:"prober", count:1}
		];
		Tournament.FLOWER_CONNECTIONS = true;
		self.add({id:"tournament", type:"Tournament", x:-20, y:20});

		// Words to the side
		self.add({
			id:"text", type:"TextBox",
			x:510, y:30, width:450, height:500,
			text_id:"place_your_bets"
		});

		// Button
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
		_addButton("tft", 510, 220+25);
		_addButton("all_c", 730, 220+25);
		_addButton("all_d", 510, 300+25);
		_addButton("grudge", 730, 300+25);
		_addButton("prober", 510, 380+25);

		// WHO'S WHO?
		self.add({
			id:"forgot", type:"TextBox",
			x:728, y:408, width:200, height:50,
			align:"center", color:"#aaa", size:16,
			text_id:"forgot_whos_who"
		});
		
	},
	onend: function(self){
		self.remove("bet_tft");
		self.remove("bet_all_c");
		self.remove("bet_all_d");
		self.remove("bet_grudge");
		self.remove("bet_prober");
		self.remove("forgot");
	}
});

// Alright, let's start!
SLIDES.push({
	onstart: function(self){

		var o = self.objects;

		// What was your bet?
		var tournament_intro = Words.get("tournament_intro");
		tournament_intro = tournament_intro.replace(/\[CHAR\]/g, "<span class='"+_.answer+"'>"+Words.get("label_"+_.answer)+"</span>");
		o.text.setText(tournament_intro);
		_hide(o.text); _fadeIn(o.text, 100);

		// "First Match" Button
		self.add({
			id:"button", type:"Button",
			x:510, y:130, 
			text_id:"first_match",
			message: "slideshow/next"
		});
		_hide(o.button); _fadeIn(o.button, 100+500);

	},
	onend: function(self){
		self.remove("button");
	}
});

// The matches... ONE BY ONE.
SLIDES.push({
	onstart: function(self){

		var o = self.objects;

		// Words to the side
		self.add({
			id:"text_extra", type:"TextBox",
			x:510, y:230, width:450, height:500
		});

		var showTournament = function(num){

			var words = "";
			var match_header;

			// PLAY MATCH
			var matchData = o.tournament.playMatch(num);
			var charA = matchData.charA;
			var charB = matchData.charB;
			var scoreA = matchData.scoreA
			var scoreB = matchData.scoreB;
			var roundPayoffs = matchData.payoffs;

			// Match N: [A] versus [B]
			match_header = Words.get("match_header_1");
			match_header = match_header.replace(/\[N\]/g, (num+1)+"");
			match_header = match_header.replace(/\[A\]/g, "<span class='"+charA+"'>"+Words.get("label_"+charA)+"</span>");
			match_header = match_header.replace(/\[B\]/g, "<span class='"+charB+"'>"+Words.get("label_"+charB)+"</span>");
			words += match_header+"<br>";

			// The rounds
			words += Words.get("match_header_2")+"<br>";
			for(var i=0;i<roundPayoffs.length;i++){
				var payoff = roundPayoffs[i][0];
				if(payoff==PD.PAYOFFS.P) payoff="P"; // Punishment
				if(payoff==PD.PAYOFFS.R) payoff="R"; // Reward
				if(payoff==PD.PAYOFFS.S) payoff="S"; // Sucker
				if(payoff==PD.PAYOFFS.T) payoff="T"; // Temptation
				words += "<span class='score_small' payoff='"+payoff+"'></span>";
			}
			words += "<br>";

			// The total scores
			if(scoreA>0) scoreA="+"+scoreA;
			if(scoreB>0) scoreB="+"+scoreB;
			match_header = Words.get("match_header_3");
			match_header = match_header.replace(/\[A\]/g, "<span class='"+charA+"'>"+scoreA+"</span>");
			match_header = match_header.replace(/\[B\]/g, "<span class='"+charB+"'>"+scoreB+"</span>");
			words += match_header+"<br><br><br>";

			// PUT IN THE WORDS
			o.text.setText(words);
			_hide(o.text); _fadeIn(o.text, 100);

			// Extra info
			o.text_extra.setTextID("tournament_"+(num+1));
			_hide(o.text_extra); _fadeIn(o.text_extra, 100+250);

			// FADE IN BUTTON
			_hide(o.button); _fadeIn(o.button, 100+500);

			// FINAL MATCH?
			if(_matchNumber==9){
				_switchButton();
			}

		};

		// "Next Match" Button
		self.add({
			id:"button", type:"Button",
			x:510, y:420, size:"long",
			text_id:"next_match",
			onclick:function(){
				_matchNumber++;
				showTournament(_matchNumber);
			}
		});
		var _switchButton = function(){
			o.button.setText("the_winner_is");
			o.button.config.onclick = function(){
				publish("slideshow/next");
			};
		};

		// MATCH NUMBER!
		_matchNumber = 0;
		showTournament(_matchNumber);

	},
	onend: function(self){
		self.remove("text_extra");
		self.remove("button");
	}
});

// who the winner is!
SLIDES.push({
	onstart: function(self){

		var o = self.objects;
		o.tournament.dehighlightAllConnections();

		// WORDS
		var words = "";
		words += Words.get("tournament_winner_1");
		if(_.answer=="tft"){
			words += Words.get("tournament_winner_2_yay");
		}else{
			words += Words.get("tournament_winner_2_nay").replace(/\[CHAR\]/g, "<span class='"+_.answer+"'>"+Words.get("label_"+_.answer)+"</span>");
		}
		words += "<br><br>";
		words += Words.get("tournament_winner_3");
		o.text.setText(words);

		// Next...
		self.add({
			id:"button", type:"Button",
			x:510, y:430, size:"long",
			text_id:"tournament_teaser",
			message: "slideshow/scratch"
		});

		// DRUMROLL
		Loader.sounds.drumroll.volume(0.8).play();
		_hide(o.text);
		_hide(o.button);
		setTimeout(function(){
			_show(o.text);
			_show(o.button);
		},2000);

	},
	onend: function(self){
		self.clear();
	}
});