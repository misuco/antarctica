
var createRatePanel = function () {
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
		soundPanel.isVisible=true;
		//playControlPanel.isVisible=true;
	});
   	createRateButton(panel,"Rate 1",1,function() {
		console.log("rate 1");
		sendRate(1);
		ratePanel.isVisible=false;
		replayPanel.isVisible=true;
	});
   	createRateButton(panel,"Rate 2",2,function() {
		console.log("rate 2");
		sendRate(2);
		ratePanel.isVisible=false;
		replayPanel.isVisible=true;
	});
   	createRateButton(panel,"Rate 3",3,function() {
		console.log("rate 3");
		sendRate(3);
		ratePanel.isVisible=false;
		replayPanel.isVisible=true;
	});
   	
	advancedTexture.addControl(panel);
	
	return panel;

};

var createRateButton = function (panel,text,col,func) {
	var b;
	b = BABYLON.GUI.Button.CreateSimpleButton(text,text);
	b.width = "200px"
	b.height = "100px";
	b.color = "black";
	b.cornerRadius = 20;
	b.background = "white";
	b.onPointerUpObservable.add(func);
	
	panel.addControl(b, 1, col);
	
	return b;
}


var sendRate = function( rating ) {
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", function() {
		statusPanel2.text = this.response;
	});
	
	var getUrl = window.location;
	var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" ;
	console.log("rate trackId " + playingTrack + " rating " + rating);
	
	oReq.open("GET", baseUrl + "rate?trackId="+playingTrack+"&rating="+rating);
	oReq.send();
}
