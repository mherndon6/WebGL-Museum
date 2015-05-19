// ---------------- CONSTANTS --------------- //
INITIAL_CANVAS_WIDTH = 960;
INITIAL_CANVAS_HEIGHT = 540;

// ---------------- GLOBALS ---------------- //
var gl;

var fullScreenEnabled = false;

vertices = [];

itemSize = 3;

initCamX = -26;
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

rotationSpeed = 360;
rotVal = 0;
then = 0;

noTranslation = [0,0,0];
noRotation 	  = 0;
noScale       = [1,1,1];

var curRoom = 0;

var COLORS = {
	WHITE: [1.0, 1.0, 1.0, 1.0],
	BLACK: [0.0, 0.0, 0.0, 1.0],
	YELLOW: [1.0, 1.0, 0.0, 1.0],
	RED: [1.0, 0.0, 0.0, 1.0],
	GREEN: [0.0, 1.0, 0.0, 1.0],
	BLUE: [0.0, 0.0, 1.0, 1.0],

	FLOOR_COLOR: [0.8, 0.8, 0.8, 1.0]
}
