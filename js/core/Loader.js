window.Loader = {};

Loader.manifest = {};
Loader.manifestPreload = {}; // For Preloader
Loader.sounds = {};

/***************

Actually LOAD all the assets in a manifest. Like so:

Loader.loadAssets(Loader.manifest, function(){
	Loader.sceneManager.gotoScene(Loader.START_SCENE);
	Loader.startUpdateAndDraw();
});

***************/
Loader.loadAssets = function(manifest, completeCallback, progressCallback){

	var deferred = Q.defer();
	completeCallback = completeCallback || function(){};
	progressCallback = progressCallback || function(){};

	// ABSOLUTE NUMBER OF ASSETS!
	var _isLoadingImages = 0;
	var _isLoadingSounds = 0;
	var _totalAssetsLoaded = 0;
	var _totalAssetsToLoad = 0;
	for(var key in manifest){
		var src = manifest[key];

		// Loading sounds or images?
		if(src.slice(-4)==".mp3") _isLoadingSounds=1;
		else _isLoadingImages=1;

		// Loading sprite or image?
		if(src.slice(-5)==".json") _totalAssetsToLoad+=2; // Is Sprite. Actually TWO assets.
		else _totalAssetsToLoad+=1;
		
	}

	// When you load an asset
	var _onAssetLoad = function(){
		_totalAssetsLoaded++;
		if(progressCallback){
			progressCallback(_totalAssetsLoaded/_totalAssetsToLoad); // Callback PROGRESS
		}
	};

	// When you load a group
	var _groupsToLoad = _isLoadingImages + _isLoadingSounds;
	var _onGroupLoaded = function(){
		_groupsToLoad--;
		if(_groupsToLoad==0){
			completeCallback(); // DONE.
			deferred.resolve();
		}
	};

	// HOWLER - Loading Sounds
	var _soundsToLoad = 0;
	var _onSoundLoad = function(){
		_soundsToLoad--;
		_onAssetLoad();
		if(_soundsToLoad==0) _onGroupLoaded();
	};

	// PIXI - Loading Images & Sprites (or pass it to Howler)
	var loader = PIXI.loader;
	var resources = PIXI.loader.resources;
	for(var key in manifest){

		var src = manifest[key];

		// Is MP3. Leave it to Howler.
		if(src.slice(-4)==".mp3"){
			var sound = new Howl({ src:[src] });
			_soundsToLoad++;
			sound.once('load', _onSoundLoad);
			Loader.sounds[key] = sound;
			continue;
		}

		// Otherwise, is an image (or json). Leave it to PIXI.
	    loader.add(key, src);

	}
	loader.on('progress', _onAssetLoad);
	loader.once('complete', _onGroupLoaded);
	loader.load();

	// Promise!
	return deferred.promise;

};

/***************

Add assets to manifest! Like so:

Loader.addToManifest(Loader.manifest,{
	bg: "sprites/bg.png",
	button: "sprites/button/button.json",
	[key]: [filepath],
	[key]: [filepath],
	etc...
});

***************/
Loader.addToManifest = function(manifest, keyValues){
	for(var key in keyValues){
		manifest[key] = keyValues[key];
	}
};
