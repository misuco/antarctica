
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
			sounds.forEach(element => { element.pause(); });
			state='pause';
			playButton.setText("Play");
		} else {
			sounds.forEach(element => { element.play(); });
			state='play';
			playButton.setText("Pause");
		}
	});

   	loopButton = new ButtonPlus("Loop On",panel,2,0,function() {
		if(loopPlay==true) {
			loopPlay=false;
			loopButton.setText("Loop On");
		} else {
			loopPlay=true
			loopButton.setText("Loop Off");
		}
	});
	
   	createRateButton(panel,"change",4,function() {
		console.log("change");		
		if(soundPanel==undefined) soundPanel = createSoundPanel();
		soundPanel.isVisible=true;
	});
   	
	advancedTexture.addControl(panel);
	
	return panel;

};
