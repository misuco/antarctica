/* 6 370 099 200 combinations
 */
var clipId = 50;
var tempo = 100;
var loopLength = 1;
var repeat = 2;
var pitch = 0;
var basenote = 0;
var scale = 32;
var arrange = 1;
	
var music1;
var music2;

var soundTrack1;

var row1;
var row2;
var row3;
var row4;
var row5;
var row6;
var row7;
var row8;

var randomSound = function() {
		row1.setRandomValue();
		row2.setRandomValue();
		row3.setRandomValue();
		row4.setRandomValue();
		row5.setRandomValue();
		row6.setRandomValue();
		row7.setRandomValue();
		row8.setRandomValue();
}

var triggerNewSound = function() {
		
		var oReq = new XMLHttpRequest();
		oReq.addEventListener("load", function() {
			if(this.response.includes("Error")) {
				console.log("server error!!!");
				statusPanel2.text = "server error!!!";
			} else {
				music2=music1;
				music1 = new BABYLON.Sound(
				  "track1",
				  this.responseText,
				  scene,
				  function() {
					console.log("music 1 ready... play");
					console.log("music 1 class: " + music1.getClassName() );
					console.log("music 1 gain: " + music1.getSoundGain() );
					console.log("music 1 audio buffer: " + music1.getAudioBuffer() );
					console.log("music 1 time: " + music1.currentTime );
					
					if(music2!=undefined) {
						music2.stop();
						soundTrack1.removeSound(music2);
						music2.dispose();
					}
														
					soundTrack1.addSound(music1);
					
					music1.onEndedObservable.addOnce(() => {
						music1.stop();
					});
					/*
					music1.onEndedObservable.addOnce(() => {
							recordIndex++;
							if(recordIndex>=records.length) recordIndex=0;
							selectedSpot.position.x = records[recordIndex][2];
							selectedSpot.position.z = records[recordIndex][3];						
							infoPanel.text = records[recordIndex][5] + "\n" + records[recordIndex][6] + "\n" + records[recordIndex][13] + "\n" + records[recordIndex][14];
							triggerNewSound();
						});
						*/
					music1.setVolume(1);
					music1.play();
					statusPanel2.text = " playing: " + music1.currentTime;
				  },
				  { loop: false }
				);
				
				console.log("loading sound:"+this.responseText);
				statusPanel2.text = "loading sound:"+this.responseText;
			}
		});
		
		var getUrl = window.location;
		var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" ; //+ getUrl.pathname.split('/')[1];		
		
		statusPanel2.text = "downloading " + getUrl + "/" + recordIndex + "-"+Date.now();
		oReq.open("GET", baseUrl + "newclip?id="+recordIndex+"-"+Date.now()+"&clipId="+clipId+"&tempo="+tempo+"&loopLength="+loopLength+"&repeat="+repeat+"&pitch="+pitch+"&basenote="+basenote+"&scale="+scale+"&arrange="+arrange);
		oReq.send();
    }
    
var createSound = function (scene,panel) {
	BABYLON.Engine.audioEngine.setGlobalVolume(1);	
	soundTrack1 = new BABYLON.SoundTrack(scene);
    
    var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "play");
    button1.width = "50px"
    button1.height = "40px";
    button1.color = "white";
    button1.cornerRadius = 20;
    button1.background = "green";
    button1.onPointerUpObservable.add( triggerNewSound );
    panel.addControl(button1, 0, 0);    
    

	row1 = new sliderPlus( panel, 1, "Clip", 0, 1, 185, clipId );
	row1.setValueFunction( function(value) {
		clipId = value;
	} );

	row2 = new sliderPlus( panel, 2, "Tempo", 10, 1, 500, tempo );
	row2.setValueFunction( function(value) {
		tempo = value;
	} );

	row3 = new sliderPlus( panel, 3, "Loop", 1, 1, 16, loopLength );
	row3.setValueFunction( function(value) {
		loopLength = value;
	} );

	row4 = new sliderPlus( panel, 4, "Repeat", 1, 1, 16, repeat );
	row4.setValueFunction( function(value) {
		repeat = value;
	} );

	row5 = new sliderPlus( panel, 5, "Pitch", -36, 1, 36, pitch );
	row5.setValueFunction( function(value) {
		pitch = value;
	} );

	row6 = new sliderPlus( panel, 6, "Note", 0, 1, 12, basenote );
	row6.setValueFunction( function(value) {
		basenote = value;
	} );

	row7 = new sliderPlus( panel, 7, "Scale", 1, 1,46, scale );
	row7.setValueFunction( function(value) {
		scale = value;
	} );

	row8= new sliderPlus( panel, 8, "Arrange", 1, 1, 10, arrange );
	row8.setValueFunction( function(value) {
		arrange = value;
	} );
    
    return scene;
};

