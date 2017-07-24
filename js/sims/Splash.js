Loader.addToManifest(Loader.manifestPreload,{
	splash_peep: "assets/splash/splash_peep.json",
	connection: "assets/splash/connection.json",
	cssAsset13: "assets/ui/sound.png"
});

function Splash(config){

	var self = this;
	self.id = config.id;

	// Dimensions, yo
	var width = $("#main").clientWidth;
	var height = $("#main").clientHeight;
	var x = -(width-960)/2;
	var y = -(height-540)/2;

	// DOM
	self.dom = document.createElement("div");
	self.dom.className = "object";
	self.dom.style.left = x+"px";
	self.dom.style.top = y+"px";
	
	// APP
	var app = new PIXI.Application(width, height, {transparent:true, resolution:2});
	app.view.style.width = width;
	app.view.style.height = height;
	self.dom.appendChild(app.view);

	// CONTAINERS
	var edgesContainer = new PIXI.Container();
	var peepsContainer = new PIXI.Container();
	app.stage.addChild(edgesContainer);
	app.stage.addChild(peepsContainer);

	// PEEPS
	var peeps = [];
	self.addPeep = function(x, y){
		var peep = new SplashPeep({ x:x, y:y, app:app, blush:config.blush });
		peeps.push(peep);
		peepsContainer.addChild(peep.graphics);
	};

	// EDGES
	var edges = [];
	self.addEdge = function(from, to){
		var edge = new SplashEdge({ from:from, to:to });
		edges.push(edge);
		edgesContainer.addChild(edge.graphics);
	};

	// Create RINGS
	var _createRing = function(xRadius, count){
		yRadius = xRadius*(350/400);
		var increment = (Math.TAU/count)+0.0001;
		for(var angle=0; angle<Math.TAU; angle+=increment){
			var a = angle-(Math.TAU/4);
			var x = width/2 + Math.cos(a)*xRadius;
			var y = height/2 + Math.sin(a)*yRadius;
			self.addPeep(x,y);
		}
	};
	_createRing(400, 20);
	_createRing(520, 25);
	_createRing(640, 30);
	_createRing(760, 35);

	// Connect all within a radius
	var _connectAllWithinRadius = function(radius){
		
		var r2 = radius*radius;

		for(var i=0;i<peeps.length;i++){
			var peep1 = peeps[i];

			for(var j=i+1;j<peeps.length;j++){
				var peep2 = peeps[j];

				// Are they close enough?
				var dx = peep2.x-peep1.x;
				var dy = peep2.y-peep1.y;
				if(dx*dx+dy*dy < r2){
					self.addEdge(peep1, peep2);
				}

			}
		}
	};
	_connectAllWithinRadius(250);

	// Animiniminimination
	var update = function(delta){
		Tween.tick();
		for(var i=0;i<peeps.length;i++) peeps[i].update(delta);
		for(var i=0;i<edges.length;i++) edges[i].update(delta);
	};
	app.ticker.add(update);
	update(0);

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
		_remove(self);
	};

}

function SplashPeep(config){

	var self = this;
	self.config = config;

	// Graphics!
	var g = _makeMovieClip("splash_peep", {scale:0.3});
	self.graphics = g;
	if(config.blush) g.gotoAndStop(1);
	if(Math.random()<0.5) g.scale.x*=-1; // Flip?

	// Them variables...
	self.app = config.app;
	self.x = config.x;
	self.y = config.y;
	var initX = config.x;
	var initY = config.y;
	var initRotation = (Math.random()-0.5)*(Math.PI-0.4);
	var radius = 5+Math.random()*20;
	var swing = 0.05+Math.random()*0.45;
	var angle = Math.random()*Math.TAU;
	var speed = (0.05+Math.random()*0.95)/60;

	self.update = function(delta){
		
		// Them variables...
		angle += speed*delta;
		var x = initX + Math.cos(angle)*radius;
		var y = initY + Math.sin(angle)*radius;
		var r = initRotation + Math.cos(angle)*swing;

		// NEAR MOUSE?
		var Mouse = self.app.renderer.plugins.interaction.mouse.global;
		var dx = Mouse.x-x;
		var dy = Mouse.y-y;
		var rad = 200;
		var bulgeX = 0;
		var bulgeY = 0;
		var dist2 = dx*dx+dy*dy;
		if(dist2 < rad*rad){
			var bulge = Math.sin(((rad-Math.sqrt(dist2))/rad)*Math.TAU/4)*50;
			var bulgeAngle = Math.atan2(-dy,-dx);
			bulgeX = Math.cos(bulgeAngle)*bulge;
			bulgeY = Math.sin(bulgeAngle)*bulge;
		}

		// Graphics!
		g.x = x + bulgeX;
		g.y = y + bulgeY;
		g.rotation = r;


	};

}

function SplashEdge(config){

	var self = this;
	self.config = config;

	// Graphics!
	var g = _makeMovieClip("connection");
	g.anchor.x = 0;
	g.anchor.y = 0.5;
	g.height = 1;
	self.graphics = g;

	// Them variables...
	self.from = config.from;
	self.to = config.to;

	self.update = function(delta){
		
		// Just update graphics!
		var f = self.from.graphics;
		var t = self.to.graphics;
		var dx = t.x-f.x;
		var dy = t.y-f.y;
		var a = Math.atan2(dy,dx);
		var dist = Math.sqrt(dx*dx+dy*dy);

		g.x = f.x; 
		g.y = f.y;
		g.rotation = a;

		g.width = dist;

	};

}