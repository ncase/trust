(function(exports){

var Scratcher = {};
exports.Scratcher = Scratcher;

Scratcher.isTransitioning = false;

Scratcher.scratch = function(gotoID){

	if(Scratcher.isTransitioning) return;
	Scratcher.isTransitioning = true;

	var dom = $("#scratcher");
	dom.style.display = "block";

	var width = $("#main").clientWidth;
	var height = $("#main").clientHeight;
	dom.style.width = width+"px";
    dom.style.height = height+"px";
    dom.style.left = -width/2+"px";
    dom.style.top = -height/2+"px";

	Scratcher.scratchAnim(true)
	.then(function(){
		if(gotoID){
			publish("slideshow/goto", [gotoID]);
		}else{
			publish("slideshow/next");
		}
	})
	.then(function(){
		return Scratcher.scratchAnim(false);
	})
	.then(function(){
		dom.style.display = "none";
		Scratcher.isTransitioning = false;
	});

};
subscribe("slideshow/scratch", Scratcher.scratch);


Scratcher.scratchAnim = function(scratchIn){
	var dom = $("#scratcher");
	var deferred = Q.defer();
	var frame = 0;
	var interval = setInterval(function(){
		frame++;
		if(frame>19){
			clearInterval(interval);
			deferred.resolve();
		}else{
			Scratcher.gotoFrame(scratchIn, frame);
		}
	},40);
	return deferred.promise;
};
Scratcher.gotoFrame = function(scratchIn, frame){
	var dom = $("#scratcher");
	dom.style.backgroundPosition = (scratchIn?0:-100)+"% "+(frame*-100)+"%";
};

})(window);