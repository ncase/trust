
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