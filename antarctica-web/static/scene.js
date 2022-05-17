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
var speed = -0.001;

var alphashift = 0.0;
var alphaoffset = 0.0;
var betashift = 0.0;

var csvLoaded = false;
var csvIndex = 1;
var recordIndex = 0;
var lines;
var records = [];
var fieldId;
var sectorMap = new Map();

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
  
  for(var i=1;i<lines.length;i++) {
		var line = lines[i];
		var fields = line.split('|');
		
		if(fields.length > 6) {
		
			var alpha = parseFloat(fields[6]);
			var hypotenuse = parseFloat(fields[5]) + 90;
		
			var pointX = Math.sin( Math.PI * alpha / 180 ) * hypotenuse * 1.8665;
			var pointY = Math.cos( Math.PI * alpha / 180 ) * hypotenuse * 1.8665;
			
			var sectorX = Math.floor(pointX/6);
			var sectorY = Math.floor(pointY/6);
			var sectorId = sectorX + ";" + sectorY;
			if(sectorMap.has(sectorId)) {
				var sectorCount = sectorMap.get(sectorId);
				sectorCount++;
				sectorMap.set(sectorId,sectorCount);
			} else {
				sectorMap.set(sectorId,1);
			}
			
			xmin = Math.min( pointX , xmin );
			ymin = Math.min( pointY , ymin );		
			xmax = Math.max( pointX , xmax );
			ymax = Math.max( pointY , ymax );

			fields.unshift(alpha,hypotenuse,pointX,pointY);
			records[i-1]=fields;
			
			//console.log("scanning point " + i + " x " + pointX + " y "+ pointY + " x min " + xmin + " max " + xmax + " y min " + ymin + " max " + ymax );
		}
  }
  
  console.log("scanned csv records " + lines.length + " x min " + xmin + " max " + xmax + " y min " + ymin + " max " + ymax );
  var sectorEntryCount = 0;
  for (const [key, value] of sectorMap) {
		console.log(key + ' = ' + value)
		sectorEntryCount += value;
  }  
  console.log("populated sectors " + sectorMap.size + " total entries " + sectorEntryCount );
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
	camera.position.y += betashift;
	camera.target.y += betashift;
	
	//console.log("camera.position.y " + camera.position.y + " beta " + camera.beta + " diff " + ( camera.beta - Math.PI / 2 ) ); 
	//console.log("distance " + distance + " alphashift " + alphashift ); 
	
	if(csvLoaded == true && csvIndex < records.length) {
		
		var fields = records[csvIndex];
		
		statusPanel.text = "loading: " + csvIndex + " "  + fields[5] + " angel: " + Math.round(angel*100)/100  + " distance: " + distance + " height: " + camera.target.y;
		//if( csvIndex%100==0 ) console.log( "- new record: " + csvIndex + " "  + fields[1] + " x: " + pointX + " y: " + pointY  + " xmin: " + xmin + " ymin: " + ymin   + " xmax: " + xmax + " ymax: " + ymax );

		if (fields.length > 8) {
						
			var sHeight = 0.015;
			
			if( fields[6] == "Summit"  ) {
				
				if( fields[14].includes(" m,") ) {
					var words = fields[14].split(" m,");
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
			if( fields[6] == "Summit"  ) {
				sphere = BABYLON.MeshBuilder.CreateCylinder("box", {width:0.05,height:sHeight,depth:0.05, diameterTop: 0, diameterBottom: 0.15, tessellation: 4}, scene);    
			} else {
				sphere = BABYLON.MeshBuilder.CreateBox("box", {width:0.05,height:sHeight,depth:0.05}, scene);    
			}
			sphere.position.x = fields[2];
			sphere.position.z = fields[3];
			sphere.position.y = sHeight / 2;

			
			/*
			var base = BABYLON.MeshBuilder.CreateBox("box", {width:0.07,height:0.02,depth:0.07}, scene);    
			base.position.x = fields[2];
			base.position.z = fields[3];
			
			if( (alpha + 180) % 40 > 20 ) {
				sphere.material = mRed;
				//base.material = mRed;
			} else {
				sphere.material = mWhite;
				//base.material = mWhite;
			}

			
			if( fields[6] == "Building"  ) {
				sphere.material = mRed;
			} else if( fields[6] == "Island"  ) {
				sphere.material = mYellow;
			} else if( fields[6] == "Area"  ) {
				sphere.material = mCyan;
			} else if( fields[6] == "Glacier"  ) {
				sphere.material = mCyan;
			} else if( fields[6] == "Valley"  ) {
				sphere.material = mCyan;
			} else if( fields[6] == "Cape"  ) {
				sphere.material = mCyan;
			} else if( fields[6] == "Basin"  ) {
				sphere.material = mCyan;
			} else if( fields[6] == "Ridge"  ) {
				sphere.material = mGreen;
			} else if( fields[6] == "Range"  ) {
				sphere.material = mGreen;
			} else if( fields[6] == "Bay"  ) {
				sphere.material = mBlue;
			} else if( fields[6] == "Stream"  ) {
				sphere.material = mBlue;
			} else if( fields[6] == "Lake"  ) {
				sphere.material = mBlue;
			} else if( fields[6] == "Gap"  ) {
				sphere.material = mBlue;
			} else if( fields[6] == "Channel"  ) {
				sphere.material = mBlue;
			} else if( fields[6] == "Cliff"  ) {
				sphere.material = mMagenta;
			} else if( fields[6] == "Summit"  ) {
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
						infoPanel.text = fields[5] + "\n" + fields[6] + "\n" + fields[13] + "\n" + fields[14];
						selectedSpot.position.x = fields[2];
						selectedSpot.position.z = fields[3];
						recordIndex = csvIndex;
						triggerNewSound();
					 }
				)
			);

			//spheres[csvIndex] = sphere;

		}
		csvIndex++;		
	 } else {
		statusPanel.text = "- loaded: " + csvIndex + " angel: " + Math.round(angel*100)/100  + " distance: " + distance + " height: " + camera.target.y;		 
	 }
	 
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
camera.target.y = 0.7;
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
