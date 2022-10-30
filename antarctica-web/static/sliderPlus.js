
class sliderPlus {
	constructor( panel, row, label, min, step, max, initValue ) {
		var self = this;
		this.label = label;
		this.min = min;
		this.step = step;
		this.max = max;
		this.value = initValue;
		this.valueFunction = function(value) {};

		this.getHeaderText = function() {
			return self.label + ":" + Math.round( self.value * 1000 ) / 1000;
		}

		this.header = new BABYLON.GUI.TextBlock();
		this.header.height = "30px";
		this.header.color = "white";
		this.header.text = this.getHeaderText();

		this.slider = new BABYLON.GUI.Slider();
		this.slider.minimum = min;
		this.slider.maximum = max;
		this.slider.value = initValue;
		this.slider.step = step;
		this.slider.height = "20px";
		this.slider.width = "150px";
		this.slider.onValueChangedObservable.add(function(v) {
			self.value=v;
			self.header.text = self.getHeaderText();
			self.valueFunction(self.value);
		});

		this.minusButton = BABYLON.GUI.Button.CreateSimpleButton("minus"+label, "-"+step );
		this.minusButton.width = "50px"
		this.minusButton.height = "40px";
		this.minusButton.color = "black";
		this.minusButton.cornerRadius = 20;
		this.minusButton.background = "white";
		this.minusButton.onPointerUpObservable.add(function() {
			self.value-=step;
			if(self.value<min) self.value=min;
			self.slider.value = self.value;
			self.valueFunction(self.value);
		});

		this.plusButton = BABYLON.GUI.Button.CreateSimpleButton("plus"+label, "+"+step);
		this.plusButton.width = "50px"
		this.plusButton.height = "40px";
		this.plusButton.color = "black";
		this.plusButton.cornerRadius = 20;
		this.plusButton.background = "white";
		this.plusButton.onPointerUpObservable.add(function() {
			self.value+=step;
			if(self.value>max) self.value=max;
			self.slider.value = self.value;
			self.valueFunction(self.value);
		});

		panel.addControl(this.header, row, 0);
		panel.addControl(this.minusButton, row, 1);
		panel.addControl(this.slider, row, 2);
		panel.addControl(this.plusButton, row, 3);
	}

	setValueFunction(f) {
		this.valueFunction = f;
	}

	setValue(v) {
		this.value = v;
		this.slider.value = this.value;
		this.valueFunction(v);
	}

	setRandomValue() {
		var fragments=(this.max-this.min)/this.step;
		this.value=this.min+Math.round((Math.random()*fragments)*this.step);
		this.slider.value = this.value;
		this.valueFunction(this.value);
	}

	inc() {
			this.value+=this.step;
			if(this.value>this.max) this.value=this.max;
			this.slider.value = this.value;
			this.valueFunction(this.value);
	}

	dec() {
			this.value-=this.step;
			if(this.value<this.min) this.value=this.min;
			this.slider.value = this.value;
			this.valueFunction(this.value);
	}
}
