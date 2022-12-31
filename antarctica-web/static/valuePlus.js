
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
		this.seq = [];
		this.minRandom = min;
		this.maxRandom = max;
	}

	setValueFunction(f) {
		this.valueFunction = f;
	}

	setValue(v) {
		this.value=parseInt(v);
		this.valueFunction(v);
	}

	setChangeMode(m) {
		if(m>4) m=4;
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
		if(this.changeMode==4) {
			// seq
			if(this.changeCounter>=this.seq.length) {
				this.changeCounter=0;
			}
			this.value=this.seq[this.changeCounter];
			this.valueFunction(this.value);
		} else if(this.changeCounter==this.changeEvery) {
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
		var fragments=(this.maxRandom-this.minRandom)/this.step;
		this.value=this.minRandom+Math.round((Math.random()*fragments)*this.step);
		this.valueFunction(this.value);
	}

	setSeq(s) {
		const seqString=s.split(',');
		this.seq = [];
		seqString.forEach((item, i) => {
			this.seq.push(parseInt(item));
		});
	}

	add(v) {
		this.value+=parseInt(v,10);
		if(this.value>this.max) this.value=this.max;
		if(this.value<this.min) this.value=this.min;
		this.valueFunction(this.value);
	}

	inc() {
		console.log("inc "+this.name);
		this.value+=this.step;
		if(this.value>this.max) this.value=this.max;
		this.valueFunction(this.value);
	}

	dec() {
		console.log("dec "+this.name);
		this.value-=this.step;
		if(this.value<this.min) this.value=this.min;
		this.valueFunction(this.value);
	}
}
