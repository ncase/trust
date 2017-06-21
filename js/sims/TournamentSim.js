function TournamentSim(config){

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
	self.dom.style.border = "1px solid rgba(0,0,0,0.2)";

	// CREATE A RING OF AGENTS
	var AGENTS = [
		{strategy:"all_c", count:20},
		{strategy:"all_d", count:5},
		{strategy:"grim", count:2},
		{strategy:"tft", count:2},
	];

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

	self.networkContainer = new PIXI.Container();
	self.agentsContainer = new PIXI.Container();
	app.stage.addChild(self.networkContainer);
	app.stage.addChild(self.agentsContainer);

	self.populateAgents = function(){

		// Clear EVERYTHING
		app.stage.removeChildren();
		
		// Convert to an array
		self.agents = _convertCountToArray(AGENTS);

		// Put 'em in a ring
		var count = 0;
		for(var i=0; i<self.agents.length; i++){

			// Position
			var angle = (i/self.agents.length)*Math.TAU - Math.TAU/4;
			var x = Math.cos(angle)*200 + 250;
			var y = Math.sin(angle)*200 + 250;

			// What kind of agent?
			var strategy = self.agents[i];
			var agent = new TournamentAgent({x:x, y:y, strategy:strategy});
			app.stage.addChild(agent.graphics);

			// Remember me!
			self.agents[i] = agent;

		}

	};
	self.populateAgents();

	////////////////////////////////////
	// EVOLUTION ///////////////////////
	////////////////////////////////////

	// Play one tournament
	self.playOneTournament = function(){
		PD.playOneTournament(self.agents, 10);
		self.agents.sort(function(a,b){
			if(a.coins==b.coins) return (Math.random()<0.5); // if equal, random
			return a.coins-b.coins; // otherwise, sort as per usual
		});
	};

	// Get rid of X worst
	self.eliminateBottom = function(X){

		// The worst X
		var worst = self.agents.slice(0,X);

		// For each one, subtract from AGENTS count, and KILL.
		for(var i=0; i<worst.length; i++){
			var badAgent = worst[i];
			var config = AGENTS.find(function(config){
				return config.strategy==badAgent.strategyName;
			});
			config.count--; // remove one
			app.stage.removeChild(badAgent.graphics); // get rid of this // TODO: KILL?
		}

	};

	// Reproduce the top X
	self.reproduceTop = function(X){

		// The top X
		var best = self.agents.slice(self.agents.length-X, self.agents.length);

		// For each one, add to AGENTS count
		for(var i=0; i<best.length; i++){
			var goodAgent = best[i];
			var config = AGENTS.find(function(config){
				return config.strategy==goodAgent.strategyName;
			});
			config.count++; // ADD one
		}

		// ...and REPOPULATE THE THING
		self.populateAgents();

	};

	// HACK: ALL AT ONCE
	self.ALL_AT_ONCE = function(){
		self.playOneTournament();
		setTimeout(function(){
			self.eliminateBottom(5);
		},300);
		setTimeout(function(){
			self.reproduceTop(5);
		},600);
	};
	setInterval(self.ALL_AT_ONCE, 1000);

	// ANIMATE
	/*app.ticker.add(function(delta) {
	    bunny.rotation += 0.1 * delta;
	});*/

	// Add...
	self.add = function(INSTANT){
		return _add(self);
	};

	// Remove...
	self.remove = function(INSTANT){
		return _remove(self);
	};

}

function TournamentAgent(config){

	var self = this;
	self.strategyName = config.strategy;

	// Number of coins
	self.coins = 0;
	self.addPayoff = function(payoff){
		self.coins += payoff;
		self.updateScore();
	};

	// What's the image?
	var g = new PIXI.Container();
	g.x = config.x;
	g.y = config.y;
	self.graphics = g;

	// Body!
	var body = PIXI.Sprite.fromImage("assets/"+self.strategyName+".png");
	body.scale.set(0.5);
	if(g.x>250) body.scale.x*=-1;
	body.anchor.set(0.5);
	g.addChild(body);

	// Score!
	var textStyle = new PIXI.TextStyle({
	    fontFamily: 'Arial',
	    fontSize: 16,
	});
	var scoreText = new PIXI.Text("", textStyle);
	scoreText.anchor.x = 0.5;
	scoreText.x = 0;
	scoreText.y = -40;
	g.addChild(scoreText);
	self.updateScore = function(){
		scoreText.text = self.coins;
	};
	self.updateScore();

	// What's the play logic?
	var LogicClass = window["Logic_"+self.strategyName];
	self.logic = new LogicClass();
	self.play = function(){
		return self.logic.play();
	};
	self.remember = function(other){
		self.logic.remember(other);
	};

	// Reset!
	self.resetCoins = function(){
		self.coins = 0; // reset coins;
		self.updateScore();
	}
	self.resetLogic = function(){
		self.logic = new LogicClass(); // reset logic
	};

}

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

var PD = {};
PD.COOPERATE = "COOPERATE";
PD.CHEAT = "CHEAT";

PD.P = 0; // punishment: neither of you get anything
PD.S = -1; // sucker: you put in coin, other didn't.
PD.R = 2; // reward: you both put 1 coin in, both got 3 back
PD.T = 3; // temptation: you put no coin, got 3 coins anyway

PD.getPayoffs = function(move1, move2){
	if(move1==PD.CHEAT && move2==PD.CHEAT) return [PD.P, PD.P]; // both punished
	if(move1==PD.COOPERATE && move2==PD.CHEAT) return [PD.S, PD.T]; // sucker - temptation
	if(move1==PD.CHEAT && move2==PD.COOPERATE) return [PD.T, PD.S]; // temptation - sucker
	if(move1==PD.COOPERATE && move2==PD.COOPERATE) return [PD.R, PD.R]; // both rewarded
};

PD.playOneGame = function(playerA, playerB){

	var A = playerA.play();
	var B = playerB.play();
	
	var payoffs = PD.getPayoffs(A,B);

	playerA.remember(B);
	playerB.remember(A);

	playerA.addPayoff(payoffs[0]);
	playerB.addPayoff(payoffs[1]);

};

PD.playRepeatedGame = function(playerA, playerB, turns){

	// I've never met you before, let's pretend
	playerA.resetLogic();
	playerB.resetLogic();

	// Play N turns
	for(var i=0; i<turns; i++){
		PD.playOneGame(playerA, playerB);
	}

};

PD.playOneTournament = function(agents, turns){

	// Reset everyone's coins
	for(var i=0; i<agents.length; i++){
		agents[i].resetCoins();
	}

	// Round robin!
	for(var i=0; i<agents.length; i++){
		var playerA = agents[i];
		for(var j=i+1; j<agents.length; j++){
			var playerB = agents[j];
			PD.playRepeatedGame(playerA, playerB, turns);
		}	
	}

};

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

function Logic_tft(){
	var self = this;
	var otherMove = PD.COOPERATE;
	self.play = function(){
		return otherMove;
	};
	self.remember = function(other){
		otherMove = other;
	};
}
function Logic_grim(){
	var self = this;
	var everCheatedMe = false;
	self.play = function(){
		if(everCheatedMe) return PD.CHEAT;
		return PD.COOPERATE;
	};
	self.remember = function(other){
		if(other==PD.CHEAT) everCheatedMe=true;
	};
}
function Logic_all_d(){
	var self = this;
	self.play = function(){
		return PD.CHEAT;
	};
	self.remember = function(other){
		// nah
	};
}
function Logic_all_c(){
	var self = this;
	self.play = function(){
		return PD.COOPERATE;
	};
	self.remember = function(other){
		// nah
	};
}
/*
function Logic_prober(){
	var self = this;
	self.play = function(){
	};
	self.remember = function(other){
	};
}
*/