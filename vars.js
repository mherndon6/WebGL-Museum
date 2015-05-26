// ---------------- CONSTANTS --------------- //
INITIAL_CANVAS_WIDTH = 960;
INITIAL_CANVAS_HEIGHT = 540;
MOVEMENT_SPEED = 15; //TODO 15
WALL_GAP = 0.4;
INCHES_SCALE = 0.15;

// ---------------- GLOBALS ---------------- //
var gl;

var fullScreenEnabled = false;

var vertices = [];
var texVertices = [];

var muted = false;

var itemSize = 3;

// Map variables
var globalScale = 1.5;
var textureScale = .05;

var groundHeight = 0;
var wallHeight = 10 * globalScale;
var lightHeight = wallHeight - 1;

var lightWidth = 3;
var doorWidth = 4 * globalScale;
var doorHeight = 7 * globalScale;
var doorDepth = 0.5;
var visibleDoorDepth = 0.1;
var doorSound = new Audio("res/door.wav");
var prevSong = null;

var leftWall = 0 * globalScale;
var midLeftWall = 30 * globalScale;
var midRightWall = 50 * globalScale;
var rightWall = 75 * globalScale;

var shrineBottomWall = 4500 * globalScale;
var bottomWall = -1 * globalScale;
var midBottomWall = -20 * globalScale;
var midTopWall = -45 * globalScale;
var topWall = -70 * globalScale;
var topStairWall = -85 * globalScale;


// Museum variables
var initCamX = -60;
var initCamY = 8;
var initCamZ = 10;
var initAzim = 0;
var initPitch = -10;
var initFOV = 30;

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
var iHeld = false;
var jHeld = false;
var kHeld = false;
var lHeld = false;
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
	LIGHT_GREY: [0.8, 0.8, 0.8, 0.8],
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
        ROOM4: 6,
        ROOM5: 7,
        ROOM6: 8,
	SHRINE: 9
};
var WALL_OBJECT = {
	DOORS: 0,
	PAINTINGS: 1
};
var SETTINGS = {
	DRAW_TEXTURE: true,
	NO_TEXTURE: false,
	DRAW_LIGHT: true,
	NO_LIGHT: false
};
