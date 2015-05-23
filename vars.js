// ---------------- CONSTANTS --------------- //
INITIAL_CANVAS_WIDTH = 960;
INITIAL_CANVAS_HEIGHT = 540;
MOVEMENT_SPEED = 15;
WALL_GAP = 0.4

// ---------------- GLOBALS ---------------- //
var gl;

var fullScreenEnabled = false;

var vertices = [];
var texVertices = [];

var itemSize = 3;

var initCamX = -42;
var initCamY = 8;
var initCamZ = 10;
var initAzim = 0;
var initPitch = -10;
var initFOV = 40;

var camX = initCamX;
var camY = initCamY;
var camZ = initCamZ;
var azim = initAzim;
var pitch = initPitch;
var fov = initFOV;

var wHeld = false;
var aHeld = false;
var sHeld = false;
var dHeld = false;
var leftHeld = false;
var rightHeld = false;
var shiftHeld = false;
var spaceHeld = false;

var rotationSpeed = 360;
var rotVal = 0;
var then = 0;

var noTranslation = [0,0,0];
var noRotation 	  = 0;
var noScale       = [1,1,1];

var curRoomIndex = 0;
var renderCeiling = true;

var COLORS = {
	WHITE: [1.0, 1.0, 1.0, 1.0],
	BLACK: [0.0, 0.0, 0.0, 1.0],
	YELLOW: [1.0, 1.0, 0.0, 1.0],
	RED: [1.0, 0.0, 0.0, 1.0],
	GREEN: [0.0, 1.0, 0.0, 1.0],
	BLUE: [0.0, 0.0, 1.0, 1.0],

	FLOOR_COLOR: [0.8, 0.8, 0.8, 1.0]
};
var ROOMS = {
	LOBBY: 0,
	HALLWAY: 1,
	ROOM1: 2,
	ROOM2: 3,
	ROOM3: 4,
	STAIRCASE: 5,
	SHRINE: 6
};
var WALL_OBJECT = {
	DOORS: 0,
	PAINTINGS: 1
}