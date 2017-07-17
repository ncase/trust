SLIDES.push({
	id: "distrust",
	onjump: function(self){

		// Tournament
		Tournament.resetGlobalVariables();
		Tournament.INITIAL_AGENTS = [
			{strategy:"tft", count:20},
			{strategy:"all_d", count:1},
			{strategy:"all_c", count:1},
			{strategy:"grudge", count:1},
			{strategy:"prober", count:1}
		];
		self.add({id:"tournament", type:"Tournament", x:-20, y:20});

	},
	onstart: function(self){
		
		var o = self.objects;

		// Reset Tournament
		_.resetTournament = function(){
			Tournament.resetGlobalVariables();
			Tournament.INITIAL_AGENTS = [
				{strategy:"tft", count:20},
				{strategy:"all_d", count:1},
				{strategy:"all_c", count:1},
				{strategy:"grudge", count:1},
				{strategy:"prober", count:1}
			];
			o.tournament.reset();
		};
		_.resetTournament();

		// Move tournament
		o.tournament.dom.style.left = 480;

	},
	onend: function(self){
	}
});