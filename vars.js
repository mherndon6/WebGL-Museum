// Some initial global variables
var gl;

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


// ---------------- CONSTANTS --------------- //
INITIAL_CANVAS_WIDTH = 960;
INITIAL_CANVAS_HEIGHT = 540;
