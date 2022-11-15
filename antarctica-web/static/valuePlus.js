
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
		this.changeMode=m;
	}

	setChangeEvery(v) {
		this.changeEvery=v;
	}

	setChangeBy(v) {
		this.changeBy=v;
	}

	change() {
		changeCounter++;
		if(changeCounter==changeEvery) {
			switch(this.changeMode) {
				case 1:
					if(changeBy>0) {
						for(var i=0;i<changeBy;i++) {
							this.inc();
						}
					}
					if(changeBy<0) {
						for(var i=0;i>changeBy;i--) {
							this.dec();
						}
					}
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
		this.value+=v;
		if(this.value>this.max) this.value=this.min;
		if(this.value<this.min) this.value=this.max;
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
