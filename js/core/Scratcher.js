(function(exports){

var Scratcher = {};
exports.Scratcher = Scratcher;

Scratcher.scratch = function(gotoID){

	var dom = $("#scratcher");
	dom.style.display = "block";

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