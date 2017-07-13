Tournament.resetGlobalVariables = function(){

	Tournament.SELECTION = 5;
	Tournament.NUM_TURNS = 10;

	Tournament.INITIAL_AGENTS = [
		{strategy:"tft", count:5},
		{strategy:"all_d", count:5},
		{strategy:"all_c", count:0},
		{strategy:"grudge", count:0},
		{strategy:"prober", count:0},
		{strategy:"tf2t", count:5},
		{strategy:"pavlov", count:5},
		{strategy:"random", count:5}
	];

	publish("pd/defaultPayoffs");

	PD.NOISE = 0;

};

Tournament.resetGlobalVariables();

subscribe("rules/evolution",function(value){
	Tournament.SELECTION = value;
});

subscribe("rules/turns",function(value){
	Tournament.NUM_TURNS = value;
});

// OH THAT'S SO COOL. Mostly C: Pavlov wins, Mostly D: tit for two tats wins (with 5% mistake!)
// ALSO, NOISE: tft vs all_d. no random: tft wins. low random: tf2t wins. high random: all_d wins. totally random: nobody wins

//////////////////////////////////////////////
//////////////////////////////////////////////

// REGULAR LOAD
Loader.addToManifest(Loader.manifest,{
	tournament_peep: "assets/tournament/tournament_peep.json"
});

function Tournament(config){

	var self = this;
	self.id = config.id;
	
	// APP
	var app = new PIXI.Application(500, 500, {transparent:true, resolution:2});
	self.dom = app.view;

	// DOM
	self.dom.className = "object";
	self.dom.style.width = 500;
	self.dom.style.height = 500;
	//self.dom.classList.add("fader");
	self.dom.style.left = config.x+"px";
	self.dom.style.top = config.y+"px";
	//self.dom.style.border = "1px solid rgba(0,0,0,0.2)";

	var _convertCountToArray = function(countList){
		var array = [];
		for(var i=0; i<AGENTS.length; i++){
			var A = AGENTS[i];
			var strategy = A.strategy;
			var count = A.count;
			for(var j=0; j<count; j++){
				array.push(strategy);
			}
		}
		return array;
	};

	self.agents = [];
	self.connections = [];

	self.networkContainer = new PIXI.Container();
	self.agentsContainer = new PIXI.Container();
	app.stage.addChild(self.networkContainer);
	app.stage.addChild(self.agentsContainer);

	self.populateAgents = function(){

		// Clear EVERYTHING
		while(self.agents.length>0) self.agents[0].kill();
		
		// Convert to an array
		self.agents = _convertCountToArray(AGENTS);

		// Put 'em in a ring
		var count = 0;
		for(var i=0; i<self.agents.length; i++){

			// Angle
			var angle = (i/self.agents.length)*Math.TAU - Math.TAU/4;

			// What kind of agent?
			var strategy = self.agents[i];
			var agent = new TournamentAgent({angle:angle, strategy:strategy, tournament:self});
			self.agentsContainer.addChild(agent.graphics);

			// Remember me!
			self.agents[i] = agent;

		}

		// (sort agents by depth)
		self.sortAgentsByDepth();

	};
	self.sortAgentsByDepth = function(){
		self.agentsContainer.children.sort(function(a,b){
			return a.y - b.y;
		});
	};

	self.createNetwork = function(){

		// Clear EVERYTHING
		while(self.connections.length>0) self.connections[0].kill();
		
		// Connect all of 'em
		for(var i=0; i<self.agents.length; i++){
			var playerA = self.agents[i];
			for(var j=i+1; j<self.agents.length; j++){
				var playerB = self.agents[j];
				var connection = new TournamentConnection({
					tournament: self,
					from: playerA,
					to: playerB
				});
				self.networkContainer.addChild(connection.graphics);
				self.connections.push(connection);
			}
		}

	};
	self.actuallyRemoveConnection = function(connection){
		var index = self.connections.indexOf(connection);
		self.connections.splice(index,1);
	};


	///////////////////////
	// RESET //////////////
	///////////////////////

	var AGENTS;
	self.reset = function(){

		// Agents & Network...
		AGENTS = JSON.parse(JSON.stringify(Tournament.INITIAL_AGENTS));
		self.populateAgents();
		self.createNetwork();

		// Animation...
		self.STAGE = STAGE_REST;
		_playIndex = 0;
		_tweenTimer = 0;

		// Stop autoplay!
		publish("tournament/autoplay/stop");
		_step = 0;

	};

	listen(self, "tournament/reset", self.reset);

	self.reset();

	////////////////////////////////////
	// EVOLUTION ///////////////////////
	////////////////////////////////////

	// Play one tournament
	self.agentsSorted = null;
	self.playOneTournament = function(){
		PD.playOneTournament(self.agents, Tournament.NUM_TURNS);
		self.agentsSorted = self.agents.slice();
		self.agentsSorted.sort(function(a,b){
			if(a.coins==b.coins) return (Math.random()<0.5); // if equal, random
			return a.coins-b.coins; // otherwise, sort as per usual
		});
	};

	// Get rid of X worst
	self.eliminateBottom = function(X){

		// The worst X
		var worst = self.agentsSorted.slice(0,X);

		// For each one, subtract from AGENTS count, and KILL.
		for(var i=0; i<worst.length; i++){
			var badAgent = worst[i];
			var config = AGENTS.find(function(config){
				return config.strategy==badAgent.strategyName;
			});
			config.count--; // remove one
			badAgent.eliminate(); // ELIMINATE
		}

	};
	self.actuallyRemoveAgent = function(agent){
		var index = self.agents.indexOf(agent);
		self.agents.splice(index,1);
	};

	// Reproduce the top X
	self.reproduceTop = function(X){

		// The top X
		var best = self.agentsSorted.slice(self.agentsSorted.length-X, self.agentsSorted.length);

		// For each one, add to AGENTS count
		for(var i=0; i<best.length; i++){
			var goodAgent = best[i];
			var config = AGENTS.find(function(config){
				return config.strategy==goodAgent.strategyName;
			});
			config.count++; // ADD one
		}

		// ADD agents, splicing right AFTER
		for(var i=0; i<best.length; i++){

			// Properties...
			var goodAgent = best[i];
			var angle = goodAgent.angle + 0.1;
			var strategy = goodAgent.strategyName;

			// Create agent!
			var agent = new TournamentAgent({angle:angle, strategy:strategy, tournament:self});
			self.agentsContainer.addChild(agent.graphics);

			// Splice RIGHT AFTER
			var index = self.agents.indexOf(goodAgent);
			self.agents.splice(index, 0, agent);

		}

		// What are the agents' GO-TO angles?
		for(var i=0; i<self.agents.length; i++){
			var agent = self.agents[i];
			var angle = (i/self.agents.length)*Math.TAU - Math.TAU/4;
			agent.gotoAngle = angle;
		}

		// ADD connections
		self.createNetwork();

	};

	// ANIMATE the PLAYING, ELIMINATING, or REPRODUCING
	var STAGE_REST = 0;
	var STAGE_PLAY = 1;
	var STAGE_ELIMINATE = 2;
	var STAGE_REPRODUCE = 3;
	self.STAGE = STAGE_REST;

	// AUTOPLAY
	self.isAutoPlaying = false;
	var _step = 0;
	var _nextStep = function(){
		if(self.STAGE!=STAGE_REST) return;
		if(_step==0) publish("tournament/play");
		if(_step==1) publish("tournament/eliminate");
		if(_step==2) publish("tournament/reproduce");
		_step = (_step+1)%3;
	};
	var _startAutoPlay = function(){
		self.isAutoPlaying = true;
		_nextStep();
		setTimeout(function(){
			if(self.isAutoPlaying) _startAutoPlay();
		},500);
	};
	var _stopAutoPlay = function(){
		self.isAutoPlaying = false;
	};
	listen(self, "tournament/autoplay/start", _startAutoPlay);
	listen(self, "tournament/autoplay/stop", _stopAutoPlay);
	listen(self, "tournament/step", function(){
		publish("tournament/autoplay/stop");
		_nextStep();
	});

	// ANIMATE
	var _playIndex = 0;
	var _tweenTimer = 0;
	app.ticker.add(function(delta) {

		// Tick
		Tween.tick();

		// PLAY!
		if(self.STAGE == STAGE_PLAY){
			if(_playIndex>0) self.agents[_playIndex-1].dehighlightConnections();
			if(_playIndex<self.agents.length){
				self.agents[_playIndex].highlightConnections();
				_playIndex++;
			}else{
				self.playOneTournament(); // FOR REAL, NOW.
				_playIndex = 0;
				_tweenTimer = 0;
				self.STAGE = STAGE_REST;
				// slideshow.objects._b2.activate(); // activate NEXT button!
			}
		}

		// ELIMINATE!
		if(self.STAGE == STAGE_ELIMINATE){
			self.eliminateBottom(Tournament.SELECTION);
			_tweenTimer++;
			if(_tweenTimer==_s(0.3)){
				_tweenTimer = 0;
				self.STAGE = STAGE_REST;
			}
			// slideshow.objects._b3.activate(); // activate NEXT button!
		}

		// REPRODUCE!
		if(self.STAGE == STAGE_REPRODUCE){

			// Start
			if(_tweenTimer==0){
				self.reproduceTop(Tournament.SELECTION);
			}

			// Middle...
			for(var i=0;i<self.agents.length;i++){
				var a = self.agents[i];
				a.tweenAngle(_tweenTimer);
				a.updatePosition();
			}
			self.sortAgentsByDepth();
			for(var i=0;i<self.connections.length;i++) self.connections[i].updateGraphics();
			_tweenTimer += 0.05;

			// End
			if(_tweenTimer>=1){
				_tweenTimer = 0;
				self.STAGE = STAGE_REST;
				// slideshow.objects._b1.activate(); // activate NEXT button!
			}

		}

	});

	// PLAY A TOURNAMENT
	self.deactivateAllButtons = function(){
		// slideshow.objects._b1.deactivate();
		// slideshow.objects._b2.deactivate();
		// slideshow.objects._b3.deactivate();
	};
	self._startPlay = function(){
		self.STAGE=STAGE_PLAY;
		// self.deactivateAllButtons();
	};
	listen(self, "tournament/play", self._startPlay);
	self._startEliminate = function(){
		self.STAGE=STAGE_ELIMINATE;
		// self.deactivateAllButtons();
	};
	listen(self, "tournament/eliminate", self._startEliminate);
	self._startReproduce = function(){
		self.STAGE=STAGE_REPRODUCE;
		// self.deactivateAllButtons();
	};
	listen(self, "tournament/reproduce", self._startReproduce);

	// Add...
	self.add = function(INSTANT){
		return _add(self);
	};

	// Remove...
	// TODO: KILL ALL LISTENERS, TOO.
	// TODO: Don't screw up when paused or looking at new tab
	self.remove = function(INSTANT){
		_stopAutoPlay();
		for(var i=0; i<self.agents.length; i++) unlisten(self.agents[i]);
		unlisten(self);
		app.destroy();
		return _remove(self);
	};

}

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

function TournamentConnection(config){

	var self = this;
	self.config = config;
	self.tournament = config.tournament;

	// Connect from & to
	self.from = config.from;
	self.to = config.to;
	self.from.connections.push(self);
	self.to.connections.push(self);

	// Graphics!
	var g = new PIXI.Container();
	var gray = PIXI.Sprite.fromImage("assets/tournament/connection.png"); // TODO: PRELOAD
	var gold = PIXI.Sprite.fromImage("assets/tournament/connection_gold.png"); // TODO: PRELOAD
	gray.height = 1;
	gold.height = 2;
	gray.anchor.y = gold.anchor.y = 0.5;
	g.addChild(gray);
	g.addChild(gold);
	self.graphics = g;

	// Highlight or no?
	self.highlight = function(){
		gray.visible = false;
		gold.visible = true;
	};
	self.dehighlight = function(){
		gray.visible = true;
		gold.visible = false;
	};
	self.dehighlight();

	// Stretch dat bad boy
	self.updateGraphics = function(){
		
		var f = self.from.graphics;
		var t = self.to.graphics;
		var dx = t.x-f.x;
		var dy = t.y-f.y;
		var a = Math.atan2(dy,dx);
		var dist = Math.sqrt(dx*dx+dy*dy);

		g.x = f.x; 
		g.y = f.y;
		g.rotation = a;

		gray.width = gold.width = dist;

	};
	self.updateGraphics();

	// KILL
	self.IS_DEAD = false;
	self.kill = function(){
		if(self.IS_DEAD) return;
		self.IS_DEAD = true;
		self.graphics.parent.removeChild(self.graphics); // remove self's graphics
		self.tournament.actuallyRemoveConnection(self);
	};

};

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

function TournamentAgent(config){

	var self = this;
	self.strategyName = config.strategy;
	self.tournament = config.tournament;
	self.angle = config.angle;
	self.gotoAngle = self.angle;

	// Connections
	self.connections = [];
	self.highlightConnections = function(){
		for(var i=0;i<self.connections.length;i++) self.connections[i].highlight();
	};
	self.dehighlightConnections = function(){
		for(var i=0;i<self.connections.length;i++) self.connections[i].dehighlight();
	};
	self.clearConnections = function(){
		for(var i=0;i<self.connections.length;i++){
			self.connections[i].kill();
		}
		self.connections = [];
	};

	// Number of coins
	self.coins = 0;
	self.addPayoff = function(payoff){
		self.coins += payoff;
		self.updateScore();
	};

	// What's the image?
	var g = new PIXI.Container();
	self.graphics = g;

	// Body!
	var body = _makeMovieClip("tournament_peep");
	body.gotoAndStop(PEEP_METADATA[config.strategy].frame);
	body.scale.set(0.5);
	body.anchor.x = 0.5;
	body.anchor.y = 0.75;
	g.addChild(body);

	// Score!
	var textStyle = new PIXI.TextStyle({
	    fontFamily: "FuturaHandwritten",
	    fontSize: 16,
	    fill: "#444"
	});
	var scoreText = new PIXI.Text("", textStyle);
	scoreText.anchor.x = 0.5;
	g.addChild(scoreText);
	self.updateScore = function(){
		scoreText.visible = true;
		scoreText.text = self.coins;
	};
	self.updateScore();
	scoreText.visible = false;
	listen(self, "tournament/reproduce",function(){
		scoreText.visible = false;
	});

	// What's the play logic?
	var LogicClass = window["Logic_"+self.strategyName];
	self.logic = new LogicClass();
	self.play = function(){
		return self.logic.play();
	};
	self.remember = function(own, other){
		self.logic.remember(own, other);
	};

	// Reset!
	self.resetCoins = function(){
		self.coins = 0; // reset coins;
		self.updateScore();
	}
	self.resetLogic = function(){
		self.logic = new LogicClass(); // reset logic
	};

	// Tween angle...
	self.tweenAngle = function(t){
		self.angle = self.gotoAngle*t + self.angle*(1-t);
	};
	self.updatePosition = function(){
		g.x = Math.cos(self.angle)*200 + 250;
		g.y = Math.sin(self.angle)*200 + 265;
		scoreText.x = -Math.cos(self.angle)*40;
		scoreText.y = -Math.sin(self.angle)*48 - 22;
		body.scale.x = Math.abs(body.scale.x) * ((Math.cos(self.angle)<0) ? 1 : -1);
	};
	self.updatePosition();

	// ELIMINATE
	self.eliminate = function(){

		// INSTA-KILL ALL CONNECTIONS
		self.clearConnections();

		// Tween -- DIE!
		scoreText.visible = false;
		Tween_get(g).to({
			alpha: 0,
			x: g.x+Math.random()*20-10,
			y: g.y+Math.random()*20-10,
			rotation: Math.random()*0.5-0.25
		}, _s(0.3), Ease.circOut).call(self.kill);

	};

	// KILL (actually insta-remove)
	self.kill = function(){

		// Remove ANY tweens
		Tween.removeTweens(g);
		
		// NOW remove graphics.
		g.parent.removeChild(g);

		// AND remove self from tournament
		self.tournament.actuallyRemoveAgent(self);

		// Unsub
		unlisten(self);

	};

}

