// Best of both worlds - Kante

var camera;
var canvas = document.getElementById("renderCanvas"); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
var scene = new BABYLON.Scene(engine);

var spheres = [];
var sp=0;

var selectedSpot;

var angel = 0;
var distance = 10;
var speed = -0.02;

var alphashift = 0.0;
var alphaoffset = 0.0;
var betashift = 0.0;

var csvLoaded = false;
var csvIndex = 0;
var lines;
var fieldId;

var infoPanel;
var statusPanel;

var xmin=0;
var ymin=0;
var xmax=-1000;
var ymax=-1000;

var mCyan = new BABYLON.StandardMaterial("m1", scene);
mCyan.diffuseColor = new BABYLON.Color3(0, 1, 1);

var mMagenta = new BABYLON.StandardMaterial("m2", scene);
mMagenta.diffuseColor = new BABYLON.Color3(1, 0, 1);

var mYellow = new BABYLON.StandardMaterial("m3", scene);
mYellow.diffuseColor = new BABYLON.Color3(1, 1, 0);

var mRed = new BABYLON.StandardMaterial("m4", scene);
mRed.diffuseColor = new BABYLON.Color3(1, 0, 0);

var mGreen = new BABYLON.StandardMaterial("m5", scene);
mGreen.diffuseColor = new BABYLON.Color3(0, 1, 0);

var mBlue = new BABYLON.StandardMaterial("m6", scene);
mBlue.diffuseColor = new BABYLON.Color3(0, 0, 1);

var mWhite = new BABYLON.StandardMaterial("m7", scene);
mWhite.diffuseColor = new BABYLON.Color3(1, 1, 1);

var mGray = new BABYLON.StandardMaterial("m8", scene);
mGray.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);


// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
		engine.resize();
});

function createButton(id,name) {
    var button = BABYLON.GUI.Button.CreateSimpleButton(id, name);
    button.width = "150px"
    button.height = "40px";
    button.color = "white";
    button.cornerRadius = 20;
    button.background = "green";
    return button;
}

function processCsv(csv) {
		
  csv = csv.replace(/\r/g, '');
  lines = csv.split('\n');
  fieldId = lines[0].split(';');
  
  csvLoaded = true;
}

function addNextPoint() {
	angel+=speed;
	
	distance += alphashift * -0.01; 
	
	camera.position.x = 0;//Math.sin(angel)*distance;
	camera.target.x = Math.sin(angel)*distance;
	camera.position.z = 0;//Math.cos(angel)*distance;
	camera.target.z = Math.cos(angel)*distance;
	camera.alpha=angel*-1 + alphaoffset;
	//camera.beta=Math.PI / 2 + betashift;
		
	/*
	console.log("camera.position.y " + camera.position.y + " beta " + camera.beta + " diff " + ( camera.beta - Math.PI / 2 ) ); 
	if(camera.position.y > 1.1 || camera.position.y < -1.1 ) {
		console.log("direction change");
		camera.beta = ( (camera.beta - Math.PI / 2) * -1 ) + Math.PI / 2;
		camera.position.y += camera.beta - Math.PI / 2;
		camera.target.y += camera.beta - Math.PI / 2;
	console.log("camera.position.y " + camera.position.y + " beta " + camera.beta + " diff " + ( camera.beta - Math.PI / 2 ) ); 
	}
	if(camera.position.y > 1.1  || camera.position.y < -1.1 ) {
		camera.beta=Math.PI/2;
	}
	*/
	
	camera.position.y += betashift;
	camera.target.y += betashift;

	
	//console.log("camera.position.y " + camera.position.y + " beta " + camera.beta + " diff " + ( camera.beta - Math.PI / 2 ) ); 
	//console.log("distance " + distance + " alphashift " + alphashift ); 
	
	if(csvLoaded == true && csvIndex < lines.length) {
		var line = lines[csvIndex];

		var fields = line.split('|');
		
		var alpha = parseFloat(fields[6]);
		var hypotenuse = parseFloat(fields[5]) + 90;
	
		var pointX = Math.sin( Math.PI * alpha / 180 ) * hypotenuse * 1.865;
		var pointY = Math.cos( Math.PI * alpha / 180 ) * hypotenuse * 1.865;
		
		xmin = Math.min( pointX , xmin );
		ymin = Math.min( pointY , ymin );		
		xmax = Math.max( pointX , xmax );
		ymax = Math.max( pointY , ymax );
		
		var camposx = xmin + (xmax-xmin) / 2;
		var camposy = ymin + (ymax-ymin) / 2;
		
		statusPanel.text = "loading: " + csvIndex + " "  + fields[1] + " angel: " + Math.round(angel*100)/100  + " distance: " + distance + " height: " + camera.target.y;
		//if( csvIndex%100==0 ) console.log( "- new record: " + csvIndex + " "  + fields[1] + " x: " + pointX + " y: " + pointY  + " xmin: " + xmin + " ymin: " + ymin   + " xmax: " + xmax + " ymax: " + ymax );

		if (fields.length > 8) {
						
			var sHeight = 0.015;
			
			if( fields[2] == "Summit"  ) {
				
				if( fields[10].includes(" m,") ) {
					var words = fields[10].split(" m,");
					var number = words[0].substring(words[0].length-5);
					
					if(number.charAt(1)==",") {
						number=number.replace(",",number.charAt(0));
						number=number.substring(number.length-4);
					} else {
						number=number.substring(number.length-3);
					}
					
					//console.log( "have height " + number + " " + parseInt(number) );
					sHeight = parseInt(number) / 6000;
				}
				
			}
						

			var sphere;
			if( fields[2] == "Summit"  ) {
				sphere = BABYLON.MeshBuilder.CreateCylinder("box", {width:0.05,height:sHeight,depth:0.05, diameterTop: 0, diameterBottom: 0.15, tessellation: 4}, scene);    
			} else {
				sphere = BABYLON.MeshBuilder.CreateBox("box", {width:0.05,height:sHeight,depth:0.05}, scene);    
			}
			sphere.position.x = pointX;
			sphere.position.z = pointY;
			sphere.position.y = sHeight / 2;

			
			/*
			var base = BABYLON.MeshBuilder.CreateBox("box", {width:0.07,height:0.02,depth:0.07}, scene);    
			base.position.x = pointX;
			base.position.z = pointY;
			
			if( (alpha + 180) % 40 > 20 ) {
				sphere.material = mRed;
				//base.material = mRed;
			} else {
				sphere.material = mWhite;
				//base.material = mWhite;
			}

			
			if( fields[2] == "Building"  ) {
				sphere.material = mRed;
			} else if( fields[2] == "Island"  ) {
				sphere.material = mYellow;
			} else if( fields[2] == "Area"  ) {
				sphere.material = mCyan;
			} else if( fields[2] == "Glacier"  ) {
				sphere.material = mCyan;
			} else if( fields[2] == "Valley"  ) {
				sphere.material = mCyan;
			} else if( fields[2] == "Cape"  ) {
				sphere.material = mCyan;
			} else if( fields[2] == "Basin"  ) {
				sphere.material = mCyan;
			} else if( fields[2] == "Ridge"  ) {
				sphere.material = mGreen;
			} else if( fields[2] == "Range"  ) {
				sphere.material = mGreen;
			} else if( fields[2] == "Bay"  ) {
				sphere.material = mBlue;
			} else if( fields[2] == "Stream"  ) {
				sphere.material = mBlue;
			} else if( fields[2] == "Lake"  ) {
				sphere.material = mBlue;
			} else if( fields[2] == "Gap"  ) {
				sphere.material = mBlue;
			} else if( fields[2] == "Channel"  ) {
				sphere.material = mBlue;
			} else if( fields[2] == "Cliff"  ) {
				sphere.material = mMagenta;
			} else if( fields[2] == "Summit"  ) {
				sphere.material = mWhite;				
			} else {
				sphere.material = mGray;
			}
			*/

			sphere.material = mRed;
				

			sphere.actionManager = new BABYLON.ActionManager(scene);
			
			sphere.actionManager.registerAction(
				new BABYLON.ExecuteCodeAction(
					{
						trigger: BABYLON.ActionManager.OnPickTrigger
					},
					function (event) { 
						//console.log("set cam to x:" + event.source.position.x + " y: " + event.source.position.y + " " + fields[1] + fields[9] + fields[10] );						
						infoPanel.text = fields[1] + "\n" + fields[2] + "\n" + fields[9] + "\n" + fields[10];
						selectedSpot.position.x = pointX;
						selectedSpot.position.z = pointY;
						triggerNewSound();
					 }
				)
			);

			//spheres[csvIndex] = sphere;

			/*
			var plane = BABYLON.Mesh.CreatePlane("plane", 1 );
			plane.parent = sphere;
			plane.position.x = 50;
			plane.position.y = 5;

			var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);

			var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", fields[1]);
			button1.width = 100;
			button1.height = 10;
			button1.color = "white";
			button1.fontSize = 50;
			button1.background = "transparent";
			button1.onPointerUpObservable.add(function() {
				alert("you did it!");
			});
			advancedTexture.addControl(button1);
			*/
			
//			camera.target.x = camposx;
//			camera.target.y = camposy;
//			camera.target.z = 100;
//			camera.position.x = camposx;
//			camera.position.y = camposy;
//			camera.position.z = 600;
		}
		csvIndex++;		
	 } else {
		statusPanel.text = "- loaded: " + csvIndex + " angel: " + Math.round(angel*100)/100  + " distance: " + distance + " height: " + camera.target.y;		 
	 }
	 
}

var pointActions = function() {

		/*
		console.log("have sphere at x: " + parseFloat(fields[6]) + " y: " + parseFloat(fields[5]) + " ar int x: " + parseInt(fields[6]) + " y: " + parseInt(fields[5]) );
		sphere.actionManager = new BABYLON.ActionManager(scene);
		
		sphere.actionManager.registerAction(
			new BABYLON.ExecuteCodeAction(
				{
					trigger: BABYLON.ActionManager.OnPickTrigger
				},
				function (event) { 
					console.log("set cam to x:" + event.source.position.x + " y: " + event.source.position.y);
					camera.setPosition( new BABYLON.Vector3(event.source.position.x,event.source.position.y,50) );

					camera.position.x=event.source.position.x;
					camera.position.y=event.source.position.y;
					camera.position.z=50;

					camera.target.x=event.source.position.x;
					camera.target.y=event.source.position.y;
					camera.target.z=0;
				 }
			)
		);
		*/
		
					
		/*
		var oReq = new XMLHttpRequest();
		oReq.sphere = sphere;
		oReq.addEventListener("load", function() {
			var music1 = new BABYLON.Sound(
			  "track1",
			  this.responseText,
			  scene,
			  function() {
				console.log("music 1 ready... play");
				console.log("music 1 class: " + music1.getClassName() );
				console.log("music 1 gain: " + music1.getSoundGain() );
				console.log("music 1 audio buffer: " + music1.getAudioBuffer() );
				console.log("music 1 time: " + music1.currentTime );
				
			  },
			  { loop: true, autoplay: true }
			);
			
			console.log("loading sound:"+this.responseText);
			
			music1.distanceModel="exponential";
			music1.rolloffFactor=1;
			/*
			music1.refDistance=10;
			music1.distanceModel="linear";
			music1.maxDistance=10;

			music1.attachToMesh( spheres[sp++] );
			
			console.log("attaching sound:"+this.responseText);
		});
		
		var getUrl = window.location;
		var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" ; //+ getUrl.pathname.split('/')[1];		
		
		console.log("getUrl " + getUrl + " " + baseUrl);
		oReq.open("GET", baseUrl + "newclip?id="+Date.now()+"&clipId="+i+"&tempo=60");
		oReq.send();
			*/
		

	/*
		sphere.actionManager.registerAction(
			new BABYLON.SetValueAction(
				BABYLON.ActionManager.OnPickTrigger, 
				sphere, 
				"scaling", 
				new BABYLON.Vector3( 1.2, 1.2, 1.2 )
			)
		);

		sphere.actionManager.registerAction(
			new BABYLON.SetValueAction(
				BABYLON.ActionManager.OnPickTrigger, 
				camera, 
				"target", 
				new BABYLON.Vector3(2,2,0)
	//			new BABYLON.Vector3(parseInt(fields[8]),parseInt(fields[7]),0)
			)
		);
		
		sphere.actionManager.registerAction(
			new BABYLON.SetValueAction(
				BABYLON.ActionManager.OnPickTrigger, 
				camera, 
				"position", 
				new BABYLON.Vector3(2,2,50)
	//			new BABYLON.Vector3(parseInt(fields[8]),parseInt(fields[7]),50)
			)
		);	
	*/

		
	//		  console.log("[" + fields[0] + ","  + fields[1] + ","  + fields[2] + "," + fields[7] + "," + fields[8] + "],");
			
			/*
		  for (var j = 0; j < fields.length && j < fieldId.length; j++) {
			  console.log(" field "+ fieldId[j] + " value "+fields[j]);
	//		var fieldValue = fields[j].replace(/#/g, prefix);
	//		option[fieldId[j]] = fieldValue;
		  }
		  */
	//	  destination.push(option);

}

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", function() {
	processCsv(this.responseText);	
	console.log("processed csv");
});

var createScene = function () {

	console.log("createScene");
	
    // Add lights to the scene
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

    // The south pole
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:2}, scene);
	var mat = new BABYLON.StandardMaterial("mat", scene);
	mat.diffuseColor = BABYLON.Color3.Blue();
	mat.alpha = 0.5;
	sphere.material=mat;

    // The selected spot
    selectedSpot = BABYLON.MeshBuilder.CreateSphere("selectedSpot", {diameter:0.5}, scene);
	var mat2 = new BABYLON.StandardMaterial("mat2", scene);
	mat2.diffuseColor = BABYLON.Color3.Green();
	mat2.alpha = 0.5;
	selectedSpot.material=mat2;

	var soundTrack1 = new BABYLON.SoundTrack(scene);
	
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
       
	createAudioAnalyser(scene);
	createSound(scene,panel);
	createCamSliders(scene,panel);

	var advancedTexture2 = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    
	var panel2 = new BABYLON.GUI.Grid();
    panel2.addColumnDefinition(0.8);
    panel2.addColumnDefinition(0.2);
    panel2.addRowDefinition(1);
	
	infoPanel = new BABYLON.GUI.TextBlock();
	infoPanel.text = "--- Hello Antarctica ---";
	infoPanel.textWrapping=true;
	infoPanel.textVerticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
	//infoPanel.width = "500px";
	//infoPanel.height = "500px";
	infoPanel.color = "white";
	panel2.addControl(infoPanel, 0, 1);
	
	statusPanel = new BABYLON.GUI.TextBlock();
	statusPanel.text = "--- loading ---";
	statusPanel.textWrapping=true;
	statusPanel.textVerticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
	//statusPanel.width = "500px";
	//statusPanel.height = "500px";
	statusPanel.color = "white";
	panel2.addControl(statusPanel, 1, 1);
	
	advancedTexture2.addControl(panel2);


    const env = scene.createDefaultEnvironment();

    var skybox = BABYLON.Mesh.CreateBox("BackgroundSkybox", 100, scene, undefined, BABYLON.Mesh.BACKSIDE);
    skybox.position.y=50;
    
    // Create and tweak the background material.
    var backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", scene);
    backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene);
    backgroundMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skybox.material = backgroundMaterial;

/*
    const xr = scene.createDefaultXRExperienceAsync({
        floorMeshes: [env.ground]
    });
*/			
};


camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,50), scene);

// 0.0637
// 0.1637
// 0.00637
//camera = new BABYLON.StereoscopicArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,50), 0.00137, 1, scene);
camera.target.x = 0;
camera.target.y = 0;
camera.target.z = 0;

createScene(); //Call the createScene function

//scene.registerBeforeRender( addNextPoint() );

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
	scene.render();
});


oReq.open("GET", "AntarcticNames.csv");
oReq.send();

window.setInterval( addNextPoint, 100 );
