
var createSound = function (scene,panel) {
	BABYLON.Engine.audioEngine.setGlobalVolume(1);

	var soundTrack1 = new BABYLON.SoundTrack(scene);
	
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
    
    var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Apply");
    button1.width = "50px"
    button1.height = "40px";
    button1.color = "white";
    button1.cornerRadius = 20;
    button1.background = "green";
    button1.onPointerUpObservable.add(function() {

		var oReq = new XMLHttpRequest();
		oReq.addEventListener("load", function() {
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
				music1.setVolume(1);
				music1.play();
			  },
			  { loop: true }
			);
			
			console.log("loading sound:"+this.responseText);
		});
		
		var getUrl = window.location;
		var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" ; //+ getUrl.pathname.split('/')[1];		
		
		console.log("getUrl " + getUrl + " " + baseUrl);
		oReq.open("GET", baseUrl + "newclip?id="+Date.now()+"&clipId="+clipId+"&tempo="+tempo+"&loopLength="+loopLength+"&repeat="+repeat+"&pitch="+pitch+"&basenote="+basenote+"&scale="+scale+"&arrange="+arrange);
		oReq.send();
    });
    panel.addControl(button1, 0, 0);    
    

	var row1 = new sliderPlus( panel, 1, "Clip", 0, 1, 185, clipId );
	row1.setValueFunction( function(value) {
		clipId = value;
	} );

	var row2 = new sliderPlus( panel, 2, "Tempo", 10, 1, 500, tempo );
	row2.setValueFunction( function(value) {
		tempo = value;
	} );

	var row3 = new sliderPlus( panel, 3, "Loop", 1, 1, 16, loopLength );
	row3.setValueFunction( function(value) {
		loopLength = value;
	} );

	var row4 = new sliderPlus( panel, 4, "Repeat", 1, 1, 16, repeat );
	row4.setValueFunction( function(value) {
		repeat = value;
	} );

	var row5 = new sliderPlus( panel, 5, "Pitch", -36, 1, 36, pitch );
	row5.setValueFunction( function(value) {
		pitch = value;
	} );

	var row6 = new sliderPlus( panel, 6, "Note", 0, 1, 12, basenote );
	row6.setValueFunction( function(value) {
		basenote = value;
	} );

	var row7 = new sliderPlus( panel, 7, "Scale", 1, 1,46, scale );
	row7.setValueFunction( function(value) {
		scale = value;
	} );

	var row8= new sliderPlus( panel, 8, "Arrange", 1, 1, 2, arrange );
	row8.setValueFunction( function(value) {
		arrange = value;
	} );
    
    /// ROW 1
    
    /*
	var header1 = new BABYLON.GUI.TextBlock();
	header1.text = "Clip id: " + clipId;
	header1.height = "30px";
	header1.color = "white";
	panel.addControl(header1, 1, 0);
    
    var button1minus = BABYLON.GUI.Button.CreateSimpleButton("but1minus", "-1");
    button1minus.width = "50px"
    button1minus.height = "40px";
    button1minus.color = "white";
    button1minus.cornerRadius = 20;
    button1minus.background = "green";
    button1minus.onPointerUpObservable.add(function() {
		clipId--;
		slider1.value=clipId;
    });
    panel.addControl(button1minus, 1, 1);  
    	
    var slider1 = new BABYLON.GUI.Slider();
    slider1.minimum = 0;
    slider1.maximum = 185;
    slider1.value = 50;
    slider1.step = 1;
    slider1.height = "20px";
    slider1.width = "150px";
    slider1.onValueChangedObservable.add(function(value) {
		clipId = value;
		header1.text = "Clip id: " + clipId;
    });
    panel.addControl(slider1, 1, 2);    

    var button1plus = BABYLON.GUI.Button.CreateSimpleButton("but1plus", "+1");
    button1plus.width = "50px"
    button1plus.height = "40px";
    button1plus.color = "white";
    button1plus.cornerRadius = 20;
    button1plus.background = "green";
    button1plus.onPointerUpObservable.add(function() {
		clipId++;
		slider1.value=clipId;
    });    
    panel.addControl(button1plus, 1, 3);    

	/// ROW 2

	var header2 = new BABYLON.GUI.TextBlock();
	header2.text = "Tempo: " + tempo;
	header2.height = "30px";
	header2.color = "white";
	panel.addControl(header2, 2, 0);
	    
    var button2minus = BABYLON.GUI.Button.CreateSimpleButton("but2minus", "-1");
    button2minus.width = "50px"
    button2minus.height = "40px";
    button2minus.color = "white";
    button2minus.cornerRadius = 20;
    button2minus.background = "green";
    button2minus.onPointerUpObservable.add(function() {
		tempo--;
		slider2.value=tempo;
    });
    panel.addControl(button2minus, 2, 1);  
    
    var slider2 = new BABYLON.GUI.Slider();
    slider2.minimum = 20;
    slider2.maximum = 400;
    slider2.value = 100;
    slider2.step = 1;
    slider2.height = "20px";
    slider2.width = "150px";
    slider2.onValueChangedObservable.add(function(value) {
		tempo = value;
		header2.text = "Tempo: " + tempo;
    });
    panel.addControl(slider2, 2, 2); 
    
    var button2plus = BABYLON.GUI.Button.CreateSimpleButton("but2plus", "+1");
    button2plus.width = "50px"
    button2plus.height = "40px";
    button2plus.color = "white";
    button2plus.cornerRadius = 20;
    button2plus.background = "green";
    button2plus.onPointerUpObservable.add(function() {
		tempo++;
		slider2.value=tempo;
    });    
    panel.addControl(button2plus, 2, 3);    
    
    /// ROW 3   

	var header3 = new BABYLON.GUI.TextBlock();
	header3.text = "loopLength: " + loopLength;
	header3.height = "30px";
	header3.color = "white";
	panel.addControl(header3, 3, 0);
	
    var button3minus = BABYLON.GUI.Button.CreateSimpleButton("but3minus", "-1");
    button3minus.width = "50px"
    button3minus.height = "40px";
    button3minus.color = "white";
    button3minus.cornerRadius = 20;
    button3minus.background = "green";
    button3minus.onPointerUpObservable.add(function() {
		loopLength--;
		slider3.value=loopLength;
    });
    panel.addControl(button3minus, 3, 1);  
    
    var slider3 = new BABYLON.GUI.Slider();
    slider3.minimum = 1;
    slider3.maximum = 8;
    slider3.value = 1;
    slider3.step = 1;
    slider3.height = "20px";
    slider3.width = "150px";
    slider3.onValueChangedObservable.add(function(value) {
		loopLength = value;
		header3.text = "loopLength: " + loopLength;
    });
    panel.addControl(slider3, 3, 2);    
    
    var button3plus = BABYLON.GUI.Button.CreateSimpleButton("but3plus", "+1");
    button3plus.width = "50px"
    button3plus.height = "40px";
    button3plus.color = "white";
    button3plus.cornerRadius = 20;
    button3plus.background = "green";
    button3plus.onPointerUpObservable.add(function() {
		loopLength++;
		slider3.value=loopLength;
    });    
    panel.addControl(button3plus, 3, 3);    

	// ROW 4
	var header4 = new BABYLON.GUI.TextBlock();
	header4.text = "repeat: " + repeat;
	header4.height = "30px";
	header4.color = "white";
	panel.addControl(header4, 4, 0);

    var button4minus = BABYLON.GUI.Button.CreateSimpleButton("but4minus", "-1");
    button4minus.width = "50px"
    button4minus.height = "40px";
    button4minus.color = "white";
    button4minus.cornerRadius = 20;
    button4minus.background = "green";
    button4minus.onPointerUpObservable.add(function() {
		repeat--;
		slider4.value=repeat;
    });
    panel.addControl(button4minus, 4, 1);  
    
    var slider4 = new BABYLON.GUI.Slider();
    slider4.minimum = 1;
    slider4.maximum = 8;
    slider4.value = 2;
    slider4.step = 1;
    slider4.height = "20px";
    slider4.width = "150px";
    slider4.onValueChangedObservable.add(function(value) {
		repeat = value;
		header4.text = "repeat: " + repeat;
    });
    panel.addControl(slider4, 4, 2);    
    
    var button4plus = BABYLON.GUI.Button.CreateSimpleButton("but4plus", "+1");
    button4plus.width = "50px"
    button4plus.height = "40px";
    button4plus.color = "white";
    button4plus.cornerRadius = 20;
    button4plus.background = "green";
    button4plus.onPointerUpObservable.add(function() {
		repeat++;
		slider4.value=repeat;
    });    
    panel.addControl(button4plus, 4, 3);    

	// ROW 5
	var header5 = new BABYLON.GUI.TextBlock();
	header5.text = "pitch: " + pitch;
	header5.height = "30px";
	header5.color = "white";
	panel.addControl(header5, 5, 0);

    var button5minus = BABYLON.GUI.Button.CreateSimpleButton("but5minus", "-1");
    button5minus.width = "50px"
    button5minus.height = "40px";
    button5minus.color = "white";
    button5minus.cornerRadius = 20;
    button5minus.background = "green";
    button5minus.onPointerUpObservable.add(function() {
		pitch--;
		slider5.value=pitch;
    });
    panel.addControl(button5minus, 5, 1);  

    var slider5 = new BABYLON.GUI.Slider();
    slider5.minimum = -24;
    slider5.maximum = 24;
    slider5.value = 0;
    slider5.step = 1;
    slider5.height = "20px";
    slider5.width = "150px";
    slider5.onValueChangedObservable.add(function(value) {
		pitch = value;
		header5.text = "pitch: " + pitch;
    });    
    panel.addControl(slider5, 5, 2);    
    
    var button5plus = BABYLON.GUI.Button.CreateSimpleButton("but5plus", "+1");
    button5plus.width = "50px"
    button5plus.height = "40px";
    button5plus.color = "white";
    button5plus.cornerRadius = 20;
    button5plus.background = "green";
    button5plus.onPointerUpObservable.add(function() {
		pitch++;
		slider5.value=pitch;
    });    
    panel.addControl(button5plus, 5, 3);    
    */
    
    return scene;
};

