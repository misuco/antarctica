var sessionName="";
var sessionList=[];

var initSession = function() {
   sessionName = document.getElementById('sessionName').value;
   document.getElementById('sessionNameDisplay').innerHTML = sessionName;
   showPlayer();
}

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

var sessionId = uuidv4();
