
class ButtonPlus {
	constructor( name, panel, row, col, onPressFunction ) {
		var self = this;
		this.button = BABYLON.GUI.Button.CreateSimpleButton(name,name);
		this.button.width = "200px"
		this.button.height = "100px";
		this.button.color = "black";
		this.button.cornerRadius = 20;
		this.button.background = "white";
		this.button.onPointerUpObservable.add(onPressFunction);
		panel.addControl(this.button, row, col);
	}
	
	setText(t) {
		//this.button.textBlock.text = t;
		this.button.textBlock.text = t;
		console.log("Set button text "+t);
	}
}
