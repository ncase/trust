Loader.addToManifest(Loader.manifest,{
	scratch_in: "assets/sounds/scratch_in.mp3",
	scratch_out: "assets/sounds/scratch_out.mp3"
});

(function(exports){

var Scratcher = {};
exports.Scratcher = Scratcher;

Scratcher.isTransitioning = false;

Scratcher.scratch = function(gotoID){

	if(Scratcher.isTransitioning) return;
	Scratcher.isTransitioning = true;

	var dom = $("#scratcher");
	dom.style.display = "block";
	dom.className = "scratcher";

	var width = $("#main").clientWidth;
	var height = $("#main").clientHeight;
	dom.style.width = width+"px";
    dom.style.height = height+"px";
    dom.style.left = -width/2+"px";
    dom.style.top = -height/2+"px";

	Scratcher.scratchAnim(dom, true)
	.then(function(){
		if(gotoID){
			publish("slideshow/goto", [gotoID]);
		}else{
			publish("slideshow/next");
		}
	})
	.then(function(){
		return Scratcher.scratchAnim(dom, false);
	})
	.then(function(){
		dom.style.display = "none";
		Scratcher.isTransitioning = false;
	});

};
subscribe("slideshow/scratch", Scratcher.scratch);


Scratcher.scratchAnim = function(dom, scratchIn){

	var deferred = Q.defer();
	var frame = 0;
	var interval = setInterval(function(){
		frame++;
		if(frame>19){
			clearInterval(interval);
			deferred.resolve();
		}else{
			dom.style.backgroundPosition = (scratchIn?0:-100)+"% "+(frame*-100)+"%";
		}
	},40);

	setTimeout(function(){
		var sound = scratchIn ? Loader.sounds.scratch_in : Loader.sounds.scratch_out;
		sound.play();
	},100);

	return deferred.promise;

};

Scratcher.smallScratch = function(x,y,width,height,_onChange,_onComplete){

	// Create DOM
	var scratcher = document.createElement("div");
	scratcher.style.left = x+"px";
	scratcher.style.top = y+"px";
	scratcher.style.width = width+"px";
	scratcher.style.height = height+"px";
	scratcher.className = "scratcher";
	scratcher.style.display = "block";
	slideshow.dom.appendChild(scratcher);

	// Animate!
	Scratcher.scratchAnim(scratcher, true)
	.then(function(){
		if(_onChange) _onChange();
	})
	.then(function(){
		return Scratcher.scratchAnim(scratcher, false);
	})
	.then(function(){
		slideshow.dom.removeChild(scratcher); // Destroy DOM
		if(_onComplete) _onComplete();
	});

};


})(window);
