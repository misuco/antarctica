/* 6 370 099 200 combinations
*/
var clipId = 1;
var pitchClipId = 1;
var tempo = 40;
var loopLength = 4;
var repeat = 4;
var pitch = 0;
var basenote = 0;
var scale = 16;
var arrange = 0;
var soundProg = 0;
var loopPlay = 0;
var autoPilot = 0;
var autoPilotDistance = 5;
var maxSounds = 1;

var sounds = [];
var loadingSoundsMap = new Map();

var trackStateUpdated = false;

var soundTrack1;

var soundParams = [];
var soundParamsMap = new Map();

var nextSound = function() {
	soundParams.forEach((item, i) => {
		item.change();
	});
   updateSessionControl();
}

var checkMaxSounds = function() {
	console.log("check max sounds length: " + sounds.length + " max: " + maxSounds);
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
				console.log("music 1 ended autoPilot " + autoPilot + " loopPlay " + loopPlay);
				music1.loopcount++;
				if(loopPlay==1) {
					music1.play();
				}
				if(autoPilot==1 && music1.loopcount==1) {
					selectSpot(nextPointFields);
				}
			});

			checkMaxSounds();

			music1.setVolume(1);
			music1.play();
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
			nextSound();
			triggerNewSound();
		} else {
			if(loopPlay==1) playTrack(this.response + "-loop.mp3");
			else playTrack(this.response + ".mp3");
		}
	});

	var getUrl = window.location;
	var baseUrl = getUrl.protocol + "//" + getUrl.host + "/";

	console.log("trigger new sound trackId " + trackId);

	statusPanel.text = "downloading " + getUrl + "/" + clipId;

	var queryId=trackId+"_"+clipId+"_"+pitchClipId+"_"+tempo+"_"+loopLength+"_"+repeat+"_"+pitch+"_"+basenote+"_"+scale+"_"+arrange+"_"+Date.now();
	oReq.open("GET", baseUrl + "newclip?id="+queryId+"&clipId="+clipId+"&pitchClipId="+pitchClipId+"&tempo="+tempo+"&loopLength="+loopLength+"&repeat="+repeat+"&pitch="+pitch+"&basenote="+basenote+"&scale="+scale+"&arrange="+arrange+"&sound="+soundProg+"&sessionId="+sessionId);
	oReq.send();
}

var createSoundTrack = function (scene) {
	soundTrack1 = new BABYLON.SoundTrack(scene);
	BABYLON.Engine.audioEngine.setGlobalVolume(1);

	soundParamsMap.set("Rhythm Clip ID",new valuePlus( "Rhythm Clip ID", 0, 1, 81, clipId ));
	soundParamsMap.get("Rhythm Clip ID").setValueFunction( function(value) {
		clipId = value;
	} );
	soundParams.push(soundParamsMap.get("Rhythm Clip ID"));

	soundParamsMap.set("Pitch Clip ID",new valuePlus( "Pitch Clip ID", 0, 1, 81, clipId ));
	soundParamsMap.get("Pitch Clip ID").setValueFunction( function(value) {
		pitchClipId = value;
	} );
	soundParams.push(soundParamsMap.get("Pitch Clip ID"));

	soundParamsMap.set("Tempo",new valuePlus( "Tempo", 10, 1, 500, tempo ));
	soundParamsMap.get("Tempo").setValueFunction( function(value) {
		tempo = value;
	} );
	soundParams.push(soundParamsMap.get("Tempo"));

	soundParamsMap.set("Loop len",new valuePlus( "Loop len", 1, 1, 186, loopLength ));
	soundParamsMap.get("Loop len").setValueFunction( function(value) {
		loopLength = value;
	} );
	soundParams.push(soundParamsMap.get("Loop len"));

	soundParamsMap.set("Repeat",new valuePlus( "Repeat", 1, 1, 16, repeat ));
	soundParamsMap.get("Repeat").setValueFunction( function(value) {
		repeat = value;
	} );
	soundParams.push(soundParamsMap.get("Repeat"));

	soundParamsMap.set("Pitch",new valuePlus( "Pitch", -36, 1, 36, pitch ));
	soundParamsMap.get("Pitch").setValueFunction( function(value) {
		pitch = value;
	} );
	soundParams.push(soundParamsMap.get("Pitch"));

	soundParamsMap.set("Basenote",new valuePlus( "Basenote", 0, 1, 10, basenote ));
	soundParamsMap.get("Basenote").setValueFunction( function(value) {
		basenote = value;
	} );
	soundParams.push(soundParamsMap.get("Basenote"));

	soundParamsMap.set("Scale",new valuePlus( "Scale", 0, 1, 44, scale ));
	soundParamsMap.get("Scale").setValueFunction( function(value) {
		scale = value;
	} );
	soundParams.push(soundParamsMap.get("Scale"));

	soundParamsMap.set("Arrange",new valuePlus( "Arrange", 0, 1, 10, arrange ));
	soundParamsMap.get("Arrange").setValueFunction( function(value) {
		arrange = value;
	} );
	soundParams.push(soundParamsMap.get("Arrange"));

	soundParamsMap.set("Sound",new valuePlus( "Sound", 0, 1, 127, soundProg ));
	soundParamsMap.get("Sound").setValueFunction( function(value) {
		soundProg = value;
	} );
	soundParams.push(soundParamsMap.get("Sound"));

	soundParamsMap.set("Autopilot",new valuePlus( "Autopilot", 0, 1, 1, autoPilot ));
	soundParamsMap.get("Autopilot").setValueFunction( function(value) {
		autoPilot = value;
	} );
	soundParams.push(soundParamsMap.get("Autopilot"));

	soundParamsMap.set("Autopilot distance",new valuePlus( "Autopilot distance", 0, 1, 9, autoPilotDistance ));
	soundParamsMap.get("Autopilot distance").setValueFunction( function(value) {
		autoPilotDistance = value;
	} );
	soundParams.push(soundParamsMap.get("Autopilot distance"));

	soundParamsMap.set("Loop Play",new valuePlus( "Loop Play", 0, 1, 1, loopPlay ));
	soundParamsMap.get("Loop Play").setValueFunction( function(value) {
		loopPlay = value;
	} );
	soundParams.push(soundParamsMap.get("Loop Play"));

	soundParamsMap.set("Max sounds",new valuePlus( "Max sounds", 0, 1, 10, maxSounds ));
	soundParamsMap.get("Max sounds").setValueFunction( function(value) {
		maxSounds = value;
	} );
	soundParams.push(soundParamsMap.get("Max sounds"));

	soundParamsMap.set("Title",new valuePlus( "Title", 0, 1, 10, "DefaultTitle" ));
	soundParamsMap.get("Title").setValueFunction( function(value) {
		title = value;
	} );
	soundParams.push(soundParamsMap.get("Title"));

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
