// ---------------- CONSTANTS --------------- //
INITIAL_CANVAS_WIDTH = 960;
INITIAL_CANVAS_HEIGHT = 540;
MOVEMENT_SPEED = 15;
SCOTT_SPEED = 5;
WALL_GAP = 0.4;
INCHES_SCALE = 0.15;

// ---------------- GLOBALS ---------------- //
var gl;

var frameCount = 0;
var secondCount = 0;

var fullScreenEnabled = false;

var vertices = [];
var texVertices = [];

var muted = false;

var itemSize = 3;

// Map variables
var globalScale = 1.5;
var textureScale = .05;

var bottomFloor = true;

var groundHeight = 0;
var wallHeight = 10 * globalScale;
var lightHeight = wallHeight - 1;

var lightWidth = 3;
var doorWidth = 4 * globalScale;
var doorHeight = 7 * globalScale;
var doorDepth = 0.5;
var visibleDoorDepth = 0.1;
var doorSound = new Audio("res/door.wav");
var dingSound = new Audio("res/ding.mp3");
var prevSong = null;

var torsoWidth = 3;
var headWidth = 4;
var shoveRadius = 5;
var torsoHeight = 6;
var personHeight = 9;
var standingDistance = 8;
var scottX = 0;
var scottZ = 0;
var scottTimer = 0;
var prevPaintingNum = 0;
var prevPaintingCoords = [0,0];
var paintingNum = 0;
var paintingCoords = [0,0];
var shoveDistance = headWidth-1;
var idleSounds = [new Audio("res/idle1.ogg"), new Audio("res/idle2.ogg"), new Audio("res/idle3.ogg")];
var shoveSound = new Audio("res/shove.ogg");

var shrineWidth = 400;
var leftWall = 0 * globalScale;
var midLeftWall = 30 * globalScale;
var midRightWall = 50 * globalScale;
var rightWall = 75 * globalScale;

var shrineBottomWall = 400 * globalScale;
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

var allowControl = true;
var enteredShrine = false;

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

var timerCheck1 = false;
var timerCheck2 = false;
var timerCheck3 = false;
var timerCheck4 = false;
var timerCheck5 = false;
var timerCheck6 = false;
var timerCheck7 = false;
var timerCheck8 = false;
var timerCheck9 = false;
var timerCheck10 = false;

var numLights = 1;
var pathWidth = 10;
var pathLength = 40;
var pathStart = 50;
var timer = 0;
var spotlightSound = new Audio("res/spotlight.mp3");

var norm1 = vec3(0, 0, 1);
var norm1small = vec3(0, 0, 0.5);
var norm2 = vec3(0, 0, -1);
var norm2small = vec3(0, 0, -0.5);
var norm3 = vec3(1, 0, 0);
var norm3small = vec3(0.5, 0, 0);
var norm4 = vec3(-1, 0, 0);
var norm4small = vec3(-0.5, 0, 0);
var norm4big = vec3(-1.5, 0, 0);

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
