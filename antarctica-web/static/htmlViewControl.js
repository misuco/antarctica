const multitrackPlayerControl = document.getElementById('multitrackPlayerControl');
const sessionStart = document.getElementById('sessionStart');
const ratingList = document.getElementById('ratingList');
const sessionControl = document.getElementById('sessionControl');

var popUpScalesCsv="";
var popUpGmInstrumentsCsv="";

var requestRating = function() {
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", function() {
		ratingList.innerHTML=this.response;
	});

	var getUrl = window.location;
	var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" ;
	console.log("GET " + baseUrl + "rating");
	oReq.open("GET", baseUrl + "rating");
	oReq.send();
}

function showRating() {
	hideAllViews();
	ratingList.hidden=false;
	ratingList.innerHTML="<span>Loading rating list</span>";
	requestRating();
}

function showPlayer() {
	hideAllViews();
	multitrackPlayerControl.hidden=false;
}

function updateSessionControl() {
	// update session view on load of new sound
	if(sessionControl.hidden==false) {
		showSessionControl();
	}
}

function popUpScales(v,i) {
	view="<select class=\"list2text\" id=\"popUpScales"+i+"\" onchange=\"soundParams["+i+"].setValue(document.getElementById('popUpScales"+i+"').value);showSessionControl();\">";
	lines = popUpScalesCsv.split('\n');
	fieldId = lines[0].split(';');
	for(var i=1;i<lines.length;i++) {
		fields = lines[i].split(';');
		if(fields.length>1) {
			var selected="";
			if(v==i) {
				selected="selected";
			}
			view+="<option class=\"list2text\" value=\""+i+"\" "+selected+">"+fields[0]+"</option>";
		}
	}
	view+="</option>";
	return view;
}

function popUpGmInstruments(v,i) {
	view="<select class=\"list2text\" id=\"popUpGmInstruments"+i+"\" onchange=\"soundParams["+i+"].setValue(document.getElementById('popUpGmInstruments"+i+"').value);showSessionControl();\">";
	lines = popUpGmInstrumentsCsv.split('\n');
	for(var i=0;i<lines.length;i++) {
		fields = lines[i].split(';');
		if(fields.length>1) {
			var selected="";
			if(v==i) {
				selected="selected";
			}
			view+="<option class=\"list2text\" value=\""+i+"\" "+selected+">"+i+". "+fields[1]+"</option>";
		}
	}
	view+="</option>";
	return view;
}

function popUpNote(v,i) {
	view="<select class=\"list2text\" id=\"popUpNote"+i+"\" onchange=\"soundParams["+i+"].setValue(document.getElementById('popUpNote"+i+"').value);showSessionControl();\">";
	lines = popUpScalesCsv.split('\n');
	for(var i=0;i<11;i++) {
		var selected="";
		const text=["c","c#","d","d#","e","f","f#","g","g#","h","h#"];
		if(v==i) {
			selected="selected";
		}
		view+="<option class=\"list2text\" value=\""+i+"\" "+selected+">"+text[i]+"</option>";
	}
	view+="</option>";
	return view;
}

function initPopUpScales() {
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", function() {
		popUpScalesCsv=this.response;
	});

	//var getUrl = window.location;
	//var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" ;
	console.log("GET scales_cleaned_sorted.csv");
	oReq.open("GET", "scales_cleaned_sorted.csv");
	oReq.send();
}

function initPopUpGmInstruments() {
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", function() {
		popUpGmInstrumentsCsv=this.response;
	});

	//var getUrl = window.location;
	//var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" ;
	console.log("GET gm_instrument_patch_map.csv");
	oReq.open("GET", "gm_instrument_patch_map.csv");
	oReq.send();
}

function showSessionMenu() {
	var view="";
	savedSoundParams.forEach((item, i) => {
		var soundParam=JSON.parse(item);
		var title = soundParam[14].value;
		view += "<input type=\"button\" class=\"block\" value=\"" + title + "\" onclick=\"setSoundParams(" + i + ");showTeleportMenu();\" />";
	});

	sessionControl.innerHTML=view;
	hideAllViews();
	sessionControl.hidden=false;
	closeButton.hidden=false;
}

function showTeleportMenu() {
	var view="";

	records.forEach((item, i) => {
		view += "<input type=\"button\" class=\"block\" value=\"" + item[6] + "\" onclick=\"selectSpot(records[" + i + "]);hideAllViews();\" />";
	});

	sessionControl.innerHTML=view;
	hideAllViews();
	sessionControl.hidden=false;
	closeButton.hidden=false;
}

function showSessionControl() {

	/*
	savedSoundParams.forEach((item, i) => {
		var soundParam=JSON.parse(item);
		var title = soundParam[13].value;
		view += "<input type=\"button\" value=\"" + title + "\" class=\"block2\" onclick=\"setSoundParams(" + i + ");showSessionControl();\" />";
	});
	*/

	view = "<br/><table><tr><td>Session Name</td><td colspan=\"8\">" + sessionName + "</h1></td></tr>";
	view += "<tr><td>Parameter</td><td></td><td>V</td><td></td><td>co</td><td>rn</td><td>sa</td><td>tr</td><td>sq</td><td>Ev</td><td>By</td><td>Seq</td></tr>";
	soundParams.forEach((item, i) => {
		if (typeof item.value === 'string') {
			var checked = "";
			view += "<tr><td>" + item.name + "</td>";
			view += "<td colspan=\"11\"><input type=\"text\" class=\"list2text\" id=\"itemValue"+i+"\" value=\""+item.value+"\" onchange=\"soundParams["+i+"].valueFunction(document.getElementById('itemValue"+i+"').value);showSessionControl();\" size=\"22\" /></td>";
			view += "</tr>";
		} else {
			var checked = "";
			view += "<tr><td>" + item.name + "</td>";
			view += "<td><input type=\"button\" class=\"list2\" value=\"-\" onclick=\"soundParams["+i+"].dec();showSessionControl();\" /></td>";
			view += "<td><input type=\"button\" class=\"list2\" value=\"+\" onclick=\"soundParams["+i+"].inc();showSessionControl();\" /></td>";
			if(soundParams[i].name=="Scale") {
				view += "<td>"+popUpScales(soundParams[i].value,i)+"</td>";
			} else if(soundParams[i].name=="Basenote") {
				view += "<td>"+popUpNote(soundParams[i].value,i)+"</td>";
			} else if(soundParams[i].name=="Sound") {
				view += "<td>"+popUpGmInstruments(soundParams[i].value,i)+"</td>";
			} else {
				view += "<td> " + item.value + "</td>";
			}
			checked = soundParams[i].changeMode == 0 ? "checked" : "";
			view += "<td><input type=\"radio\" class=\"list2\" name=\"var"+i+"\" value=\"const\" onclick=\"soundParams["+i+"].setChangeMode(0);showSessionControl();\" "+checked+" /></td>";
			checked = soundParams[i].changeMode == 1 ? "checked" : "";
			view += "<td><input type=\"radio\" class=\"list2\" name=\"var"+i+"\" value=\"rand\" onclick=\"soundParams["+i+"].setChangeMode(1);showSessionControl();\" "+checked+"/></td>";
			checked = soundParams[i].changeMode == 2 ? "checked" : "";
			view += "<td><input type=\"radio\" class=\"list2\" name=\"var"+i+"\" value=\"saw\" onclick=\"soundParams["+i+"].setChangeMode(2);showSessionControl();\" "+checked+"/></td>";
			checked = soundParams[i].changeMode == 3 ? "checked" : "";
			view += "<td><input type=\"radio\" class=\"list2\" name=\"var"+i+"\" value=\"tri\" onclick=\"soundParams["+i+"].setChangeMode(3);showSessionControl();\" "+checked+"/></td>";
			checked = soundParams[i].changeMode == 4 ? "checked" : "";
			view += "<td><input type=\"radio\" class=\"list2\" name=\"var"+i+"\" value=\"seq\" onclick=\"soundParams["+i+"].setChangeMode(4);showSessionControl();\" "+checked+"/></td>";
			view += "<td><input type=\"text\" class=\"list2\" id=\"varChangeEvery"+i+"\" value=\""+soundParams[i].changeEvery+"\" onchange=\"soundParams["+i+"].setChangeEvery(document.getElementById('varChangeEvery"+i+"').value);showSessionControl();\" size=\"3\" /></td>";
			view += "<td><input type=\"text\" class=\"list2\" id=\"varChangeBy"+i+"\" value=\""+soundParams[i].changeBy+"\" onchange=\"soundParams["+i+"].setChangeBy(document.getElementById('varChangeBy"+i+"').value);showSessionControl();\" size=\"3\" /></td>";
			view += "<td><input type=\"text\" class=\"list2text\" id=\"varSeq"+i+"\" value=\""+soundParams[i].seq+"\" onchange=\"soundParams["+i+"].setSeq(document.getElementById('varSeq"+i+"').value);showSessionControl();\" size=\"10\" /></td>";
			view += "</tr>";
		}
	});
	view += "</table>";
	view += "<input type=\"button\" value=\"save\" class=\"block2\" onclick=\"saveSoundParams();showSessionControl();\" />";

	sessionControl.innerHTML = view;

	hideAllViews();
	sessionControl.hidden=false;
	closeButton.hidden=false;
}

function toggleMenu() {
	menu.hidden=!menu.hidden
}

function fullscreen() {
	document.querySelector("body").requestFullscreen();
}

function hideAllViews() {
	multitrackPlayerControl.hidden=true;
	ratingList.hidden=true;
	sessionStart.hidden=true;
	sessionControl.hidden=true;
	closeButton.hidden=true;
	menu.hidden=true;
}

hideAllViews();
sessionStart.hidden=false;
initPopUpScales();
initPopUpGmInstruments();
