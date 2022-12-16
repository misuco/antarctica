var camera;
var canvas = document.getElementById("renderCanvas"); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
var scene = new BABYLON.Scene(engine);

var records = [];
var sectorCountMap = new Map();
var pointLoadedMap = new Map();
var homePonits = [];
var selectedPoints = [];

var state = 'select';
var playingTrack = '';
var loopPlay = false;
var autoPilot = false;
var autoPilotDistance = 5;
var maxSounds = 1;
var cameraAlphaSpeed = 0.00005;

var infoPanel;
var statusPanel;

var selectedSpot;

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

var sessionId = uuidv4();
console.log( sessionId );
