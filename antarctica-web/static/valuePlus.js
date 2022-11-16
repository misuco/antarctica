
class valuePlus {
	constructor( name, min, step, max, initValue ) {
		var self = this;
		this.name = name;
		this.min = min;
		this.step = step;
		this.max = max;
		this.value = initValue;
		this.valueFunction = function(value) {};
		this.changeMode = 0;
		this.changeEvery = 1;
		this.changeBy = 0;
		this.changeCounter = 0;
	}

	setValueFunction(f) {
		this.valueFunction = f;
	}

	setChangeMode(m) {
		if(m>3) m=3;
		if(m<0) m=0;
		this.changeMode=m;
	}

	setChangeEvery(v) {
		if(v>64) v=64;
		if(v<1) v=1;
		this.changeEvery=v;
	}

	setChangeBy(v) {
		if(v>64) v=64;
		if(v<1) v=1;
		this.changeBy=v;
	}

	change() {
		this.changeCounter++;
		if(this.changeCounter==this.changeEvery) {
			this.changeCounter=0;
			switch(this.changeMode) {
				// Random
				case 1:
					this.setRandomValue();
					break;
				// Saw
				case 2:
				// Tri
				case 3:
					this.add(this.changeBy);
					if(this.value==this.max) {
						if(this.changeMode==2) {
							this.value=this.min;
						} else if(this.changeMode==3) {
							this.changeBy*=-1;
						}
					} else if(this.value==this.min) {
						if(this.changeMode==2) {
							this.value=this.max;
						} else if(this.changeMode==3) {
							this.changeBy*=-1;
						}
					}
					this.valueFunction(this.value);
					break;
			}
		}
	}

	setRandomValue() {
		var fragments=(this.max-this.min)/this.step;
		this.value=this.min+Math.round((Math.random()*fragments)*this.step);
		this.valueFunction(this.value);
	}

	add(v) {
		this.value+=parseInt(v,10);
		if(this.value>this.max) this.value=this.max;
		if(this.value<this.min) this.value=this.min;
		this.valueFunction(this.value);
	}

	inc() {
		this.value+=this.step;
		if(this.value>this.max) this.value=this.max;
		this.valueFunction(this.value);
	}

	dec() {
		this.value-=this.step;
		if(this.value<this.min) this.value=this.min;
		this.valueFunction(this.value);
	}
}
