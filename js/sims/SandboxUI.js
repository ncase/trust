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

	// Labels
	page.appendChild(_makeLabel("sandbox_rules_1", {x:0, y:0, w:433}));
	page.appendChild(_makeLabel("sandbox_rules_2", {x:0, y:100, w:433}));
	page.appendChild(_makeLabel("sandbox_rules_3", {x:0, y:225, w:433}));

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