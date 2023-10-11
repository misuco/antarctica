
var savedSoundParams = [];


var setSoundParams = function(n) {
   console.log("setSoundParam "+n);
   //soundParams=[];
   console.log("JSON:"+savedSoundParams[n]);
   //console.log(JSON.stringify(savedSoundParams[n]));
   const soundParamImport = JSON.parse(savedSoundParams[n]);
   soundParamImport.forEach((item, i) => {
      console.log(" - " + item.name);
      soundParamsMap.get(item.name).changeMode=item.changeMode;
      soundParamsMap.get(item.name).changeEvery=item.changeEvery;
      soundParamsMap.get(item.name).changeBy=item.changeBy;
      soundParamsMap.get(item.name).changeCounter=item.changeCounter;
      soundParamsMap.get(item.name).seq=item.seq;
      soundParamsMap.get(item.name).minRandom=item.minRandom;
      soundParamsMap.get(item.name).maxRandom=item.maxRandom;
      soundParamsMap.get(item.name).setValue(item.value);
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
      showSessionMenu();
	});

	var getUrl = window.location;
	var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" ;

	oReq.open("GET", baseUrl + "soundparams?sessionId="+sessionId);
   oReq.send();
}
