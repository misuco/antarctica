
var savedSoundParams = [];

/*
var loadSoundParams = function(id) {
   clipId = 1;
   tempo = 40;
   loopLength = 4;
   repeat = 4;
   pitch = 0;
   basenote = 0;
   scale = 20;
   arrange = 0;
   soundProg = 4;

   soundParams[0].setChangeMode(1);
   soundParams[4].setChangeMode(1);

   loopPlay = 1;
   autoPilot = 1;
   autoPilotDistance = 5;
   maxSounds = 3;

}
*/

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
		console.log("sendSoundParams response "+this.response);
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
      console.log(this.response);
      const soundParamsImport = JSON.parse("["+this.response+"]");
      soundParamsImport.forEach((item, i) => {
//         Object.assign(new ValuePlus, item);
         var soundParam = new valuePlus( item );
         savedSoundParams.push(soundParam);
         console.log("loadSoundParams response "+item);
      });
	});

	var getUrl = window.location;
	var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" ;

	oReq.open("GET", baseUrl + "soundparams?sessionId="+sessionId);
   oReq.send();
}
