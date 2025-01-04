//// OBJECTS

var readyTacks = [];

var playSyncTrack = function(trackId) {
	console.log("play sync track: "+trackId);

	var track = new BABYLON.Sound(
		trackId,
		trackId,
		scene,
		function() {
			console.log("sync track ready... play");
			
			track.setVolume(0.6);
			track.play();			
			track.loopcount=0;
			
			track.onEndedObservable.add(() => {
				console.log("sync track 1 ended at loopPlay " + loopPlay);
				track.loopcount++;

				console.log("sync track 1 looped " + track.loopcount);
				track.play();
				
				while(readyTacks.length>0) {
					let readyTrack=readyTacks.pop();
					readyTrack.play();
					console.log("sync track playing ready track");
					nextSound();
				}
			});


		},
		{
			loop: false,
			spatialSound: false,
			//distanceModel: "exponential",
			//rolloffFactor: 0.5,
			//panningModel: "HRTF"
		}
	);
	
}

var loadSyncTrack = function() {
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", function() {
		if(this.response.includes("Error")) {
			console.log("server error!!!");
		} else {
			playSyncTrack(this.response + "-loop.mp3");
		}
	});

	var getUrl = window.location;
	var baseUrl = getUrl.protocol + "//" + getUrl.host + "/";

	console.log("trigger new sync track ");
	
	let tempo=55;
	let loopLength=16;
	let sessionId=0;
	let queryId="sync_"+tempo+"_"+Date.now();
	oReq.open("GET", baseUrl + "newsync?id="+queryId+"&tempo="+tempo+"&loopLength="+loopLength+"&sessionId="+sessionId);
	oReq.send();
	
}
loadSyncTrack();
