
var createReplayPanel = function () {
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

   	createRateButton(panel,"Replay",0,function() {
		console.log("Replay");
		music1.play();
		state='play';
		ratePanel.isVisible=false;
		playControlPanel.isVisible=true;
	});
	
   	createRateButton(panel,"change",4,function() {
		if(soundPanel==undefined) soundPanel = createSoundPanel();
		playControlPanel.isVisible=true;
	});
   	
	advancedTexture.addControl(panel);
	
	return panel;

};

var createRateButton = function (panel,text,col,func) {
	var rate1button;
	rate1button = BABYLON.GUI.Button.CreateSimpleButton(text,text);
	rate1button.width = "200px"
	rate1button.height = "100px";
	rate1button.color = "black";
	rate1button.cornerRadius = 20;
	rate1button.background = "white";
	rate1button.onPointerUpObservable.add(func);
	
	panel.addControl(rate1button, 1, col);
}
