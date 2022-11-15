
class valuePlus {
	constructor( name, min, step, max, initValue ) {
		var self = this;
		this.name = name;
		this.min = min;
		this.step = step;
		this.max = max;
		this.value = initValue;
		this.valueFunction = function(value) {};
	}

	setValueFunction(f) {
		this.valueFunction = f;
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
