// Best of both worlds - Kante

var camera;
var canvas = document.getElementById("renderCanvas"); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
var scene = new BABYLON.Scene(engine);

var state = 'select';
var playingTrack = '';
var loopPlay = false;

var infoPanel;
var statusPanel;
var statusPanel2;
var ratePanel;
var replayPanel;
var playControlPanel;
var soundPanel;

var playButton;

var spheres = [];
var sp=0;

var selectedSpot;

var angel = 0;
var distance = 5;
var speed = -0.001;

var alphashift = 0.0;
var alphaoffset = 0.0;
var betashift = 0.0;

var cameraDeltaX = 0;
var cameraDeltaZ = 0;
var cameraDeltaRadius = 0;
var cameraDeltaSteps = 0;

var csvLoaded = false;
var csvIndex = 1;
var recordIndex = 0;
var selectedRecord;
var lines;
var records = [];
var fieldId;
var sectorCountMap = new Map();
var pointLoadedMap = new Map();
var homePonits = [];

var xmin=0;
var ymin=0;
var xmax=-1000;
var ymax=-1000;

var mCyan = new BABYLON.StandardMaterial("m1", scene);
mCyan.diffuseColor = new BABYLON.Color3(0, 1, 1);
mCyan.freeze();

var mMagenta = new BABYLON.StandardMaterial("m2", scene);
mMagenta.diffuseColor = new BABYLON.Color3(1, 0, 1);
mMagenta.freeze();

var mYellow = new BABYLON.StandardMaterial("m3", scene);
mYellow.diffuseColor = new BABYLON.Color3(1, 1, 0);
mYellow.alpha = 0.5;
mYellow.freeze();

var mRed = new BABYLON.StandardMaterial("m4", scene);
mRed.diffuseColor = new BABYLON.Color3(1, 0, 0);
mRed.alpha = 0.5;
mRed.freeze();

var mGreen = new BABYLON.StandardMaterial("m5", scene);
mGreen.diffuseColor = new BABYLON.Color3(0, 1, 0);
mGreen.freeze();

var mBlue = new BABYLON.StandardMaterial("m6", scene);
mBlue.diffuseColor = new BABYLON.Color3(0, 0, 1);
mBlue.freeze();

var mWhite = new BABYLON.StandardMaterial("m7", scene);
mWhite.diffuseColor = new BABYLON.Color3(1, 1, 1);
mWhite.freeze();

var mGray = new BABYLON.StandardMaterial("m8", scene);
mGray.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
mGray.freeze();


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
  createSectorMap();
  filterCsv("Airport");
  filterCsv("Building");
}

function createSectorMap() {		
  for(var i=1;i<lines.length;i++) {
		var line = lines[i];
		var fields = line.split('|');
		
		if(fields.length > 6) {
		
			var alpha = parseFloat(fields[6]);
			var hypotenuse = parseFloat(fields[5]) + 90;
		
			var pointX = Math.sin( Math.PI * alpha / 180 ) * hypotenuse * 1.8667;
			var pointY = Math.cos( Math.PI * alpha / 180 ) * hypotenuse * 1.8667;
			
			var sectorX = Math.floor(pointX/2);
			var sectorY = Math.floor(pointY/2);
			var sectorId = sectorX + "_" + sectorY;
			if(sectorCountMap.has(sectorId)) {
				var sectorCount = sectorCountMap.get(sectorId);
				sectorCount++;
				sectorCountMap.set(sectorId,sectorCount);
			} else {
				sectorCountMap.set(sectorId,1);
			}			
			
			pointLoadedMap.set(fields[0],0);
		}
  }
  
  var sectorEntryCount = 0;
  for (const [key, value] of sectorCountMap) {
		//console.log(key + ' = ' + value)
		sectorEntryCount += value;
  }  
  console.log("populated sectors " + sectorCountMap.size + " total entries " + sectorEntryCount );
  csvLoaded = true;
}
  
function filterCsv(filter) {		
  //console.log("filterCsv "+filter);
  var addedRecords=0;
  
  for(var i=1;i<lines.length;i++) {
		var line = lines[i];
		var fields = line.split('|');
		
		if(fields.length > 6) {
		
			var alpha = parseFloat(fields[6]);
			var hypotenuse = parseFloat(fields[5]) + 90;
		
			var pointX = Math.sin( Math.PI * alpha / 180 ) * hypotenuse * 1.8667;
			var pointY = Math.cos( Math.PI * alpha / 180 ) * hypotenuse * 1.8667;
			
			var sectorX = Math.floor(pointX/2);
			var sectorY = Math.floor(pointY/2);
			var sectorId = sectorX + "_" + sectorY;
			
			xmin = Math.min( pointX , xmin );
			ymin = Math.min( pointY , ymin );		
			xmax = Math.max( pointX , xmax );
			ymax = Math.max( pointY , ymax );
			
			fields.unshift(alpha,hypotenuse,pointX,pointY,sectorId);
			
			if(pointLoadedMap.get(fields[5])==0) {				
				if(filter.includes("_")) {
					if(sectorId==filter) {
						records.push(fields);
						pointLoadedMap.set(fields[5],1);
						addedRecords++;
					}				
				} else if(filter!="") {
					if(fields[7] == filter) {
						records.push(fields);
						pointLoadedMap.set(fields[5],1);
						addedRecords++;
					}
				}
			}
			
			//console.log("scanning point " + i + " x " + pointX + " y "+ pointY + " x min " + xmin + " max " + xmax + " y min " + ymin + " max " + ymax );
		}
  }  
  //console.log("filtered csv records " + lines.length + " x min " + xmin + " max " + xmax + " y min " + ymin + " max " + ymax );
  //console.log("added "+addedRecords);

}

function resizeHomePoints(d) {
	homePonits.forEach(element => {
		//console.log(" resize " + element + " to " + d + " orig " + element.diameter );
		element.scaling = new BABYLON.Vector3(d,d,d);
	});
}

function updateScene() {
	if(state=='rate') {
		statusPanel2.text = "rate spot nr: " + selectedRecord[5] + " " + selectedRecord[6];
	} else if(state=='rated') {
		statusPanel2.text = "rated spot nr: " + selectedRecord[5] + " " + selectedRecord[6];
	} else if(state=='loading') {
		statusPanel2.text = " loading spot nr: " + selectedRecord[5] + " " + selectedRecord[6];
	} else if(state=='server error') {
		statusPanel2.text = " server error !!! spot nr: " + selectedRecord[5] + " " + selectedRecord[6];
	} else if(music1!=undefined) {
		var t = Math.round( music1.currentTime );
		var tsec = t % 60;
		var tmin = Math.floor( t / 60 );
		if(music1.getAudioBuffer()!=undefined) {
			var d = Math.round( music1.getAudioBuffer().duration );
			var dsec = d % 60;
			var dmin = Math.floor( d / 60 );		
			statusPanel2.text  = state + " " + tmin + ":" + tsec + " (" + dmin + ":" + dsec + ") | spot nr: " + selectedRecord[5] + " " + selectedRecord[6] + " ( " + playingTrack + ")";
		}
	}
	
	resizeHomePoints(camera.radius * 0.02);
	var d=camera.radius * 0.1;
	selectedSpot.scaling = new BABYLON.Vector3(d,d,d);
	
	if(camera.target.x!=selectedSpot.position.x || camera.target.z!=selectedSpot.position.z) {
		if(cameraDeltaX==0) {
			cameraDeltaX = (selectedSpot.position.x - camera.target.x)/200;
			cameraDeltaZ = (selectedSpot.position.z - camera.target.z)/200;
			cameraDeltaRadius = (2 - camera.radius)/200;
			cameraDeltaSteps = 200;
		}
	}
	
	if(cameraDeltaSteps>0) {		
		camera.target.x+=cameraDeltaX;
		camera.target.z+=cameraDeltaZ;
		camera.radius+=cameraDeltaRadius;
		cameraDeltaSteps--;
	} else {
		camera.target.x = selectedSpot.position.x;
		camera.target.z = selectedSpot.position.z;
		cameraDeltaX=0;
		cameraDeltaZ=0;
	}
	
	camera.alpha+=0.00005;
}


var requestFiles = function( spotId ) {
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", function() {
		if(this.response.includes("Error")) {
			infoPanel.text += "\n\nFiles: 0";
			randomSound();
			triggerNewSound(spotId);
		} else {
			var files=this.response.split('\n');
			infoPanel.text += "\n\nFiles: " + files.length;
			playTrack("loops/"+files[0]);
			console.log("got file response " + this.response );
		}
	});
	
	var getUrl = window.location;
	var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" ;
	console.log("request files for spot " + spotId);
	
	oReq.open("GET", baseUrl + "files?spotId="+spotId);
	oReq.send();	
}

function addNextPoint() {
	
	//console.log("selectedSpot.position.x " + selectedSpot.position.x + " camera.target.x " + camera.target.x + " cameraDeltaX " + cameraDeltaX ); 
	//console.log("selectedSpot.position.z " + selectedSpot.position.z + " camera.target.z " + camera.target.z + " cameraDeltaZ " + cameraDeltaZ ); 
	//console.log("camera.position.y " + camera.position.y + " beta " + camera.beta + " diff " + ( camera.beta - Math.PI / 2 ) ); 
	//console.log("distance " + distance + " alphashift " + alphashift ); 
	
	if(csvLoaded == true && csvIndex < records.length) {
		var fields = records[csvIndex];		
				
		statusPanel.text = csvIndex + " ("  + records.length  + ") "  + fields[6] + " loading ...";

		if (fields.length > 8) {
						
			var sHeight = 0.05;
			
			if( fields[7] == "Summit"  ) {
				
				if( fields[15].includes(" m,") ) {
					var words = fields[15].split(" m,");
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
			
			var sectorX = Math.floor(fields[2]/2);
			var sectorY = Math.floor(fields[3]/2);
			var sectorId = sectorX + "_" + sectorY;			
			var sWidth = 0.01 + ( 400 - sectorCountMap.get(sectorId) ) / 10000;
			//console.log("sWidth " + sWidth + " sectorId " + sectorId + " count " + sectorCountMap.get(sectorId) );
			
			if( fields[7] == "Summit"  ) {
				sphere = BABYLON.MeshBuilder.CreateCylinder("box", {width:sWidth,height:sHeight,depth:sWidth, diameterTop: 0, diameterBottom: sWidth, tessellation: 4}, scene);    
			} else if( fields[7] == "Building" ) {
				sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:1}, scene);    
				homePonits.push(sphere);
			} else if( fields[7] == "Airport" ){
				sphere = BABYLON.MeshBuilder.CreateBox("box", {width:0.8,height:0.4,depth:2}, scene);    
				homePonits.push(sphere);
			} else {
				//sphere = BABYLON.MeshBuilder.CreateBox("box", {width:sWidth,height:sHeight,depth:sWidth}, scene);    
				sphere = BABYLON.MeshBuilder.CreateCylinder("box", {width:sWidth,height:sHeight,depth:sWidth, diameterTop: 0, diameterBottom: sWidth, tessellation: 4}, scene);    
			}
			sphere.position.x = fields[2];
			sphere.position.z = fields[3];
			sphere.position.y = sHeight / 2;

			if( fields[7] == "Building"  ) {
				sphere.material = mRed;
			} else if( fields[7] == "Airport"  ) {
				sphere.material = mYellow;
			} else if( fields[7] == "Island"  ) {
				sphere.material = mYellow;
			} else if( fields[7] == "Area"  ) {
				sphere.material = mCyan;
			} else if( fields[7] == "Glacier"  ) {
				sphere.material = mCyan;
			} else if( fields[7] == "Valley"  ) {
				sphere.material = mCyan;
			} else if( fields[7] == "Cape"  ) {
				sphere.material = mCyan;
			} else if( fields[7] == "Basin"  ) {
				sphere.material = mCyan;
			} else if( fields[7] == "Ridge"  ) {
				sphere.material = mGreen;
			} else if( fields[7] == "Range"  ) {
				sphere.material = mGreen;
			} else if( fields[7] == "Bay"  ) {
				sphere.material = mBlue;
			} else if( fields[7] == "Stream"  ) {
				sphere.material = mBlue;
			} else if( fields[7] == "Lake"  ) {
				sphere.material = mBlue;
			} else if( fields[7] == "Gap"  ) {
				sphere.material = mBlue;
			} else if( fields[7] == "Channel"  ) {
				sphere.material = mBlue;
			} else if( fields[7] == "Cliff"  ) {
				sphere.material = mMagenta;
			} else if( fields[7] == "Summit"  ) {
				sphere.material = mWhite;				
			} else {
				sphere.material = mGreen;
			}

			sphere.actionManager = new BABYLON.ActionManager(scene);
			
			sphere.actionManager.registerAction(
				new BABYLON.ExecuteCodeAction(
					{
						trigger: BABYLON.ActionManager.OnPickTrigger
					},
					function (event) { 
						//console.log("set cam to x:" + event.source.position.x + " y: " + event.source.position.y + " " + fields[1] + fields[9] + fields[10] );						
						infoPanel.text = "spot nr. " + fields[5] + "\n" + fields[6] + "\n" + fields[7] + "\n" + fields[14] + "\n" + fields[15];
						selectedSpot.position.x = fields[2];
						selectedSpot.position.z = fields[3];
						recordIndex = csvIndex;
						selectedRecord = fields;
						requestFiles(fields[4] + '_' + fields[5]);
						
						// filter current sector
						filterCsv(fields[4]);	
						
						// filter neighbour sectors					
						var sectorId = fields[4].split('_');
						var northSector=parseInt(sectorId[0])+1;
						var southSector=parseInt(sectorId[0])-1;
						var eastSector=parseInt(sectorId[1])+1;
						var westSector=parseInt(sectorId[1])-1;

						filterCsv(northSector+"_"+sectorId[1]);
						filterCsv(southSector+"_"+sectorId[1]);
						filterCsv(sectorId[0]+"_"+eastSector);
						filterCsv(sectorId[0]+"_"+westSector);
											
//						randomSound();
//						triggerNewSound(fields[4]+"_"+fields[5]);
						
						if(ratePanel!=undefined) ratePanel.isVisible=false;
						state='loading';
					 }
				)
			);					
			csvIndex++;
		}
	 } else {
		statusPanel.text = "loaded " + csvIndex + " spots";		 
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
    //var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:2}, scene);
	//var mat = new BABYLON.StandardMaterial("mat", scene);
	//mat.diffuseColor = BABYLON.Color3.Blue();
	//mat.alpha = 0.5;
	//sphere.material=mat;

    // The selected spot
    selectedSpot = BABYLON.MeshBuilder.CreateSphere("selectedSpot", {diameter:0.5}, scene);
	var mat2 = new BABYLON.StandardMaterial("mat2", scene);
	mat2.diffuseColor = BABYLON.Color3.Green();
	mat2.alpha = 0.5;
	mat2.freeze();
	
	selectedSpot.material=mat2;
	       
	createSoundTrack(scene);
	//createAudioAnalyser(scene);
	
	//soundPanel = createSoundPanel();
	//createCamSliders(panel);
	
	ratePanel=createRatePanel();
	ratePanel.isVisible=false;
	
	replayPanel=createReplayPanel();
	replayPanel.isVisible=false;
	
	playControlPanel=createPlayControlPanel();
	playControlPanel.isVisible=false;

	var advancedTexture2 = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    
	var panel2 = new BABYLON.GUI.Grid();
    panel2.addColumnDefinition(0.8);
    panel2.addColumnDefinition(0.2);
    panel2.addRowDefinition(1);
	
	infoPanel = new BABYLON.GUI.TextBlock();
	infoPanel.text = "--- Hello Antarctica ---";
	infoPanel.textWrapping=true;
	infoPanel.textVerticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
	//infoPanel.fontSize=10;
	infoPanel.color = "white";
	panel2.addControl(infoPanel, 0, 1);
	
	statusPanel = new BABYLON.GUI.TextBlock();
	statusPanel.text = "--- loading ---";
	statusPanel.textWrapping=true;
	statusPanel.textVerticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
	statusPanel.color = "white";
	panel2.addControl(statusPanel, 1, 1);
	
	statusPanel2 = new BABYLON.GUI.TextBlock();
	statusPanel2.text = "Please select objects to load sound.";
	statusPanel2.textWrapping=true;
	//statusPanel2.fontSize=10;
	statusPanel2.textVerticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
	statusPanel2.color = "white";
	panel2.addControl(statusPanel2, 1, 0);
	
	advancedTexture2.addControl(panel2);


    const env = scene.createDefaultEnvironment();

    var skybox = BABYLON.Mesh.CreateBox("BackgroundSkybox", 100, scene, undefined, BABYLON.Mesh.BACKSIDE);
    skybox.position.y=50;
    
    // Create and tweak the background material.
    var backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", scene);
    backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene);
    backgroundMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    backgroundMaterial.freeze();
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
camera.target.y = 0.3;
camera.target.z = 0;
camera.radius=50;
camera.beta=0;

//console.log("angularSensibilityX " + camera.angularSensibilityX + " camera.angularSensibilityY " + camera.angularSensibilityY + " camera.panningSensibility " + camera.panningSensibility);
//console.log("camera.minZ " + camera.minZ + " camera.maxZ " + camera.maxZ );

camera.upperRadiusLimit=60;
camera.lowerRadiusLimit=2;
camera.lowerBetaLimit=0;
camera.upperBetaLimit=Math.PI/2;
camera.angularSensibilityX=1000;
camera.angularSensibilityY=1000;
camera.panningSensibility=1000;
camera.wheelDeltaPercentage=0.01;
camera.wheelPresision=0.01;
//camera.pinchDeltaPercentage=0.001;
//camera.pinchPresision=0.01;
camera.useNaturalPinchZoom=true;

camera.attachControl(canvas, true);

createScene(); //Call the createScene function

scene.registerBeforeRender( updateScene );

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
	scene.render();
});


oReq.open("GET", "AntarcticNames.csv");
oReq.send();

window.setInterval( addNextPoint, 10 );
