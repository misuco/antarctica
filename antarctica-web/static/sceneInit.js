var camera;
var canvas = document.getElementById("renderCanvas"); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
var scene = new BABYLON.Scene(engine);

var records = [];
var sectorCountMap = new Map();
var pointLoadedMap = new Map();
var homePonits = [];

var state = 'select';
var playingTrack = '';
var loopPlay = false;
var autoPilot = false;
var maxSounds = 1;

var infoPanel;
var statusPanel;
var statusPanel2;
var replayPanel;
var soundPanel;

var spheres = [];
var sp=0;

var selectedSpot;
var assignNext = false;

var angel = 0;
var distance = 5;
var speed = -0.001;

var alphashift = 0.0;
var alphaoffset = 0.0;
var betashift = 0.0;

var selectedRecord;
