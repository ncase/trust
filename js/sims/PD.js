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