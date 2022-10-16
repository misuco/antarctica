
var sendRate = function( trackId, rating ) {
	console.log("rate trackId " + trackId + " rating " + rating);
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", function() {
		statusPanel2.text = this.response;
	});
	
	var getUrl = window.location;
	var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" ;
	
	oReq.open("GET", baseUrl + "rate?trackId="+trackId+"&rating="+rating);
	oReq.send();
	
	state='rated';
}
