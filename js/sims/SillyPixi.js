function SillyPixi(config){

	var self = this;
	self.id = config.id;
	
	// APP
	var app = new PIXI.Application(config.width, config.height);
	self.dom = app.view;

	// DOM
	self.dom.className = "object";
	self.dom.classList.add("fader");
	self.dom.style.left = config.x+"px";
	self.dom.style.top = config.y+"px";

	// BUNNY
	var bunny = PIXI.Sprite.fromImage("assets/bun.png")
	bunny.anchor.set(0.5);
	bunny.x = app.renderer.width/2;
	bunny.y = app.renderer.height/2;
	app.stage.addChild(bunny);

	// ANIMATE
	app.ticker.add(function(delta) {
	    bunny.rotation += 0.1 * delta;
	});

	// Add...
	self.add = function(INSTANT){
		return _addFade(self, INSTANT);
	};

	// Remove...
	self.remove = function(INSTANT){
		return _removeFade(self, INSTANT);
	};

}
