/**********************************

RANDOM CRAP TO MAKE MY LIFE EASIER

**********************************/

// POLLUTE THIS NAMESPACE
var _ = {};
_.clear = function(){
	var c = _.clear;
	_ = {};
	_.clear = c;
}; // the most hack-y crap ever

// Pi is for unwashed plebians
Math.TAU = 2*Math.PI;

// The poor man's jQuery
var $ = function(query){
	return document.querySelector(query);
};

// Add & Remove INSTANTLY
var _add = function(self){
	self.slideshow.dom.appendChild(self.dom);
};
var _remove = function(self){
	self.slideshow.dom.removeChild(self.dom);
};

// Add & Remove... with FADE
var _addFade = function(self, INSTANT){
	if(INSTANT){
		_add(self);
	}else{	
		self.dom.style.opacity = 0;
		_add(self);
		setTimeout(function(){
			self.dom.style.opacity = 1;
		},10);
	}
};
var _removeFade = function(self, INSTANT){
	if(INSTANT){
		_remove(self);
	}else{
		var deferred = Q.defer();
		self.dom.style.opacity = 0;
		setTimeout(function(){
			_remove(self);
			deferred.resolve();
		},300);
		return deferred.promise;
	}
};

// Make Label
var _makeLabel = function(wordID, config){
	
	var dom = document.createElement("div");
	dom.className = "label";

	dom.innerHTML = Words.get(wordID);
	config = config || {};
	
	if(config.x!==undefined) dom.style.left = config.x+"px";
	if(config.y!==undefined) dom.style.top = config.y+"px";
	if(config.w!==undefined) dom.style.width = config.w+"px";
	if(config.h!==undefined) dom.style.height = config.h+"px";

	if(config.rotation!==undefined) dom.style.transform = "rotate("+config.rotation+"deg)";
	if(config.align!==undefined) dom.style.textAlign = config.align;
	if(config.color!==undefined) dom.style.color = config.color;
	if(config.size!==undefined) dom.style.fontSize = config.size;

	return dom;

};

// Tween
var Tween_get = function(target){
	return Tween.get(target, {useTicks:true});
}
var _s = function(seconds){
	return Math.ceil(Ticker.framerate*seconds); // converts seconds to ticks
};

/*******

Make a Sprite. e.g:

_makeSprite("bg", {width:960});

*******/
function _makeSprite(textureName, options){
	options = options || {};

	// Make Sprite
	var sprite = new PIXI.Sprite(PIXI.loader.resources[textureName].texture);

	// Options
	if(options.width!==undefined) _scaleToWidth(sprite, options.width);
	if(options.anchorX!==undefined) sprite.anchor.x=options.anchorX;
	if(options.anchorY!==undefined) sprite.anchor.y=options.anchorY;

	// Gimme
	return sprite;
}

/*******

Make a MovieClip. e.g:

_makeSprite("button", {width:960});

*******/
function _makeMovieClip(resourceName, options){
	options = options || {};

	// Make that MovieClip!
	var resources = PIXI.loader.resources;
	var resource = resources[resourceName];	
	if(!resource) throw Error("There's no MovieClip named '"+resourceName+"'!");
	var numFrames = Object.keys(resource.data.frames).length;
	var frames = [];
	for(var i=0; i<numFrames; i++){
		var str = "0000" + i; // FOUR leading zeroes
		str = str.substr(str.length-4);
		frames.push(PIXI.Texture.fromFrame(resourceName+str));
	}
	var mc = new PIXI.extras.MovieClip(frames);

	// Options
	mc.gotoAndStop(0);
	mc.anchor.x = 0.5;
	mc.anchor.y = 0.5;
	if(options.width!==undefined) _scaleToWidth(mc, options.width);
	if(options.anchorX!==undefined) mc.anchor.x=options.anchorX;
	if(options.anchorY!==undefined) mc.anchor.y=options.anchorY;
	if(options.scale!==undefined) mc.scale.x=mc.scale.y=options.scale;

	// Gimme
	return mc;

}