//// OBJECTS

var mRed = new BABYLON.StandardMaterial("m4", scene);
mRed.diffuseColor = new BABYLON.Color3(1, 0, 0);
mRed.alpha = 0.5;
mRed.freeze();

var mGreen = new BABYLON.StandardMaterial("m5", scene);
mGreen.diffuseColor = new BABYLON.Color3(0, 1, 0);
mGreen.freeze();

var mYellow = new BABYLON.StandardMaterial("m3", scene);
mYellow.diffuseColor = new BABYLON.Color3(1, 1, 0);
mYellow.alpha = 0.5;
mYellow.freeze();

var nOrbiter=6;
var orbiter = [];
var orbitertrack = [];


for(let i=0;i<nOrbiter;i++) {
  orbiter[i] = BABYLON.MeshBuilder.CreateSphere("orbiter"+i, { diameter:2 }, scene);
  orbiter[i].material = mGreen;
  //track[i] = new BABYLON.Sound("track"+i, "music/test"+i+".mp3", scene, null, { loop: true, autoplay: true, spatialSound: true });
  //track[i].attachToMesh(orbiter[i]);
}

const nSlalom=1000;
var slalom = [];
var slalomtrack = [];

/*
var planet_mesh;

SceneLoader.ImportMeshAsync(
  null,
  "obj/Planet_1.gltf",
  null,
  scene
).then(({ meshes }) => {
      planet_mesh=meshes[0];
	  //planet_mesh.position.x = 0;
	  //planet_mesh.position.y = 0;
	  //planet_mesh.position.z = 0;
	  planet_mesh.isVisible=false;
	  //planet_mesh.scaling.x = 0.2;
	  //planet_mesh.scaling.y = 0.2;
	  //planet_mesh.scaling.z = 0.2;
	 
});
*/

for(let i=0;i<nSlalom;i++) {
  //slalom[i] = planet_mesh.createInstance("slalom"+i); 
  slalom[i] = BABYLON.MeshBuilder.CreateSphere("slalom"+i, { diameter:5 }, scene);
  slalom[i].material = mYellow;
  //console.log("adding track slalom "+i);
  //slalomtrack[i] = new BABYLON.Sound("track"+i, "music/slalom"+i%10+".mp3", scene, null, { loop: true, autoplay: true, spatialSound: true });
  //slalomtrack[i].attachToMesh(slalom[i]);
  slalom[i].position.x = Math.round(i/100)*100;
  slalom[i].position.y = Math.round(i/10)%10*100;
  slalom[i].position.z = i%10*-100;
}

var nextTrackId=0;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

let tempo=75;
let clipId=0;//+getRandomInt(300);
let loopLength=2;
let repeat=8;
let pitch=0;
let basenote=0;
let scale=16;
let arrange=10;
let soundProg=getRandomInt(100);
let sessionId=0;

let loopPlay=1;

var nextSound = function() {
	nextTrackId++;
	clipId+=2;
	soundProg+=1;
	if(nextTrackId>=nOrbiter) nextTrackId=0;
	if(clipId>300) clipId=0;
	if(soundProg>127) soundProg=0;
	triggerNewSound(nextTrackId);
}

var playTrack = function(trackId) {
	console.log("play track: "+trackId);

	if(orbitertrack.length>=nOrbiter) {
		orbitertrack[nextTrackId].stop();
		orbitertrack[nextTrackId].dispose();
	}

	var track = new BABYLON.Sound(
		trackId,
		trackId,
		scene,
		function() {
			console.log("music 1 ready... play " + trackId);
			//soundTrack1.addSound(music1);
			track.loopcount=0;
			
			track.onEndedObservable.add(() => {
				console.log("music 1 ended id: " + trackId);
				track.loopcount++;
				if(loopPlay==1) {
					console.log("music 1 looped " + track.loopcount);
					track.play();
				}
				/*
				if(autoPilot==1 && music1.loopcount==1) {
					selectSpot(nextPointFields);
				}
				*/
			});

			//checkMaxSounds();

			track.setVolume(1);
			readyTacks.push(track);
			//track.play();
			//trackStateUpdated=true;
		},
		{
			loop: true,
			spatialSound: true,
			distanceModel: "exponential",
			rolloffFactor: 0.5,
			panningModel: "HRTF"
		}
	);

	track.attachToMesh(orbiter[nextTrackId]);
	orbitertrack[nextTrackId]=track;
	
    orbiter[nextTrackId].material = mGreen;

	console.log("loading sound:"+trackId);
	
	//nextSound();	
}

var triggerNewSound = function(trackId) {

    orbiter[trackId].material = mRed;
	
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", function() {
		//loadingSoundsMap.delete(trackId);
		//trackStateUpdated=true;
		if(this.response.includes("Error")) {
			console.log("server error!!!");
			nextSound();
			triggerNewSound(nextTrackId);
		} else {
			if(loopPlay==1) playTrack(this.response + "-loop.mp3");
			else playTrack(this.response + ".mp3");
		}
	});

	var getUrl = window.location;
	var baseUrl = getUrl.protocol + "//" + getUrl.host + "/";

	console.log("trigger new sound trackId " + trackId);

	//statusPanel.text = "downloading " + getUrl + "/" + clipId;

	var queryId=trackId+"_"+clipId+"_"+tempo+"_"+loopLength+"_"+repeat+"_"+pitch+"_"+basenote+"_"+scale+"_"+arrange+"_"+Date.now();
	oReq.open("GET", baseUrl + "newclip?id="+queryId+"&clipId="+clipId+"&tempo="+tempo+"&loopLength="+loopLength+"&repeat="+repeat+"&pitch="+pitch+"&basenote="+basenote+"&scale="+scale+"&arrange="+arrange+"&sound="+soundProg+"&sessionId="+sessionId);
	oReq.send();
	
}
triggerNewSound(0);
