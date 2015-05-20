// ---------------- CONSTANTS --------------- //
INITIAL_CANVAS_WIDTH = 960;
INITIAL_CANVAS_HEIGHT = 540;
MOVEMENT_SPEED = 30;
// ---------------- GLOBALS ---------------- //
var gl;

var fullScreenEnabled = false;

vertices = [];

itemSize = 3;

initCamX = -40;
initCamY = 25;
initCamZ = -8;
initAzim = 0;
initPitch = -40;
initFOV = 40;

camX = initCamX;
camY = initCamY;
camZ = initCamZ;
azim = initAzim;
pitch = initPitch;
fov = initFOV;

wHeld = false;
aHeld = false;
sHeld = false;
dHeld = false;


rotationSpeed = 360;
rotVal = 0;
then = 0;

noTranslation = [0,0,0];
noRotation 	  = 0;
noScale       = [1,1,1];

var curRoomIndex = 0;

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
