
var createRatePanel = function () {
	var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

	var panel = new BABYLON.GUI.Grid();
    panel.addColumnDefinition(0.2);
    panel.addColumnDefinition(0.2);
    panel.addColumnDefinition(0.2);
    panel.addColumnDefinition(0.2);
    panel.addColumnDefinition(0.2);
    panel.addRowDefinition(0.8);
    panel.addRowDefinition(0.2);

   	createRateButton(panel,1,0);
   	createRateButton(panel,2,1);
   	createRateButton(panel,3,2);
   	createRateButton(panel,4,3);
   	createRateButton(panel,5,4);
   	
	advancedTexture.addControl(panel);
	
	return panel;

};

var createRateButton = function (panel,nr,col) {
	var rate1button;
	rate1button = BABYLON.GUI.Button.CreateSimpleButton("rate "+nr, "Rate "+nr );
	rate1button.width = "200px"
	rate1button.height = "100px";
	rate1button.color = "black";
	rate1button.cornerRadius = 20;
	rate1button.background = "white";
	rate1button.onPointerUpObservable.add(function() {
		console.log("rate "+nr);
		soundPanel = createSoundPanel();
	});
	
	panel.addControl(rate1button, 1, col);
}
