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
var maxSounds = 1;
var cameraAlphaSpeed = 0.00005;

var infoPanel;
var statusPanel;

var selectedSpot;
