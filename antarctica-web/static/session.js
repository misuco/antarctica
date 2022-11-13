var sessionName="";
var sessionList=[];

var initSession = function() {
   sessionName = document.getElementById('sessionName').value;
   document.getElementById('sessionNameDisplay').innerHTML = sessionName;
   showPlayer();
}
