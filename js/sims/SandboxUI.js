function SandboxUI(config){

	var self = this;
	self.id = config.id;

	// Create DOM
	self.dom = document.createElement("div");
	self.dom.className = "object";
	var dom = self.dom;

	/////////////////////////////////////////
	// BUTTONS for playing //////////////////
	/////////////////////////////////////////

	var playButton = new Button({
		x:130, y:135, text_id:"label_play",
		onclick: function(){
			if(slideshow.objects.tournament.isAutoPlaying){
				publish("tournament/autoplay/stop");
			}else{
				publish("tournament/autoplay/start");
			}
		}
	});
	subscribe("tournament/autoplay/stop",function(){
		playButton.setText("label_play");
	});
	subscribe("tournament/autoplay/start",function(){
		playButton.setText("label_stop");
	});
	dom.appendChild(playButton.dom);

	var stepButton = new Button({
		x:130, y:135+70, text_id:"label_step", message:"tournament/step"
	});
	dom.appendChild(stepButton.dom);
	
	var resetButton = new Button({x:130, y:135+70*2, text_id:"label_reset", message:"tournament/reset"});
	dom.appendChild(resetButton.dom);

	/////////////////////////////////////////
	// Create TABS & PAGES //////////////////
	/////////////////////////////////////////

	// Tabs
	var tabs = document.createElement("div");
	tabs.id = "sandbox_tabs";
	dom.appendChild(tabs);

	// Tab Hitboxes
	var _makeHitbox = function(label, x, width, pageIndex){

		label = label.toUpperCase();

		var hitbox = document.createElement("div");
		hitbox.className = "hitbox";
		hitbox.style.left = x+"px";
		hitbox.style.width = width+"px";
		hitbox.innerHTML = label;
		tabs.appendChild(hitbox);

		(function(pageIndex){
			hitbox.onclick = function(){
				_goToPage(pageIndex);
			};
		})(pageIndex);

	};
	_makeHitbox(Words.get("label_population"), 30, 100, 0);
	_makeHitbox(Words.get("label_payoffs"), 220, 100, 1);
	_makeHitbox(Words.get("label_rules"), 366, 100, 2);

	// Pages
	var pages = [];
	var _makePage = function(){
		var page = document.createElement("div");
		page.className = "sandbox_page";
		tabs.appendChild(page);
		pages.push(page);
	};
	for(var i=0; i<3; i++) _makePage(); // make three pages

	// Go To Page
	var _goToPage = function(showIndex){

		// Background
		tabs.style.backgroundPosition = (-showIndex*500)+"px 0px";

		// Show page
		for(var i=0; i<pages.length; i++) pages[i].style.display = "none";
		pages[showIndex].style.display = "block";

	};
	_goToPage(0);

	/////////////////////////////////////////
	// PAGE 0: POPULATION ///////////////////
	/////////////////////////////////////////

	var page = pages[0];

	// Labels
	page.appendChild(_makeLabel("sandbox_population", {x:0, y:0, w:433}));

	// Create an icon, label, and slider... that all interact with each other.
	var _makePopulationControl = function(x, y, peepID, defaultValue){

		// DOM
		var popDOM = document.createElement("div");
		popDOM.className = "sandbox_pop";
		popDOM.style.left = x;
		popDOM.style.top = y;
		page.appendChild(popDOM);

		// Message
		var message = "sandbox/pop/"+peepID;

		// Icon
		var popIcon = document.createElement("div");
		popIcon.className = "sandbox_pop_icon";
		popIcon.style.backgroundPosition = (-PEEP_METADATA[peepID].frame*40)+"px 0px";
		popDOM.appendChild(popIcon);

		// Label: Name
		var popName = document.createElement("div");
		popName.className = "sandbox_pop_label";
		popName.innerHTML = Words.get("label_short_"+peepID).toUpperCase();
		popName.style.color = PEEP_METADATA[peepID].color;
		popDOM.appendChild(popName);

		// Label: Amount
		var popAmount = document.createElement("div");
		popAmount.className = "sandbox_pop_label";
		popAmount.style.textAlign = "right";
		popAmount.style.color = PEEP_METADATA[peepID].color;
		popDOM.appendChild(popAmount);
		subscribe(message, function(value){
			popAmount.innerHTML = value;
		});

		// Slider
		(function(peepID){
			var popSlider = new Slider({
				x:0, y:35, width:200,
				min:0, max:25, step:1,
				message: message,
				onselect: function(){
					_anchorPopulation(peepID);
				},
				onchange: function(value){
					_adjustPopulation(peepID, value);
				}
			});
			popDOM.appendChild(popSlider.dom);
		})(peepID);

		// Default value!
		publish(message, [defaultValue]);

	};
	var xDiff = 220;
	var yDiff = 80;
	var yOff = 40;
	_makePopulationControl(    0, yOff+0,       "tft",		5);
	_makePopulationControl(xDiff, yOff+0,       "all_d",	5);
	_makePopulationControl(    0, yOff+yDiff,   "all_c",	15);
	_makePopulationControl(xDiff, yOff+yDiff,   "grudge",	0);
	_makePopulationControl(    0, yOff+yDiff*2, "prober",	0);
	_makePopulationControl(xDiff, yOff+yDiff*2, "tf2t",		0);
	_makePopulationControl(    0, yOff+yDiff*3, "pavlov",	0);
	_makePopulationControl(xDiff, yOff+yDiff*3, "random",	0);

	// Adjust the WHOLE population...
	/******************************

	Adjust by SCALING. (and in the edge case of "all zero", scale equally)
	Round to integers. (if above or below 25 in total, keep adding/subtracting 1 down the line)

	******************************/
	var _population;
	var _remainder;
	var _anchoredIndex;
	var _anchorPopulation = function(peepID){

		// Which index should be anchored?
		_anchoredIndex = Tournament.INITIAL_AGENTS.findIndex(function(config){
			return config.strategy==peepID;
		});
		var initValue = Tournament.INITIAL_AGENTS[_anchoredIndex].count;

		// SPECIAL CASE: THIS IS ALREADY FULL
		if(initValue==25){

			// Pretend it was 1 for all seven others, 25-7 for this.
			_population = [];
			for(var i=0; i<Tournament.INITIAL_AGENTS.length; i++){
				if(i==_anchoredIndex){
					_population.push(18);
				}else{
					_population.push(1);
				}
			}

			// Remainder is 7
			_remainder = 7;

		}else{

			// Create array of all initial agents...
			_population = [];
			for(var i=0; i<Tournament.INITIAL_AGENTS.length; i++){
				var conf = Tournament.INITIAL_AGENTS[i];
				_population.push(conf.count);
			}

			// Remainder sum of those NOT anchored (25-anchor.count)
			_remainder = 25-initValue;

		}

	};
	var _adjustPopulation = function(peepID, value){

		// Change the anchored one
		Tournament.INITIAL_AGENTS.find(function(config){
			return config.strategy==peepID;
		}).count = value;
		
		// What's the scale for the rest of 'em?
		var newRemainder = 25-value;
		var scale = newRemainder/_remainder;

		// Adjust everyone to scale, ROUNDING.
		var total = 0;
		for(var i=0; i<Tournament.INITIAL_AGENTS.length; i++){

			// do NOT adjust anchor.
			var conf = Tournament.INITIAL_AGENTS[i];
			if(conf.strategy==peepID) continue;

			var initCount = _population[i];
			var newCount = Math.round(initCount*scale);
			conf.count = newCount;

			// Count total!
			total += newCount;

		}
		total += value; // total

		// Difference... 
		var diff = 25-total;
		// If negative, remove one starting from BOTTOM, skipping anchor.
		// (UNLESS IT'S ZERO)
		if(diff<0){
			for(var i=Tournament.INITIAL_AGENTS.length-1; i>=0 && diff<0; i--){
				// do NOT adjust anchor.
				var conf = Tournament.INITIAL_AGENTS[i];
				if(conf.strategy==peepID) continue;
				if(conf.count==0) continue; // DON'T DO IT IF IT'S ZERO
				conf.count--; // REMOVE
				diff++; // yay
			}
		}
		// If positive, add one starting from TOP, skipping anchor.
		if(diff>0){
			for(var i=0; i<Tournament.INITIAL_AGENTS.length && diff>0; i++){
				// do NOT adjust anchor.
				var conf = Tournament.INITIAL_AGENTS[i];
				if(conf.strategy==peepID) continue;
				conf.count++; // ADD
				diff--; // yay
			}
		}

		// NOW adjust UI
		for(var i=0; i<Tournament.INITIAL_AGENTS.length; i++){
			// do NOT adjust anchor.
			var conf = Tournament.INITIAL_AGENTS[i];
			if(conf.strategy==peepID) continue;
			publish("sandbox/pop/"+conf.strategy, [conf.count]);
		}

		// Reset!
		publish("tournament/reset");

	};

	/////////////////////////////////////////
	// PAGE 1: PAYOFFS //////////////////////
	/////////////////////////////////////////

	var page = pages[1];

	// Labels
	page.appendChild(_makeLabel("sandbox_payoffs", {x:0, y:0, w:433}));
	page.appendChild(_makeLabel("label_cooperate", {x:212, y:64, rotation:45, align:"center", color:"#cccccc"}));
	page.appendChild(_makeLabel("label_cooperate", {x:116, y:64, rotation:-45, align:"center", color:"#cccccc"}));
	page.appendChild(_makeLabel("label_cheat", {x:309, y:137, rotation:45, align:"center", color:"#cccccc"}));
	page.appendChild(_makeLabel("label_cheat", {x:70, y:137, rotation:-45, align:"center", color:"#cccccc"}));

	// Inc(rement) De(crement) Numbers
	// which are symmetrical, and update each other!
	var numbers = [];
	var _makeIncDec = function(letter,x,y){
		(function(letter,x,y){

			var number = new IncDecNumber({
				x:x, y:y, max:5, min:-5,
				value: PD.PAYOFFS_DEFAULT[letter],
				onchange: function(value){
					publish("pd/editPayoffs/"+letter,[value]);
				}
			});
			subscribe("pd/editPayoffs/"+letter,function(value){
				number.setValue(value);
			});
			page.appendChild(number.dom);
			numbers.push(number);

		})(letter,x,y);
	};

	_makeIncDec("R", 191, 127);
	_makeIncDec("R", 233, 127);

	_makeIncDec("T", 121, 197);
	_makeIncDec("S", 161, 197);

	_makeIncDec("S", 263, 197);
	_makeIncDec("T", 306, 197);

	_makeIncDec("P", 192, 268);
	_makeIncDec("P", 232, 268);

	// Reset
	var resetPayoffs = new Button({x:240, y:300, text_id:"sandbox_reset_payoffs", message:"pd/defaultPayoffs"});
	page.appendChild(resetPayoffs.dom);

	/////////////////////////////////////////
	// PAGE 2: RULES ////////////////////////
	/////////////////////////////////////////

	var page = pages[2];

	// Rule: Number of turns (1 to 50)
	var rule_turns = _makeLabel("sandbox_rules_1", {x:0, y:0, w:433});
	var slider_turns = new Slider({
		x:0, y:35, width:430,
		min:1, max:50, step:1,
		message: "rules/turns"
	});
	subscribe("rules/turns",function(value){
		var words = (value==1) ? Words.get("sandbox_rules_1_single") : Words.get("sandbox_rules_1"); // plural?
		words = words.replace(/\[N\]/g, value+""); // replace [N] with the number value
		rule_turns.innerHTML = words;
	});
	page.appendChild(rule_turns);
	page.appendChild(slider_turns.dom);

	// Rule: Eliminate/Reproduce how many? (1 to 12)
	var rule_evolution = _makeLabel("sandbox_rules_2", {x:0, y:100, w:433});
	var slider_evolution = new Slider({
		x:0, y:165, width:430,
		min:1, max:12, step:1,
		message: "rules/evolution"
	});
	subscribe("rules/evolution",function(value){
		var words = (value==1) ? Words.get("sandbox_rules_2_single") : Words.get("sandbox_rules_2"); // plural?
		words = words.replace(/\[N\]/g, value+""); // replace [N] with the number value
		rule_evolution.innerHTML = words;
	});
	page.appendChild(rule_evolution);
	page.appendChild(slider_evolution.dom);

	// Rule: Noise (0% to 50%)
	var rule_noise = _makeLabel("sandbox_rules_3", {x:0, y:225, w:433});
	var slider_noise = new Slider({
		x:0, y:290, width:430,
		min:0.00, max:0.50, step:0.01,
		message: "rules/noise"
	});
	subscribe("rules/noise",function(value){
		value = Math.round(value*100);
		var words = Words.get("sandbox_rules_3");
		words = words.replace(/\[N\]/g, value+""); // replace [N] with the number value
		rule_noise.innerHTML = words;
	});
	page.appendChild(rule_noise);
	page.appendChild(slider_noise.dom);

	// DEFAULTS
	publish("rules/turns", [10]);
	publish("rules/evolution", [5]);
	publish("rules/noise", [0.05]);

	/////////////////////////////////////////
	// Add & Remove Object //////////////////
	/////////////////////////////////////////
	
	// Add...
	self.add = function(INSTANT){
		return _add(self);
	};

	// Remove...
	self.remove = function(INSTANT){
		return _remove(self);
	};

}