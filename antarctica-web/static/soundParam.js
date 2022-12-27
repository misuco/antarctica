
var savedSoundParams = [];


var setSoundParams = function(n) {
   console.log("setSoundParam "+n);
   soundParams=[];
   console.log("JSON:"+savedSoundParams[n]);
   //console.log(JSON.stringify(savedSoundParams[n]));
   const soundParamImport = JSON.parse(savedSoundParams[n]);
   soundParamImport.forEach((item, i) => {
      var soundParam = Object.assign(new valuePlus, item );
      if(soundParam.name=="Clip ID") {
         console.log("assigned " + soundParam.name)
         soundParam.setValueFunction( function(value) {
      		clipId = value;
      	} );
         soundParam.valueFunction(soundParam.value);
      }
      else if(soundParam.name=="Tempo") {
         console.log("assigned " + soundParam.name)
         soundParam.setValueFunction( function(value) {
            tempo = value;
      	} );
         soundParam.valueFunction(soundParam.value);
      }
      else if(soundParam.name=="Loop len") {
         console.log("assigned " + soundParam.name)
         soundParam.setValueFunction( function(value) {
            loopLength = value;
      	} );
         soundParam.valueFunction(soundParam.value);
      }
      else if(soundParam.name=="Repeat") {
         console.log("assigned " + soundParam.name)
         soundParam.setValueFunction( function(value) {
            repeat = value;
      	} );
         soundParam.valueFunction(soundParam.value);
      }
      else if(soundParam.name=="Pitch") {
         console.log("assigned " + soundParam.name)
         soundParam.setValueFunction( function(value) {
            pitch = value;
      	} );
         soundParam.valueFunction(soundParam.value);
      }
      else if(soundParam.name=="Basenote") {
         console.log("assigned " + soundParam.name)
         soundParam.setValueFunction( function(value) {
            basenote = value;
      	} );
         soundParam.valueFunction(soundParam.value);
      }
      else if(soundParam.name=="Scale") {
         console.log("assigned " + soundParam.name)
         soundParam.setValueFunction( function(value) {
            scale = value;
      	} );
         soundParam.valueFunction(soundParam.value);
      }
      else if(soundParam.name=="Arrange") {
         console.log("assigned " + soundParam.name)
         soundParam.setValueFunction( function(value) {
            arrange = value;
      	} );
         soundParam.valueFunction(soundParam.value);
      }
      else if(soundParam.name=="Sound") {
         console.log("assigned " + soundParam.name)
         soundParam.setValueFunction( function(value) {
            soundProg = value;
      	} );
         soundParam.valueFunction(soundParam.value);
      }
      else if(soundParam.name=="Autopilot") {
         console.log("assigned " + soundParam.name)
         soundParam.setValueFunction( function(value) {
            autoPilot = value;
      	} );
         soundParam.valueFunction(soundParam.value);
      }
      else if(soundParam.name=="Autopilot distance") {
         console.log("assigned " + soundParam.name)
         soundParam.setValueFunction( function(value) {
            autoPilotDistance = value;
      	} );
         soundParam.valueFunction(soundParam.value);
      }
      else if(soundParam.name=="Loop Play") {
         console.log("assigned " + soundParam.name)
         soundParam.setValueFunction( function(value) {
            loopPlay = value;
      	} );
         soundParam.valueFunction(soundParam.value);
      }
      else if(soundParam.name=="Max sounds") {
         console.log("assigned " + soundParam.name)
         soundParam.setValueFunction( function(value) {
            maxSounds = value;
      	} );
         soundParam.valueFunction(soundParam.value);
      }

      soundParams.push(soundParam);
   });
}


var saveSoundParams = function() {
   var paramsAlreadySaved=false;
   var currentParamsJSON = JSON.stringify(soundParams);
   savedSoundParams.forEach((item, i) => {
      if(item==currentParamsJSON) {
         paramsAlreadySaved=true;
      }
   });
   if(!paramsAlreadySaved) {
      savedSoundParams.push(currentParamsJSON);
      sendSoundParams();
   }
}

var sendSoundParams = function() {
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", function() {
		console.log("sendSoundParams");
	});

	var getUrl = window.location;
	var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" ;

	oReq.open("POST", baseUrl + "soundparams?sessionId="+sessionId);
   oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
   oReq.send(JSON.stringify(savedSoundParams));
}

var loadSoundParams = function() {
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", function() {
      savedSoundParams=[];
      const soundParamsImport = JSON.parse("["+this.response+"]");
      soundParamsImport.forEach((item, i) => {
         savedSoundParams.push(JSON.stringify(item));
      });
      showSessionControl();
	});

	var getUrl = window.location;
	var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" ;

	oReq.open("GET", baseUrl + "soundparams?sessionId="+sessionId);
   oReq.send();
}
