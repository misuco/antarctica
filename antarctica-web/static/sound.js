/* 6 370 099 200 combinations
*/
var clipId = 1;
var tempo = 40;
var loopLength = 4;
var repeat = 4;
var pitch = 0;
var basenote = 0;
var scale = 16;
var arrange = 0;

var sounds = [];
var loadingSoundsMap = new Map();

var trackStateUpdated = false;

var soundTrack1;

var soundParams = [];

var nextSound = function() {
	soundParams.forEach((item, i) => {
		item.change();
	});
   updateSessionControl();
}

var checkMaxSounds = function() {
	while(sounds.length>maxSounds) {
		console.log("dispose sound 0 " + sounds.length + " > " + maxSounds );
		disposeSoundTrack(0);
	}
}

var playTrack = function(trackId) {
	console.log("play track: "+trackId);
	playingTrack=trackId;

	var music1 = new BABYLON.Sound(
		trackId,
		trackId,
		scene,
		function() {
			console.log("music 1 ready... play");
			soundTrack1.addSound(music1);
			music1.loopcount=0;
			music1.onEndedObservable.add(() => {
				console.log("music 1 ended at state " + state);
				music1.loopcount++;
				if(loopPlay==true) {
					music1.play();
				}
				if(autoPilot==true && music1.loopcount==1) {
					selectSpot(nextPointFields);
				}
			});

			checkMaxSounds();

			music1.setVolume(1);
			music1.play();
			state='play';
			trackStateUpdated=true;
		},
		{
			loop: false,
			spatialSound: true,
			distanceModel: "exponential",
			rolloffFactor: 1.5
		}
	);

	music1.setPosition(new BABYLON.Vector3(selectedSpot.position.x, selectedSpot.position.y, selectedSpot.position.z));

	sounds.push(music1);

	console.log("loading sound:"+trackId);
	statusPanel.text = "loading sound:"+this.responseText;
}

var triggerNewSound = function(trackId) {

	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", function() {
		loadingSoundsMap.delete(trackId);
		trackStateUpdated=true;
		if(this.response.includes("Error")) {
			console.log("server error!!!");
			state='server error';
			nextSound();
			triggerNewSound();
		} else {
			if(loopPlay) playTrack(this.response + "-loop.mp3");
			else playTrack(this.response + ".mp3");
		}
	});

	var getUrl = window.location;
	var baseUrl = getUrl.protocol + "//" + getUrl.host + "/";

	console.log("trigger new sound trackId " + trackId);

	statusPanel.text = "downloading " + getUrl + "/" + clipId;

	var queryId=trackId+"_"+clipId+"_"+tempo+"_"+loopLength+"_"+repeat+"_"+pitch+"_"+basenote+"_"+scale+"_"+arrange+"_"+Date.now();
	oReq.open("GET", baseUrl + "newclip?id="+queryId+"&clipId="+clipId+"&tempo="+tempo+"&loopLength="+loopLength+"&repeat="+repeat+"&pitch="+pitch+"&basenote="+basenote+"&scale="+scale+"&arrange="+arrange);
	oReq.send();
}

var createSoundTrack = function (scene) {
	soundTrack1 = new BABYLON.SoundTrack(scene);
	BABYLON.Engine.audioEngine.setGlobalVolume(1);

	var value1 = new valuePlus( "Clip ID", 0, 1, 185, clipId );
	value1.setValueFunction( function(value) {
		clipId = value;
	} );

	var value2 = new valuePlus( "Tempo", 10, 1, 500, tempo );
	value2.setValueFunction( function(value) {
		tempo = value;
	} );

	var value3 = new valuePlus( "Loop len", 1, 1, 16, loopLength );
	value3.setValueFunction( function(value) {
		loopLength = value;
	} );

	var value4 = new valuePlus( "Repeat", 1, 1, 16, repeat );
	value4.setValueFunction( function(value) {
		repeat = value;
	} );

	var value5 = new valuePlus( "Pitch", -36, 1, 36, pitch );
	value5.setValueFunction( function(value) {
		pitch = value;
	} );

	var value6 = new valuePlus( "Basenote", 0, 1, 12, basenote );
	value6.setValueFunction( function(value) {
		basenote = value;
	} );

	var value7 = new valuePlus( "Scale", 1, 1,46, scale );
	value7.setValueFunction( function(value) {
		scale = value;
	} );

	var value8= new valuePlus( "Arrange", 0, 1, 10, arrange );
	value8.setValueFunction( function(value) {
		arrange = value;
	} );

	soundParams.push(value1);
	soundParams.push(value2);
	soundParams.push(value3);
	soundParams.push(value4);
	soundParams.push(value5);
	soundParams.push(value6);
	soundParams.push(value7);
	soundParams.push(value8);
}

var disposeSoundTrack = function ( trackNr ) {
	if(trackNr<sounds.length) {
		sounds[trackNr].stop();
		sounds[trackNr].dispose();
		sounds.splice(trackNr,1);
		trackStateUpdated=true;
	}
}

var pauseSoundTrack = function ( trackNr ) {
	if(trackNr<sounds.length) {
		sounds[trackNr].pause();
		trackStateUpdated=true;
	}
}

var playSoundTrack = function ( trackNr ) {
	if(trackNr<sounds.length) {
		sounds[trackNr].play();
		trackStateUpdated=true;
	}
}
