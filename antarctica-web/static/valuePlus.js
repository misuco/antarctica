
class valuePlus {
	constructor( min, step, max, initValue ) {
		var self = this;
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
