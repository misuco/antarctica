const multitrackPlayerControl = document.getElementById('multitrackPlayerControl');
const multitrackPlayerList = document.getElementById('multitrackPlayerList');
const ratingList = document.getElementById('ratingList');

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
	multitrackPlayerControl.hidden=true;
	multitrackPlayerList.hidden=true;
	ratingList.hidden=false;
	ratingList.innerHTML="<span>Loading rating list</span>";	
	requestRating();
}

function showPlayer() {
	multitrackPlayerControl.hidden=false;
	multitrackPlayerList.hidden=false;
	ratingList.hidden=true;
}
