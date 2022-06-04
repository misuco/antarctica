
var createPlayControlPanel = function () {
	var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

	var panel = new BABYLON.GUI.Grid();
    panel.addColumnDefinition(0.16);
    panel.addColumnDefinition(0.16);
    panel.addColumnDefinition(0.16);
    panel.addColumnDefinition(0.16);
    panel.addColumnDefinition(0.16);
    panel.addColumnDefinition(0.2);
    panel.addRowDefinition(0.01);
    panel.addRowDefinition(0.19);
    panel.addRowDefinition(0.8);

   	playButton = new ButtonPlus("Pause",panel,1,0,function() {
		if(state=='play') {
			music1.pause();
			state='pause';
			playButton.setText("Play");		
		} else {
			music1.play();
			state='play';
			playButton.setText("Pause");
		}
	});
	
	/*
   	createRateButton(panel,"Loop On",2,function() {
		console.log("Loop On");
		loopPlay=true;
	});
   	createRateButton(panel,"Loop Off",3,function() {
		console.log("Loop Off");
		loopPlay=false;
	});
	*/
	
   	createRateButton(panel,"change",4,function() {
		console.log("change");		
		if(soundPanel==undefined) soundPanel = createSoundPanel();
		soundPanel.isVisible=true;
	});
   	
	advancedTexture.addControl(panel);
	
	return panel;

};
