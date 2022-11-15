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

	var view = "<table><tr><td>Session Name</td><td colspan=\"3\">" + sessionName + "</h1></tr>";
	soundParams.forEach((item, i) => {
		view += "<tr><td>" + item.name + "</td>";
		view += "<td><input type=\"button\" value=\"-\" onclick=\"soundParams["+i+"].dec();showSessionControl();\" /></td>";
		view += "<td> " + item.value + "</td>";
		view += "<td><input type=\"button\" value=\"+\" onclick=\"soundParams["+i+"].inc();showSessionControl();\" /></td>";
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
