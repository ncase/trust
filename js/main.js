var slideshow, slideSelect;
window.onload = function(){

	// PRELOADER
	Q.all([
		Loader.loadAssets(Loader.manifestPreload),
		Words.convert("words.html")
	]).then(function(){

		// CHANGE DOM
		document.body.removeChild($("#preloader"));
		$("#main").style.display = "block";
		$("#footer").style.display = "block";

		// Slideshow
		slideshow = new Slideshow({
			dom: $("#slideshow"),
			slides: SLIDES
		});

		// Slide Select
		slideSelect = new SlideSelect({
			dom: $("#select"),
			slides: SLIDES
		});
		slideSelect.dom.style.display = "none";
		subscribe("start/game", function(){
			slideSelect.dom.style.display = "block";
			$("#translations").style.display = "none";

			// [FOR DEBUGGING]
			publish("slideshow/next");
			//publish("slideshow/scratch", ["credits"]);

		});

		// SOUND
		var _soundIsOn = true;
		$("#sound").onclick = function(){
			_soundIsOn = !_soundIsOn;
			Howler.mute(!_soundIsOn);
			$("#sound").setAttribute("sound", _soundIsOn?"on":"off");
		};

		// LOAD REAL THINGS
		Loader.loadAssets(
			Loader.manifest,
			function(){
				publish("preloader/done");
			},
			function(ratio){
				publish("preloader/progress", [ratio]);
			}
		);

		// First slide!
		slideshow.nextSlide();

	});

};