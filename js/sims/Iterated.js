Loader.addToManifest(Loader.manifest,{

	iterated_coin: "assets/iterated/iterated_coin.json",
	iterated_machine: "assets/iterated/iterated_machine.json",
	iterated_payoffs: "assets/iterated/iterated_payoffs.json",
	iterated_peep: "assets/iterated/iterated_peep.json",

	// SFX
	coin_insert: "assets/sounds/coin_insert.mp3",
	coin_get: "assets/sounds/coin_get.mp3",
	evil_laugh: "assets/sounds/evil_laugh.mp3",
	whoosh: "assets/sounds/whoosh.mp3",
	thump: "assets/sounds/thump.mp3",
	machine_start: "assets/sounds/machine_start.mp3"

});

function Iterated(config){

	var self = this;
	self.id = config.id;
	
	// DOM
	self.dom = document.createElement("div");
	self.dom.className = "object";
	self.dom.style.left = config.x+"px";
	self.dom.style.top = config.y+"px";

	// APP
	var app = new PIXI.Application(700, 250, {transparent:true, resolution:2});
	self.app = app;
	app.view.style.width = 700;
	app.view.style.height = 250;
	self.dom.appendChild(app.view);

	// LABELS
	var _l1 = _makeLabel("label_they_cooperate", {x:354, y:34, rotation:45, align:"center", color:"#333333", size:15, width:70, lineHeight:1});
	self.dom.appendChild(_l1);
	var _l2 = _makeLabel("label_you_cooperate", {x:272, y:35, rotation:-45, align:"center", color:"#333333", size:15, width:70, lineHeight:1});
	self.dom.appendChild(_l2);
	var _l3 = _makeLabel("label_they_cheat", {x:406, y:86, rotation:45, align:"center", color:"#333333", size:15, width:70, lineHeight:1});
	self.dom.appendChild(_l3);
	var _l4 = _makeLabel("label_you_cheat", {x:224, y:83, rotation:-45, align:"center", color:"#333333", size:15, width:70, lineHeight:1});
	self.dom.appendChild(_l4);

	///////////////////////////////////////////////
	//////////////// THE GRAPHICS /////////////////
	///////////////////////////////////////////////

	// Peep A
	self.playerA = new IteratedPeep({});
	app.stage.addChild(self.playerA.graphics);

	// Peep B
	self.playerB = new IteratedPeep({opponent:true});
	app.stage.addChild(self.playerB.graphics);

	// Machine
	self.machine = _makeMovieClip("iterated_machine", {anchorX:0, anchorY:0, scale:0.5});
	app.stage.addChild(self.machine);

	// Payoffs
	self.payoffs = _makeMovieClip("iterated_payoffs", {scale:0.5});
	app.stage.addChild(self.payoffs);
	self.payoffs.x = 350;
	self.payoffs.y = 125;
	self.payoffs.gotoAndStop(0);
	self.highlightPayoff = function(payoffA){
		if(payoffA==PD.PAYOFFS.R){
			self.payoffs.gotoAndStop(4);
			_l1.style.color = _l2.style.color = "#FFE663";
		}
		if(payoffA==PD.PAYOFFS.T){
			self.payoffs.gotoAndStop(5);
			_l1.style.color = _l4.style.color = "#FFE663";
		}
		if(payoffA==PD.PAYOFFS.S){
			self.payoffs.gotoAndStop(6);
			_l2.style.color = _l3.style.color = "#FFE663";
		}
		if(payoffA==PD.PAYOFFS.P){
			self.payoffs.gotoAndStop(7);
			_l3.style.color = _l4.style.color = "#FFE663";
		}
	};
	self.dehighlightPayoff = function(){
		self.payoffs.gotoAndStop(3);
		[_l1,_l2,_l3,_l4].forEach(function(label){
			label.style.color = "#333333";
		});
	};

	// HACK
	self.oneoffHighlight1 = function(yourAnswer){
		self.dehighlightPayoff();
		self.payoffs.gotoAndStop(1);
		var your = yourAnswer=="COOPERATE" ? _l2 : _l4;
		your.style.color = _l3.style.color = "#FFE663";
	};
	self.oneoffHighlight2 = function(yourAnswer){
		self.dehighlightPayoff();
		self.payoffs.gotoAndStop(2);
		var your = yourAnswer=="COOPERATE" ? _l2 : _l4;
		your.style.color = _l1.style.color = "#FFE663";
	};

	// Animiniminimination
	var _introMachine = -1;
	app.ticker.add(function(delta){
		Tween.tick();
		self.playerA.update(delta);
		self.playerB.update(delta);

		// IF: INTRODUCING MACHINE
		if(_introMachine>0){
			self.payoffs.gotoAndStop(4 + (Math.floor(_introMachine)%4));
			_introMachine -= 0.33;
			if(_introMachine<=0){
				self.dehighlightPayoff();
			}
		}

	});
	self.introMachine = function(){
		_introMachine = 40;
		Loader.sounds.machine_start.volume(0.65).play();
	};

	///////////////////////////////////////////////
	///////////////// LISTENERS ///////////////////
	///////////////////////////////////////////////

	self.chooseOpponent = function(id){
		var LogicClass = window["Logic_"+id];
		self.opponentLogic = new LogicClass();
		self.playerB.chooseHat(id);
	};

	self.playOneRound = function(yourMove){

		// Make your moves!
		var A = yourMove;
		if(yourMove=="TRIP") A=PD.CHEAT;
		var B = self.opponentLogic.play();

		// Get payoffs
		var payoffs = PD.getPayoffs(A,B);

		// ANIMATE the moves: betrayal or what?
		self.playerA.TRIP = (yourMove=="TRIP");
		var animPromise1 = self.playerA.playMove(payoffs[0]); // reward, temptation, sucker, punishment, etc...
		var animPromise2 = self.playerB.playMove(payoffs[1]);

		// Animate payoffs
		Tween_get(self.payoffs)
			.wait(_s(1.1))
			.call(function(){
				self.highlightPayoff(payoffs[0]);
			});
		Q.all([animPromise1,animPromise2]).then(function(){

			// Payoff Matrix
			self.dehighlightPayoff();

			// End Round
			publish("iterated/round/end", payoffs);

		});

		// Remember own & other's moves
		self.opponentLogic.remember(B, A);

	};

	listen(self, "iterated/cooperate", function(){
		publish("iterated/round/start");
		self.playOneRound(PD.COOPERATE);
	});

	listen(self, "iterated/cheat", function(){
		publish("iterated/round/start");
		self.playOneRound(PD.CHEAT);
	});

	listen(self, "iterated/TRIP", function(){
		publish("iterated/round/start");
		self.playOneRound("TRIP");
	});

	listen(self, "iterated/newOpponent", function(id){
		self.chooseOpponent(id);
		self.playerA.resetFace();
		self.playerB.resetFace();
	});
	self.chooseOpponent("tft");

	///////////////////////////////////////////////
	///////////// ADD, REMOVE, KILL ///////////////
	///////////////////////////////////////////////

	// Add...
	self.add = function(){
		_add(self);
	};

	// Remove...
	self.remove = function(){
		app.destroy();
		unlisten(self);
		self.playerA.kill();
		self.playerB.kill();
		_remove(self);
	};

}

function IteratedScoreboard(config){

	var self = this;
	self.config = config;

	// DOM
	self.dom = document.createElement("div");
	self.dom.id = "scoreboard";
	self.dom.className = "object";
	self.dom.style.left = config.x+"px";
	self.dom.style.top = config.y+"px";

	// Left score
	var left = document.createElement("div");
	self.dom.appendChild(left);

	// Right score
	var right = document.createElement("div");
	self.dom.appendChild(right);

	// Reset
	self.score = [0,0];
	self.reset = function(){
		self.score = [0,0];
		self.showScore();
	};
	self.addScore = function(a,b){
		self.score[0] += a;
		self.score[1] += b;
		self.showScore();
	};
	self.showScore = function(){
		left.innerHTML = self.score[0];
		right.innerHTML = self.score[1];
	};
	self.reset();

	// Add & Remove
	self.add = function(){ _add(self); };
	self.remove = function(){ _remove(self); };

}

function IteratedPeep(config){

	var self = this;
	self.config = config;

	// Peep
	self.graphics = new PIXI.Container();
	var g = self.graphics;

	// Animation
	self.animated = new PIXI.Container();
	g.addChild(self.animated);

	// Coin
	self.coin = _makeMovieClip("iterated_coin", {scale:0.5});
	self.animated.addChild(self.coin);
	self.coin.visible = false;
	self.payoffCoins = [];
	for(var i=0;i<3;i++){
		var c = _makeMovieClip("iterated_coin", {scale:0.5});
		c.visible = false;
		self.animated.addChild(c);
		self.payoffCoins.push(c);
	}

	// Body
	self.body = _makeMovieClip("iterated_peep", {scale:0.5, anchorX:0.5, anchorY:0.95});
	self.animated.addChild(self.body);

	// Hat
	self.hat = _makeMovieClip("iterated_peep", {scale:0.5, anchorX:0.5, anchorY:0.95});
	self.animated.addChild(self.hat);
	self.hat.gotoAndStop(12);
	self.chooseHat = function(id){
		self.hat.gotoAndStop(13 + PEEP_METADATA[id].frame);
	};

	// Face
	self.face = _makeMovieClip("iterated_peep", {scale:0.5, anchorX:0.5, anchorY:0.95});
	self.animated.addChild(self.face);
	self.face.gotoAndStop(1);
	self.restingFace = true;

	// Eyebrows
	self.eyebrows = _makeMovieClip("iterated_peep", {scale:0.5, anchorX:0.5, anchorY:0.95});
	self.eyebrows.visible = false;
	self.animated.addChild(self.eyebrows);

	// RESET FACE
	self.resetFace = function(){
		self.eyebrows.visible = false;
		self.face.gotoAndStop(1);
		self.restingFace = true;
	};

	// Position & Flip?
	g.y = 236;
	//g.rotation = 1;
	if(config.opponent){
		g.x = 700-62;
		g.scale.x *= -1;
	}else{
		g.x = 62;
	}

	/////////////////////////////////////////////
	/////// ACTUALLY ANIMATING THE MOVES ////////
	/////////////////////////////////////////////

	var _isTripping = false;
	var _isHopping = false;
	var _faceTripped = false;
	var _hopTimer = 0;
	var _faceTimer = 0;
	self.update = function(delta){

		// Blinking
		if(self.restingFace){
			if(self.face.currentFrame>2) self.face.gotoAndStop(1);
			if(self.face.currentFrame==2 && Math.random()<0.20) self.face.gotoAndStop(1);
			if(self.face.currentFrame==1 && Math.random()<0.01) self.face.gotoAndStop(2);
		}

		// Face Tripped
		if(_faceTripped){
			_faceTimer += 0.25;
			var frame = 18+(Math.floor(_faceTimer)%5);
			self.face.gotoAndStop(frame);
		}

		// Hopping
		if(!_isTripping){
			if(_isHopping){
				_hopTimer += delta;
				self.animated.y = -Math.abs(Math.sin(_hopTimer*0.4))*6;
			}else{
				self.animated.y = 0;
				_hopTimer = 0;
			}
		}
	};

	self.showScore = function(payoff){
	};

	self.payoff = undefined;
	self.animationDeferred = null;
	self.playMove = function(payoff){

		self.payoff = payoff;
		_animate1(); // start anim

		// Make a promise!
		self.animationDeferred = Q.defer();
		return self.animationDeferred.promise;

	};

	// Whip coin out
	var _animate1 = function(){
		self.coin.visible = true; // show coin
		self.coin.x = 10;
		self.coin.y = -30;
		Tween_get(self.coin)
			.to({x:60, y:-75}, _s(0.1), Ease.circOut)
			.wait(_s(0.2))
			.call(function(){
				if(self.TRIP){
					_animate2_alt();
				}else{
					_animate2();
				}
			});
	};

	// Walk towards machine
	var _animate2 = function(){
		_isHopping = true;
		Tween_get(self.animated)
			.to({x:70}, _s(0.5), Ease.linear)
			.call(_animate3);
	};

	// ALT: Walk... and TRIP. 
	var _animate2_alt = function(){
		_isHopping = true;
		Tween_get(self.animated)
			.to({x:70/5}, _s(0.1), Ease.linear)
			.call(function(){
				_isHopping = false;
				_isTripping = true;
			})
			.to({rotation:Math.TAU/4.9, y:-11}, _s(0.05), Ease.quadIn)
			.call(function(){

				Loader.sounds.thump.stereo(-0.9).volume(0.9).play();
				Loader.sounds.squeak.stereo(-0.9).volume(0.9).play();

				self.eyebrows.visible = false;
				_faceTripped = true;
				self.coin.visible = false;
				g.scale.x = 1.2;
				g.scale.y = 1/g.scale.x;
				Tween_get(g.scale)
					.to({x:1, y:1}, _s(0.5), Ease.elasticOut);
			})
			.wait(_s(0.1))
			.call(_animate3_alt);
	};

	// Put coin in OR DON'T -- SHOW PAYOFF ON FACE
	var _animate3 = function(){
		_isHopping = false;

		// Rewarded or Suckered: PUT COIN IN
		if(self.payoff==PD.PAYOFFS.R || self.payoff==PD.PAYOFFS.S){

			Tween_get(self.coin)
				.to({x:95, y:-25}, _s(0.3), Ease.circInOut)
				.call(function(){

					self.restingFace = false;
					self.eyebrows.visible = false;
					if(self.payoff==PD.PAYOFFS.R) self.face.gotoAndStop(8); // Reward Face!
					if(self.payoff==PD.PAYOFFS.S) self.face.gotoAndStop(9); // Sucker Face!
					self.coin.visible = false;

					// SOUND
					if(config.opponent){
						setTimeout(function(){
							Loader.sounds.coin_insert.stereo(0.9).volume(0.3).play();
						},50);
					}else{
						Loader.sounds.coin_insert.stereo(-0.9).volume(0.3).play();
					}

				});

		}

		// Punished or Tempted: DID NOT PUT COIN IN
		if(self.payoff==PD.PAYOFFS.P || self.payoff==PD.PAYOFFS.T){
			Tween_get(self.coin)
				.to({x:70, y:-50}, _s(0.3), Ease.linear)
				.call(function(){

					self.restingFace = false;
					self.eyebrows.visible = false;
					if(self.payoff==PD.PAYOFFS.P) self.face.gotoAndStop(7); // Punishment Face
					if(self.payoff==PD.PAYOFFS.T) self.face.gotoAndStop(10); // Temptation Face!

					// WHOOSH SOUND
					if(config.opponent){
						setTimeout(function(){
							Loader.sounds.whoosh.stereo(0.9).volume(0.8).play();
						},50);
					}else{
						Loader.sounds.whoosh.stereo(-0.9).volume(0.8).play();
					}

					// EVIL LAUGH
					if(self.payoff==PD.PAYOFFS.T){
						setTimeout(function(){
							var stereo = (config.opponent) ? 0.9 : -0.9;
							Loader.sounds.evil_laugh.stereo(stereo).volume(1).play();
						},100);
					}

					if(self.payoff==PD.PAYOFFS.T){
						_isHopping = true;
					}

				})
				.to({x:50, y:-100}, _s(0.1), Ease.circOut);
		}

		// Next...
		Tween_get(self.animated)
			.wait(_s((self.payoff==PD.PAYOFFS.R) ? 0.6 : 0.9))
			.call(_animate4);

	};

	// ALT: Show dizzy face lay down for a while
	var _animate3_alt = function(){
		Tween_get(self.animated)
			.wait(_s(0.9))
			.call(_animate4_alt);
	};

	// Walk back
	var _animate4 = function(){
		_isHopping = true;
		Tween_get(self.animated)
			.to({x:0}, _s(0.5), Ease.linear)
			.call(_animate5);
	};

	// ALT: Get back up
	var _animate4_alt = function(){
		Tween_get(self.animated)
			.to({x:0, y:0, rotation:0}, _s(0.5), Ease.quadInOut)
			.call(function(){
				_isTripping = false;
				_animate5();
			});
	};

	// Face back to "normal", put coin back, get coins (if any) thrown at you
	var _animate5 = function(){

		_isHopping = false;

		// Face back to normal
		if(!self.TRIP){
			self.restingFace = true;
		}

		// Eyebrows, yo
		if(!self.TRIP){
			self.eyebrows.visible = true;
			if(self.payoff==PD.PAYOFFS.P) self.eyebrows.gotoAndStop(3); // Punishment
			if(self.payoff==PD.PAYOFFS.R) self.eyebrows.gotoAndStop(4); // Reward
			if(self.payoff==PD.PAYOFFS.S) self.eyebrows.gotoAndStop(5); // Sucker
			if(self.payoff==PD.PAYOFFS.T) self.eyebrows.gotoAndStop(6); // Temptation
		}

		// Put coin away if not already
		if(self.coin.visible){
			Tween_get(self.coin)
				.to({x:10, y:-30}, _s(0.1), Ease.circIn)
				.call(function(){
					self.coin.visible = false;
				});
		}

		// Coins thrown at you?
		if(self.payoff==PD.PAYOFFS.R || self.payoff==PD.PAYOFFS.T){

			// All the dang coins!
			for(var i=0;i<3;i++){
				var c = self.payoffCoins[i];
				c.x = 155;
				c.y = -25;
				(function(c,i,payoff){
					Tween_get(c)
						.wait(_s(i*0.2+0.1))
						.call(function(){
							c.visible = true;

							// COIN GET SOUND
							if(self.payoff==PD.PAYOFFS.R && i==2) return; // NOT last coin.
							if(config.opponent){
								setTimeout(function(){
									Loader.sounds.coin_get.stereo(0.9).volume(0.1).play();
								},50);
							}else{
								Loader.sounds.coin_get.stereo(-0.9).volume(0.1).play();
							}

						})
						.to({x:0}, _s(0.3), Ease.linear)
						.call(function(){
							c.visible = false;
						}); // x
					Tween_get(c)
						.wait(_s(i*0.2+0.1))
						.to({y:-120}, _s(0.15), Ease.circOut) // y
						.to({y:-20}, _s(0.15), Ease.circIn); // y
				})(c,i,self.payoff);
			}

			Tween_get(self.animated)
				.wait(_s(0.8))
				.call(_animateDone);

		}else{

			Tween_get(self.animated)
				.wait(_s(0.3))
				.call(_animateDone);
		}

	};

	// DONE
	var _animateDone = function(){
		if(self.TRIP){
			self.restingFace = true;
			self.face.gotoAndStop(2); // BLINK
		}
		_faceTripped = false;
		self.animationDeferred.resolve();
	};

	// KILL
	self.kill = function(){
		// Remove ALL tweens
		Tween.removeTweens(self.animated);
		Tween.removeTweens(self.coin);
		for(var i=0;i<self.payoffCoins.length;i++){
			Tween.removeTweens(self.payoffCoins[i]);
		}
	};


}

