const multitrackPlayerControl = document.getElementById('multitrackPlayerControl');
const sessionStart = document.getElementById('sessionStart');
const ratingList = document.getElementById('ratingList');
const sessionControl = document.getElementById('sessionControl');

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

function showSessionControl() {

	var view = "<table><tr><td>Session Name</td><td colspan=\"6\">" + sessionName + "</h1></tr>";
	view += "<tr><td>Max sounds</td>";
	view += "<td colspan=\"3\"><input type=\"text\" id=\"maxSounds\" size=\"3\" value=\"" + maxSounds + "\"><input type=\"button\" value=\"set\" onclick=\"maxSounds = document.getElementById('maxSounds').value; checkMaxSounds();\" /></td>";
	const autoPilotChecked = autoPilot == true ? "checked" : "";
	const loopPlayChecked = loopPlay == true ? "checked" : "";
	view += "<td colspan=\"2\"><input type=\"checkbox\" id=\"autoPilot\" onclick=\"autoPilot = document.getElementById('autoPilot').checked;\" "+autoPilotChecked+"> <span>autopilot</span></td>";
	view += "<td colspan=\"2\"><input type=\"checkbox\" id=\"loopPlay\" onclick=\"loopPlay = document.getElementById('loopPlay').checked;\" "+loopPlayChecked+"> <span>loop</span></td></tr>";
	soundParams.forEach((item, i) => {
		var checked = "";
		view += "<tr><td>" + item.name + "</td>";
		view += "<td><input type=\"button\" value=\"-\" onclick=\"soundParams["+i+"].dec();showSessionControl();\" /></td>";
		view += "<td> " + item.value + "</td>";
		view += "<td><input type=\"button\" value=\"+\" onclick=\"soundParams["+i+"].inc();showSessionControl();\" /></td>";
		checked = soundParams[i].changeMode == 0 ? "checked" : "";
		view += "<td><input type=\"radio\" name=\"var"+i+"\" value=\"const\" onclick=\"soundParams["+i+"].setChangeMode(0);showSessionControl();\" "+checked+" />const</td>";
		checked = soundParams[i].changeMode == 1 ? "checked" : "";
		view += "<td><input type=\"radio\" name=\"var"+i+"\" value=\"rand\" onclick=\"soundParams["+i+"].setChangeMode(1);showSessionControl();\" "+checked+"/>rand</td>";
		checked = soundParams[i].changeMode == 2 ? "checked" : "";
		view += "<td><input type=\"radio\" name=\"var"+i+"\" value=\"saw\" onclick=\"soundParams["+i+"].setChangeMode(2);showSessionControl();\" "+checked+"/>saw</td>";
		checked = soundParams[i].changeMode == 3 ? "checked" : "";
		view += "<td><input type=\"radio\" name=\"var"+i+"\" value=\"tri\" onclick=\"soundParams["+i+"].setChangeMode(3);showSessionControl();\" "+checked+"/>tri</td>";
		view += "<td>Every<input type=\"text\" id=\"varChangeEvery"+i+"\" value=\""+soundParams[i].changeEvery+"\" onchange=\"soundParams["+i+"].setChangeEvery(document.getElementById('varChangeEvery"+i+"').value);showSessionControl();\" size=\"2\" /></td>";
		view += "<td>By<input type=\"text\" id=\"varChangeBy"+i+"\" value=\""+soundParams[i].changeBy+"\" onchange=\"soundParams["+i+"].setChangeBy(document.getElementById('varChangeBy"+i+"').value);showSessionControl();\" size=\"2\" /></td>";
		view += "</tr>";
	});
	view += "</table>";
	sessionControl.innerHTML = view;

	hideAllViews();
	sessionControl.hidden=false;

}

function hideAllViews() {
	multitrackPlayerControl.hidden=true;
	ratingList.hidden=true;
	sessionStart.hidden=true;
	sessionControl.hidden=true;
}

hideAllViews();
sessionStart.hidden=false;
