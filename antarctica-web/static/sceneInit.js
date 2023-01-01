var camera;
var activeCamera;
var camera3d;
var camera2d;
var canvas = document.getElementById("renderCanvas"); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
var scene = new BABYLON.Scene(engine);

var records = [];
var sectorCountMap = new Map();
var pointLoadedMap = new Map();
var homePonits = [];
var selectedPoints = [];

var playingTrack = '';
var cameraAlphaSpeed = 0.0005;

var statusPanel;

var selectedSpot;
