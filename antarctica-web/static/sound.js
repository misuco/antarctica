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

var value1;
var value2;
var value3;
var value4;
var value5;
var value6;
var value7;
var value8;

var randomSound = function() {
	value1.setRandomValue();
	value2.setRandomValue();
	value3.setRandomValue();
	value4.setRandomValue();
	value5.setRandomValue();
	value6.setRandomValue();
	value7.setRandomValue();
	value8.setRandomValue();
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
    
var createSoundTrack = function (scene) {
	soundTrack1 = new BABYLON.SoundTrack(scene);
	BABYLON.Engine.audioEngine.setGlobalVolume(1);	


	value1 = new valuePlus( 0, 1, 185, clipId );
	value1.setValueFunction( function(value) {
		clipId = value;
		if(row1!=undefined) row1.setValue(value);
	} );

	value2 = new valuePlus( 10, 1, 500, tempo );
	value2.setValueFunction( function(value) {
		tempo = value;
		if(row2!=undefined) row2.setValue(value);
	} );

	value3 = new valuePlus( 1, 1, 16, loopLength );
	value3.setValueFunction( function(value) {
		loopLength = value;
		if(row3!=undefined) row3.setValue(value);
	} );

	value4 = new valuePlus( 1, 1, 16, repeat );
	value4.setValueFunction( function(value) {
		repeat = value;
		if(row4!=undefined) row4.setValue(value);
	} );

	value5 = new valuePlus( -36, 1, 36, pitch );
	value5.setValueFunction( function(value) {
		pitch = value;
		if(row5!=undefined) row5.setValue(value);
	} );

	value6 = new valuePlus( 0, 1, 12, basenote );
	value6.setValueFunction( function(value) {
		basenote = value;
		if(row6!=undefined) row6.setValue(value);
	} );

	value7 = new valuePlus( 1, 1,46, scale );
	value7.setValueFunction( function(value) {
		scale = value;
		if(row7!=undefined) row7.setValue(value);
	} );

	value8= new valuePlus( 1, 1, 10, arrange );
	value8.setValueFunction( function(value) {
		arrange = value;
		if(row8!=undefined) row8.setValue(value);
	} );
	
}
    
var createSoundPanel = function () {
        
	var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

	var panel = new BABYLON.GUI.Grid();
    panel.addColumnDefinition(0.05);
    panel.addColumnDefinition(0.05);
    panel.addColumnDefinition(0.1);
    panel.addColumnDefinition(0.05);
    panel.addColumnDefinition(0.80);
    panel.addRowDefinition(0.05);
    panel.addRowDefinition(0.05);
    panel.addRowDefinition(0.05);
    panel.addRowDefinition(0.05);
    panel.addRowDefinition(0.05);
    panel.addRowDefinition(0.05);
    panel.addRowDefinition(0.05);
    panel.addRowDefinition(0.05);
    panel.addRowDefinition(0.05);
    panel.addRowDefinition(0.05);
    panel.addRowDefinition(0.05);
    panel.addRowDefinition(0.05);
    panel.addRowDefinition(0.05);
    panel.addRowDefinition(0.05);
    panel.addRowDefinition(0.05);
    panel.addRowDefinition(0.05);
    panel.addRowDefinition(0.05);
    panel.addRowDefinition(0.05);
    panel.addRowDefinition(0.05);
    panel.addRowDefinition(0.05);

	advancedTexture.addControl(panel);
	
    var closeButton = BABYLON.GUI.Button.CreateSimpleButton("closeButton", "close");
    closeButton.width = "250px"
    closeButton.height = "200px";
    closeButton.color = "white";
    closeButton.cornerRadius = 20;
    closeButton.background = "green";
    closeButton.onPointerUpObservable.add( function() { soundPanel.dispose(); } );
    panel.addControl(closeButton, 0, 0);    
	
    var playButton = BABYLON.GUI.Button.CreateSimpleButton("playButton", "play");
    playButton.width = "250px"
    playButton.height = "200px";
    playButton.color = "white";
    playButton.cornerRadius = 20;
    playButton.background = "green";
    playButton.onPointerUpObservable.add( triggerNewSound );
    panel.addControl(playButton, 9, 0);    

   	
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
    
    return panel;
};

