
var createCamSliders = function (scene,panel) {
    /// ROW 6

	var row9 = new sliderPlus( panel, 9, "As", -Math.PI/2, 0.01, Math.PI/2, 0 );
	row9.setValueFunction( function(value) {
		alphashift = value;
	} );

	var row10 = new sliderPlus( panel, 10, "Bs", -Math.PI/2, 0.01, Math.PI/2, 0 );
	row10.setValueFunction( function(value) {
		betashift = value;
	} );

	var row11 = new sliderPlus( panel, 11, "A", -Math.PI/2, 0.01, Math.PI/2, 0 );
	row11.setValueFunction( function(value) {
		alphaoffset = value;
	} );

	var row12 = new sliderPlus( panel, 12, "B", 0, 0.01, Math.PI, 0 );
	row12.setValueFunction( function(value) {
		camera.beta = value;
	} );

	var row13 = new sliderPlus( panel, 13, "S", -1, 0.001, 1, 0 );
	row13.setValueFunction( function(value) {
		speed = value;
	} );

	/*
	var header1 = new BABYLON.GUI.TextBlock();
	header1.text = "Alpha: " + camera.alpha;
	header1.height = "30px";
	header1.color = "white";
	panel.addControl(header1, 6, 0);
    
    var button1minus = BABYLON.GUI.Button.CreateSimpleButton("but1minus", "-1");
    button1minus.width = "50px"
    button1minus.height = "40px";
    button1minus.color = "white";
    button1minus.cornerRadius = 20;
    button1minus.background = "green";
    button1minus.onPointerUpObservable.add(function() {
		alphashift-=0.01;
		slider1.value=alphashift;
    });
    panel.addControl(button1minus, 6, 1);  
    	
    var slider1 = new BABYLON.GUI.Slider();
    slider1.minimum = -3.14;
    slider1.maximum = 3.14;
    slider1.value = 50;
    slider1.step = 0.01;
    slider1.height = "20px";
    slider1.width = "150px";
    slider1.onValueChangedObservable.add(function(value) {
		alphashift = value;
		header1.text = "Alpha: " + Math.round( alphashift * 1000 ) / 1000;
    });
    panel.addControl(slider1, 6, 2);    

    var button1plus = BABYLON.GUI.Button.CreateSimpleButton("but1plus", "+1");
    button1plus.width = "50px"
    button1plus.height = "40px";
    button1plus.color = "white";
    button1plus.cornerRadius = 20;
    button1plus.background = "green";
    button1plus.onPointerUpObservable.add(function() {
		alphashift+=0.1;
		slider1.value=alphashift;
    });    
    panel.addControl(button1plus, 6, 3);    


    
	var header2 = new BABYLON.GUI.TextBlock();
	header2.text = "Beta: " + camera.beta;
	header2.height = "30px";
	header2.color = "white";
	panel.addControl(header2, 7, 0);
    
    var button2minus = BABYLON.GUI.Button.CreateSimpleButton("but1minus", "-1");
    button2minus.width = "50px"
    button2minus.height = "40px";
    button2minus.color = "white";
    button2minus.cornerRadius = 20;
    button2minus.background = "green";
    button2minus.onPointerUpObservable.add(function() {
		camera.beta-=0.01;
		slider2.value=camera.beta;
    });
    panel.addControl(button2minus, 7, 1);  
    	
    var slider2 = new BABYLON.GUI.Slider();
    slider2.minimum = -3.14;
    slider2.maximum = 3.14;
    slider2.value = 50;
    slider2.step = 0.01;
    slider2.height = "20px";
    slider2.width = "150px";
    slider2.onValueChangedObservable.add(function(value) {
		header2.text = "Beta: " + Math.round( camera.beta * 1000 ) / 1000;
		camera.beta = value;
    });
    panel.addControl(slider2, 7, 2);    

    var button2plus = BABYLON.GUI.Button.CreateSimpleButton("but1plus", "+1");
    button2plus.width = "50px"
    button2plus.height = "40px";
    button2plus.color = "white";
    button2plus.cornerRadius = 20;
    button2plus.background = "green";
    button2plus.onPointerUpObservable.add(function() {
		camera.beta+=0.01;
		slider2.value=camera.beta;
    });    
    panel.addControl(button2plus, 7, 3);    

	var header3 = new BABYLON.GUI.TextBlock();
	header3.text = "Speed: " + speed;
	header3.height = "30px";
	header3.color = "white";
	panel.addControl(header3, 8, 0);
    
    var button3minus = BABYLON.GUI.Button.CreateSimpleButton("but1minus", "-1");
    button3minus.width = "50px"
    button3minus.height = "40px";
    button3minus.color = "white";
    button3minus.cornerRadius = 20;
    button3minus.background = "green";
    button3minus.onPointerUpObservable.add(function() {
		speed-=0.001;
		slider3.value=speed;
    });
    panel.addControl(button3minus, 8, 1);  
    	
    var slider3 = new BABYLON.GUI.Slider();
    slider3.minimum = -1;
    slider3.maximum = 1;
    slider3.value = 0;
    slider3.step = 0.001;
    slider3.height = "20px";
    slider3.width = "150px";
    slider3.onValueChangedObservable.add(function(value) {
		speed = value;
		header3.text = "Speed: " + speed;
    });
    panel.addControl(slider3, 8, 2);    

    var button3plus = BABYLON.GUI.Button.CreateSimpleButton("but1plus", "+1");
    button3plus.width = "50px"
    button3plus.height = "40px";
    button3plus.color = "white";
    button3plus.cornerRadius = 20;
    button3plus.background = "green";
    button3plus.onPointerUpObservable.add(function() {
		speed+=0.001;
		slider3.value=speed;
    });    
    panel.addControl(button3plus, 8, 3);    
    */

    return scene;
};

