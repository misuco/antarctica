var createAudioAnalyser = function ( scene ) {

	var myAnalyser = new BABYLON.Analyser(scene);
	BABYLON.Engine.audioEngine.connectToAnalyser(myAnalyser);
	myAnalyser.FFT_SIZE = 1024;
	myAnalyser.SMOOTHING = 0.9;

	var spatialBoxArray = [];
	var spatialBox;
	var color;

	for (var index = 0; index < myAnalyser.FFT_SIZE / 2; index++) {
		spatialBox = BABYLON.Mesh.CreateBox("sb" + index, 0.1, scene);
		spatialBox.position = new BABYLON.Vector3(index * 0.1, 0, 0);
		spatialBox.material = new BABYLON.StandardMaterial("sbm" + index, scene);
		color = hsvToRgb(index / (myAnalyser.FFT_SIZE) / 0.1 * 360, 100, 50),
		spatialBox.material.diffuseColor = new BABYLON.Color3(color.r, color.g, color.b);
		spatialBoxArray.push(spatialBox);
	}

	scene.registerBeforeRender(function () {
		var workingArray = myAnalyser.getByteFrequencyData();

		for (var i = 0; i < myAnalyser.getFrequencyBinCount() ; i++) {
			spatialBoxArray[i].scaling.y =  workingArray[i] / 32;
		}
	});


	function hsvToRgb(h, s, v) {
		var r, g, b;
		var i;
		var f, p, q, t;

		h = Math.max(0, Math.min(360, h));
		s = Math.max(0, Math.min(100, s));
		v = Math.max(0, Math.min(100, v));

		s /= 100;
		v /= 100;

		if(s == 0) {
			r = g = b = v;
			return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
		}

		h /= 60; // sector 0 to 5
		i = Math.floor(h);
		f = h - i; // factorial part of h
		p = v * (1 - s);
		q = v * (1 - s * f);
		t = v * (1 - s * (1 - f));

		switch(i) {
			case 0:
			r = v;
			g = t;
			b = p;
			break;
			case 1:
			r = q;
			g = v;
			b = p;
			break;
			case 2:
			r = p;
			g = v;
			b = t;
			break;
			case 3:
			r = p;
			g = q;
			b = v;
			break;
			case 4:
			r = t;
			g = p;
			b = v;
			break;
			default: // case 5:
			r = v;
			g = p;
			b = q;
		}
		return {r: r, g: g, b: b};
	}

};
