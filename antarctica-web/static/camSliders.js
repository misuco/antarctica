
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

    return scene;
};

