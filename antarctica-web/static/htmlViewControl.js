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
	soundParams.forEach((item, i) => {
		view += "<tr><td>" + item.name + "</td>";
		view += "<td><input type=\"button\" value=\"-\" onclick=\"soundParams["+i+"].dec();showSessionControl();\" /></td>";
		view += "<td> " + item.value + "</td>";
		view += "<td><input type=\"button\" value=\"+\" onclick=\"soundParams["+i+"].inc();showSessionControl();\" /></td>";
		view += "<td><input type=\"radio\" name=\"var"+i+"\" value=\"const\" onclick=\"\" />const</td>";
		view += "<td><input type=\"radio\" name=\"var"+i+"\" value=\"rand\" onclick=\"\" />rand</td>";
		view += "<td><input type=\"radio\" name=\"var"+i+"\" value=\"saw\" onclick=\"\" />saw</td>";
		view += "<td><input type=\"radio\" name=\"var"+i+"\" value=\"tri\" onclick=\"\" />tri</td>";
		view += "<td>Every<input type=\"text\" name=\"varChangeEvery"+i+"\" value=\""+soundParams[i].changeEvery+"\" onchange=\"soundParams["+i+"].setChangeEvery(document.getElementById('varChangeEvery"+i+"').value);showSessionControl();\" size=\"2\" /></td>";
		view += "<td>By<input type=\"text\" name=\"varChangeBy"+i+"\" value=\""+soundParams[i].changeBy+"\" onchange=\"soundParams["+i+"].setChangeBy(document.getElementById('varChangeBy"+i+"').value);showSessionControl();\" size=\"2\" /></td>";
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
