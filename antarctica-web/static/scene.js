
// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
	engine.resize();
});

function name2Id(name) {
	var fields=name.split("_");
	var id="";
	if(fields.length>2) id=fields[2];
	return id;
}

function filename2TrackId(filename) {
	return filename.replace("loops/","").replace("-loop","").replace(".mp3","");
}

function resizeHomePoints(d) {
	homePonits.forEach(element => {
		element.scaling = new BABYLON.Vector3(d,d,d);
	});
	selectedPoints.forEach(element => {
		element.scaling = new BABYLON.Vector3(d,d,d);
	});
}

function highlightSpot(id) {
	var point = pointLoadedMap.get(id.toString());
	selectedSpot.position.x=point.pointX;
	selectedSpot.position.z=point.pointY;
}

const zeroPad = (num, places) => String(num).padStart(places, '0')

function updatePointInfo(t) {
	var infoPopUp = "<tr><td style=\"vertical-align: text-top\"><input type=\"button\" class=\"list\" onclick=\"clearPointInfo();\" value=\"X\"\/></td><td>"+t+"</td></tr>";
	document.getElementById('pointInfoField').innerHTML=infoPopUp;
}

function clearPointInfo() {
	document.getElementById('pointInfoField').innerHTML="";
}

function updateScene() {
	if(trackStateUpdated) {
		trackStateUpdated=false;
		const multitrackPlayerControl = document.getElementById('multitrackPlayerControl');
		//var htmlTable = "<table><tr><td> Control </td><td> Clear </td><td> Play Time </td><td> Duration </td><td> Name </td></tr>";
		var htmlTable = "<table>";
		var trackNr = 0;
		sounds.forEach(element => {
			var t = Math.round( element.currentTime );
			var tsec = t % 60;
			var tmin = Math.floor( t / 60 );
			if(element.getAudioBuffer()!=undefined) {
				var d = Math.round( element.getAudioBuffer().duration );
				var dsec = d % 60;
				var dmin = Math.floor( d / 60 );
				var pointId=name2Id(element.name);
				var point=pointLoadedMap.get(pointId)
				//htmlTable += "<tr><td>" + trackNr + "</td><td>" + pointId + "</td><td>";
				htmlTable += "<tr><td>";
				if(element.isPlaying) {
					htmlTable += "<button class=\"list\" onclick=\"pauseSoundTrack("+trackNr+");\" value=\"ll\"> ";
					htmlTable += "<img src=\"icons/pause.svg\" style=\"width:8vh;height:8vh\"/>";
					htmlTable += "</button>";
				} else {
					htmlTable += "<button class=\"list\" onclick=\"playSoundTrack("+trackNr+");\" value=\"l>\"> ";
					htmlTable += "<img src=\"icons/play.svg\" style=\"width:8vh;height:8vh\"/>";
					htmlTable += "</button>";
				}
				htmlTable += "</td><td><button class=\"list\" onclick=\"disposeSoundTrack("+trackNr+");\" value=\"X\"> ";
				htmlTable += "<img src=\"icons/close.svg\" style=\"width:8vh;height:8vh\"/>";
				htmlTable += "</button></td>";
//				htmlTable += "<input type=\"button\" onclick=\"highlightSpot("+pointId+");\" value=\"show\"/> ";
//				htmlTable += "<a href=\""+element.name+"\" target=\"_blank\">download</a></td>";

				const trackId=filename2TrackId(element.name);
				const trackParams=trackId.split("_");

//				htmlTable += " <td> <a onclick=\"sendRate('"+trackId+"',1);\"> [1] </a>";
//				htmlTable += " <a onclick=\"sendRate('"+trackId+"',2);\"> [2] </a>";
//				htmlTable += " <a onclick=\"sendRate('"+trackId+"',3);\"> [3] </a> </td>";
//				htmlTable += " <td id=\"status_"+trackId+"\"> </td>";
				htmlTable += " <td id=\"playTime_"+trackId+"\" class=\"bigfont\"> </td>";
				htmlTable += " <td id=\"duration_"+trackId+"\"> </td>";
//				htmlTable += " <td> " +trackParams[3] + " </td>";
//				htmlTable += " <td> " +trackParams[4] + " </td>";
				var infoPopUp=point.name + "<br/>" + point.fields[7] + " " + point.fields[14] + "<br/>" + point.fields[15];
				htmlTable += " <td> <a onclick=\"updatePointInfo('" + infoPopUp + "');\">" + point.name + " </a></td></tr>";
			}
			trackNr++;
		});

		if(loadingSoundsMap.size>0) {
			htmlTable += "<tr><td colspan=\"11\">Loading: ";
			loadingSoundsMap.forEach((value, key, map) => {
				htmlTable += key + " ";
			});
			htmlTable += "</td></tr>";
		}

		htmlTable += "</table>";
		//htmlTable += "<table id=\"pointInfoField\" style=\"word-wrap:break-word;width:50vw;\">";
		//htmlTable += "<tr><td colspan=\"5\"></td></tr>";
		//htmlTable += "</table>";

		multitrackPlayerControl.innerHTML = htmlTable;
	}

	var trackNr = 0;
	sounds.forEach(element => {
		var t = Math.round( element.currentTime );
		var tsec = t % 60;
		var tmin = Math.floor( t / 60 );
		if(element.getAudioBuffer()!=undefined) {
			var d = Math.round( element.getAudioBuffer().duration );
			var dsec = d % 60;
			var dmin = Math.floor( d / 60 );
			var playState = "pause";
			if(element.isPlaying) {
				playState = "play";
			}
			const trackId=filename2TrackId(element.name);
			document.getElementById('playTime_'+trackId).innerHTML = zeroPad(tmin,2) + ":" + zeroPad(tsec,2);
			document.getElementById('duration_'+trackId).innerHTML = zeroPad(dmin,2) + ":" + zeroPad(dsec,2);
		}
		trackNr++;
	});

	var newRadius=Math.max(0.1,camera.radius * 0.02);
	resizeHomePoints(newRadius);
	selectedSpot.scaling = new BABYLON.Vector3(newRadius,newRadius,newRadius);

	if(camera.target.x!=selectedSpot.position.x || camera.target.z!=selectedSpot.position.z) {
		var cameraDeltaX = (selectedSpot.position.x - camera.target.x)/20;
		var cameraDeltaZ = (selectedSpot.position.z - camera.target.z)/20;
		var cameraDeltaRadius = (0.5 - camera.radius)/20

		if(Math.abs(cameraDeltaX)>0.0001) {
			camera.target.x+=cameraDeltaX;
		} else {
			camera.target.x = selectedSpot.position.x;
		}

		if(Math.abs(cameraDeltaZ)>0.0001) {
			camera.target.z+=cameraDeltaZ;
		} else {
			camera.target.z = selectedSpot.position.z;
		}

		if(Math.abs(cameraDeltaRadius)>0.0005) {
			camera.radius+=cameraDeltaRadius;
		} else {
			camera.radius = 0.5;
		}
	}

	camera.alpha+=cameraAlphaSpeed;
}

var requestFilesFromList = function( sector, spotId ) {
	filterCsv(sector);
	highlightSpot(spotId)
	requestFiles(sector+"_"+spotId);
}

var requestFiles = function( spotId ) {
	var oReq = new XMLHttpRequest();

	loadingSoundsMap.set(spotId,1);
	trackStateUpdated=true;

	oReq.addEventListener("load", function() {
		var files=this.response.split('\n');
		if(files.length<=1) {
			nextSound();
			triggerNewSound(spotId);
		} else {
			loadingSoundsMap.delete(spotId);
			trackStateUpdated=true;
			if(loopPlay) playTrack("loops/"+files[0]+"-loop.mp3");
			else playTrack("loops/"+files[0]+".mp3");
			console.log("got file response " + this.response );
		}
	});

	var getUrl = window.location;
	var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" ;
	console.log("request files for spot " + spotId);

	oReq.open("GET", baseUrl + "files?spotId="+spotId);
	oReq.send();
}

function addSelectedSpot() {
	var meshName="sp_"+selectedSpot.pointId;
	if( scene.getMeshByName(meshName)==undefined) {
		//var sphere = BABYLON.MeshBuilder.CreateCylinder(meshName, {width:1,height:1,depth:1, diameterTop: 1, diameterBottom: 0, tessellation: 4}, scene);
		var sphere = BABYLON.MeshBuilder.CreateSphere(meshName, {diameter: 0.1}, scene);
		sphere.position.x = selectedSpot.position.x;
		sphere.position.z = selectedSpot.position.z;
		sphere.position.y = 0.1;
		sphere.material = mRed;
		selectedPoints.push(sphere);
	}
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

			var sHeight = 0.001;

			/*
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
			*/

			var sphere;

			var sectorX = Math.floor(fields[2]/2);
			var sectorY = Math.floor(fields[3]/2);
			var sectorId = sectorX + "_" + sectorY;

			//var sWidth = 0.01 + ( 400 - sectorCountMap.get(sectorId) ) / 10000;
			let sWidth = 0.001;

			//console.log("sWidth " + sWidth + " sectorId " + sectorId + " count " + sectorCountMap.get(sectorId) );

			/*
			if( fields[7] == "Summit"  ) {
				sphere = BABYLON.MeshBuilder.CreateCylinder("box", {width:sWidth,height:sHeight,depth:sWidth, diameterTop: 0, diameterBottom: sWidth, tessellation: 4}, scene);
			} else if( fields[7] == "Building" ) {
				sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:0.1}, scene);
				homePonits.push(sphere);
			} else if( fields[7] == "Airport" ){
				sphere = BABYLON.MeshBuilder.CreateBox("box", {width:0.8,height:0.4,depth:2}, scene);
				homePonits.push(sphere);
			} else {
				//sphere = BABYLON.MeshBuilder.CreateBox("box", {width:sWidth,height:sHeight,depth:sWidth}, scene);
				sphere = BABYLON.MeshBuilder.CreateCylinder("box", {width:sWidth,height:sHeight,depth:sWidth, diameterTop: 0, diameterBottom: sWidth, tessellation: 4}, scene);
			}
			*/

			sphere = BABYLON.MeshBuilder.CreateCylinder("box", {width:sWidth,height:sHeight,depth:sWidth, diameterTop: 0, diameterBottom: sWidth, tessellation: 4}, scene);

			sphere.position.x = fields[2];
			sphere.position.z = fields[3];
			sphere.position.y = sHeight / 2;

			if( fields[7] == "Building"  ) {
				sphere.material = mRed;
			} else if( fields[7] == "Airport"  ) {
				sphere.material = mYellow;
			} else {
				sphere.material = mWhite;
			}
				/*
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
				*/

			sphere.actionManager = new BABYLON.ActionManager(scene);

			sphere.actionManager.registerAction(
				new BABYLON.ExecuteCodeAction(
					{
						trigger: BABYLON.ActionManager.OnPickTrigger
					},
					function (event) {
						selectSpot(fields);
					}
				)
			);
			csvIndex++;
		}
	} else {
		statusPanel.text = "loaded " + csvIndex + " spots";
	}

}

var selectSpot = function(fields) {
	selectedSpot.position.x = fields[2];
	selectedSpot.position.z = fields[3];
	selectedSpot.pointId = fields[5];
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

	sessionList.unshift(fields[5]);
	visitedPoints.set(fields[5]);
	addSelectedSpot();
	getClosestUnvisited(fields[5],autoPilotDistance);
}

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", function() {
	processCsv(this.responseText);
	console.log("processed csv");
});

var createScene = function () {

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

	var advancedTexture2 = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

	var panel2 = new BABYLON.GUI.Grid();
	panel2.addColumnDefinition(0.8);
	panel2.addColumnDefinition(0.2);
	panel2.addRowDefinition(1);

	statusPanel = new BABYLON.GUI.TextBlock();
	statusPanel.text = "--- loading ---";
	statusPanel.textWrapping=true;
	statusPanel.textVerticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
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
	backgroundMaterial.freeze();
	skybox.material = backgroundMaterial;

	/*
	const xr = scene.createDefaultXRExperienceAsync({
	floorMeshes: [env.ground]
});
*/
};


var camSetup = function () {
	camera.target.x = 0;
	camera.target.y = 0.1;
	camera.target.z = 0;
	camera.radius=50;
	camera.beta=0;
	camera.upperRadiusLimit=60;
	camera.lowerRadiusLimit=0.5;
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
	camera.minZ=0.1;
	camera.attachControl(canvas, true);
}

var cam2d = function () {
	if(activeCamera!="2d") {
		camera2d.target.x = camera.target.x;
		camera2d.target.y = camera.target.y;
		camera2d.target.z = camera.target.z;
		camera2d.radius = camera.radius;
		camera2d.beta = camera.beta;
		activeCamera = "2d";
		camera = camera2d;
		scene.setActiveCameraByName("cam2d");
	}
}

var cam3d = function () {
	if(activeCamera!="3d") {
		camera3d.target.x = camera.target.x;
		camera3d.target.y = camera.target.y;
		camera3d.target.z = camera.target.z;
		camera3d.radius = camera.radius;
		camera3d.beta = camera.beta;
		activeCamera = "3d";
		camera = camera3d;
		scene.setActiveCameraByName("cam3d");
	}
}

camera = new BABYLON.StereoscopicArcRotateCamera("cam3d", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,50), 0.00137, 1, scene);
camSetup();
camera3d = camera;

camera = new BABYLON.ArcRotateCamera("cam2d", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,50), scene);
camSetup();
camera2d = camera;
scene.setActiveCameraByName("cam2d");

createScene(); //Call the createScene function

scene.registerBeforeRender( updateScene );

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
	scene.render();
});

loadSoundParams();

oReq.open("GET", "AntarcticNames.csv");
oReq.send();

window.setInterval( addNextPoint, 10 );
