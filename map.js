var globalScale = 1.5;
var textureScale = .05;

var groundHeight = 0;
var wallHeight = 10 * globalScale;

var doorWidth = 4 * globalScale;
var doorHeight = 7 * globalScale;
var doorDepth = 0.5;
var visibleDoorDepth = 0.1;

var leftWall = 0 * globalScale;
var midLeftWall = 20 * globalScale;
var midRightWall = 35 * globalScale;
var rightWall = 55 * globalScale;

var shrineBottomWall = 50 * globalScale;
var bottomWall = -1 * globalScale;
var midBottomWall = -15 * globalScale;
var midTopWall = -45 * globalScale;
var topWall = -75 * globalScale;
var topStairWall = -85 * globalScale;

/* Room:
numWalls: number of walls in room (should be 4, but 3 or >4 might work by default)
walls: array of points defining four corners of room IN CLOCKWISE ORDER FROM BOTTOMLEFT
doors: [startPos, whichWall, room] specifying door location and room it goes to
lighting: specify lighting type, ambient values, light positions, etc...
paintings: [startPos, whichWall, painting] specifying paintings and locations
*/

var lobby = {
    numWalls: 4,
    walls: [[midLeftWall, bottomWall],
            [midLeftWall, midBottomWall],
            [midRightWall, midBottomWall],
            [midRightWall, bottomWall]],
    doors: [[(midRightWall + midLeftWall)/2 - doorWidth/2, midBottomWall, ROOMS.HALLWAY]],

    wallColor: COLORS.WHITE,
    wallTexture: drywall,

    floorTexture: lobbyCarpet,
    ceilingTexture: lobbyCeiling,

    paintings: []
};

var hallway = {
    numWalls: 4,
    walls: [[midLeftWall, midBottomWall],
            [midLeftWall, topWall],
            [midRightWall, topWall],
            [midRightWall, midBottomWall]],
    doors: [[(midRightWall + midLeftWall)/2 - doorWidth/2, midBottomWall, ROOMS.LOBBY],
            [(midBottomWall + topWall)/2 - doorWidth/2, midLeftWall, ROOMS.ROOM3],
            [(midBottomWall + midTopWall)/2 - doorWidth/2, midRightWall, ROOMS.ROOM1],
            [(midTopWall + topWall)/2 - doorWidth/2, midRightWall, ROOMS.ROOM2],
            [(midLeftWall + midRightWall)/2 + doorWidth/2, topWall, ROOMS.STAIRCASE]],

    wallColor: COLORS.WHITE,
    wallTexture: drywall,

    floorTexture: lobbyCarpet,
    ceilingTexture: lobbyCeiling,

    paintings: [[midLeftWall + 5, topWall, scott]]
};

var room1 = {
    numWalls: 4,
    walls: [[midRightWall, midBottomWall],
            [midRightWall, midTopWall],
            [rightWall, midTopWall],
            [rightWall, midBottomWall]],
    doors: [[(midBottomWall + midTopWall)/2 - doorWidth/2, midRightWall, ROOMS.HALLWAY]],

    wallColor: COLORS.WHITE,
    wallTexture: drywall,

    floorTexture: lobbyCarpet,
    ceilingTexture: lobbyCeiling,

    paintings: []
};

var room2 = {
    numWalls: 4,
    walls: [[midRightWall, midTopWall],
            [midRightWall, topWall],
            [rightWall, topWall],
            [rightWall, midTopWall]],
    doors: [[(midTopWall + topWall)/2 - doorWidth/2, midRightWall, ROOMS.HALLWAY]],

    wallColor: COLORS.WHITE,
    wallTexture: drywall,

    floorTexture: lobbyCarpet,
    ceilingTexture: lobbyCeiling,

    paintings: []
};

var room3 = {
    numWalls: 4,
    walls: [[leftWall, midBottomWall],
            [leftWall, topWall],
            [midLeftWall, topWall],
            [midLeftWall, midBottomWall]],
    doors: [[(midBottomWall + topWall)/2 - doorWidth/2, midLeftWall, ROOMS.HALLWAY]],

    wallColor: COLORS.WHITE,
    wallTexture: none,

    floorTexture: lobbyCarpet,
    ceilingTexture: lobbyCeiling,

    paintings: [[midTopWall, leftWall, starryNight],
                [(leftWall + midLeftWall)/2, topWall, monaLisa],
                [(leftWall + midLeftWall)/2, midBottomWall, monaLisa]]
};

var room4 = {
    walls: room1.walls,

};

var room5 = {
    walls: room2.walls,

};

var room6 = {
    walls: room3.walls,
};

var staircase = {
    numWalls: 4,
    walls: [[midLeftWall, topWall],
            [midLeftWall, topStairWall],
            [midRightWall, topStairWall],
            [midRightWall, topWall]],
    doors: [[(midLeftWall + midRightWall)/2 + doorWidth/2, topWall, ROOMS.HALLWAY]],

    wallColor: COLORS.WHITE,
    wallTexture: drywall,

    floorTexture: lobbyCarpet,
    ceilingTexture: lobbyCeiling,

    paintings: []
};

var shrine = {
    numWalls: 4,
    walls: [[leftWall, shrineBottomWall],
            [leftWall, midBottomWall],
            [rightWall, midBottomWall],
            [rightWall, shrineBottomWall]],
    doors: [[(midRightWall + midLeftWall)/2 - doorWidth/2, midBottomWall, ROOMS.HALLWAY]],

    wallColor: COLORS.WHITE,
    wallTexture: drywall,

    floorTexture: lobbyCarpet,
    ceilingTexture: lobbyCeiling,

    paintings: []
};

var rooms = [lobby, hallway, room1, room2, room3, staircase, shrine];
var curRoom = lobby;

function getRoomVertices(room, scaleDown) {
    var verts = [];
    var texVerts = [];
    var walls = room.walls;

    for (var i = 0; i < room.numWalls; i++) {

        //two triangles per wall
        var pointOne = walls[i];
        var pointTwo = walls[0];
        if (i < room.numWalls-1) pointTwo = walls[i+1];
        var wallWidth = Math.abs((pointTwo[0] - pointOne[0])) * textureScale / scaleDown;
        if (i == 0 || i == 2) //vertical walls
            wallWidth = Math.abs((pointTwo[1] - pointOne[1])) * textureScale / scaleDown;
        var heightFactor = wallHeight * textureScale / scaleDown;

        verts.push(vec3(pointOne[0], 0, pointOne[1]));
        texVerts.push(vec2(0, 0));
        verts.push(vec3(pointOne[0], wallHeight, pointOne[1]));
        texVerts.push(vec2(0, 1*heightFactor));
        verts.push(vec3(pointTwo[0], 0, pointTwo[1]));
        texVerts.push(vec2(1*wallWidth, 0));

        verts.push(vec3(pointTwo[0], 0, pointTwo[1]));
        texVerts.push(vec2(1*wallWidth, 0));
        verts.push(vec3(pointTwo[0], wallHeight, pointTwo[1]));
        texVerts.push(vec2(1*wallWidth, 1*heightFactor));
        verts.push(vec3(pointOne[0], wallHeight, pointOne[1]));
        texVerts.push(vec2(0, 1*heightFactor));
    }
    return [verts, texVerts];
}

function getFloorVertices(room, height, scaleDown) {
    var verts = [];
    var texVerts = [];
    var walls = room.walls;
    var roomWidth = (walls[2][0] - walls[0][0]) * textureScale / scaleDown;
    var roomHeight = (walls[2][1] - walls[0][1]) * textureScale / scaleDown;
    if (walls.length != 4) return;

    // two triangles per floor
    verts.push(vec3(walls[0][0], height, walls[0][1]));
    texVerts.push(vec2(0, 0));
    verts.push(vec3(walls[1][0], height, walls[1][1]));
    texVerts.push(vec2(0, 1*roomHeight));
    verts.push(vec3(walls[3][0], height, walls[3][1]));
    texVerts.push(vec2(1*roomWidth, 0));

    verts.push(vec3(walls[1][0], height, walls[1][1]));
    texVerts.push(vec2(0, 1*roomHeight));
    verts.push(vec3(walls[2][0], height, walls[2][1]));
    texVerts.push(vec2(1*roomWidth, 1*roomHeight));
    verts.push(vec3(walls[3][0], height, walls[3][1]));
    texVerts.push(vec2(1*roomWidth, 0));

    return [verts, texVerts];
}

function getWallObjectVertices(objects, room, type) {
    var verts = [];
    var texVerts = [];
    var objectHeight = doorHeight;
    var objectWidth = doorWidth;
    var hangingHeight = 0;

    var walls = room.walls;
    for (var i = 0; i < objects.length; i++) {
        var curObject = objects[i];

        if (type == WALL_OBJECT.PAINTINGS) {
            objectWidth = curObject[2].width;
            objectHeight = curObject[2].height;
            hangingHeight = curObject[2].hangingHeight;
        }

        var pointOne = curObject[0];
        var pointTwo = curObject[0] + objectWidth;

        //two triangles per door
        if (curObject[1] == leftWall || curObject[1] == midLeftWall || curObject[1] == midRightWall || curObject[1] == rightWall) { //door goes north-south
            if (curObject[1] == walls[0][0]) { //on left wall
                var curDepth = curObject[1] + visibleDoorDepth;

                verts.push(vec3(curDepth, hangingHeight, pointOne));
                texVerts.push(vec2(0, 0));
                verts.push(vec3(curDepth, hangingHeight, pointTwo));
                texVerts.push(vec2(-1, 0));
                verts.push(vec3(curDepth, hangingHeight + objectHeight, pointOne));
                texVerts.push(vec2(0, 1));

                verts.push(vec3(curDepth, hangingHeight, pointTwo));
                texVerts.push(vec2(-1, 0));
                verts.push(vec3(curDepth, hangingHeight + objectHeight, pointOne));
                texVerts.push(vec2(0, 1));
                verts.push(vec3(curDepth, hangingHeight + objectHeight, pointTwo));
                texVerts.push(vec2(-1, 1));
            }
            else { //on right wall
                var curDepth = curObject[1] - visibleDoorDepth;

                verts.push(vec3(curDepth, hangingHeight, pointOne));
                texVerts.push(vec2(0, 0));
                verts.push(vec3(curDepth, hangingHeight, pointTwo));
                texVerts.push(vec2(1, 0));
                verts.push(vec3(curDepth, hangingHeight + objectHeight, pointOne));
                texVerts.push(vec2(0, 1));

                verts.push(vec3(curDepth, hangingHeight, pointTwo));
                texVerts.push(vec2(1, 0));
                verts.push(vec3(curDepth, hangingHeight + objectHeight, pointOne));
                texVerts.push(vec2(0, 1));
                verts.push(vec3(curDepth, hangingHeight + objectHeight, pointTwo));
                texVerts.push(vec2(1, 1));
            }
        }
        else { //door goes east-west
            if (curObject[1] != walls[0][1]) { //on bottom wall
                var curDepth = curObject[1] + visibleDoorDepth;

                verts.push(vec3(pointOne, hangingHeight, curDepth));
                texVerts.push(vec2(0, 0));
                verts.push(vec3(pointTwo, hangingHeight, curDepth));
                texVerts.push(vec2(1, 0));
                verts.push(vec3(pointOne, hangingHeight + objectHeight, curDepth));
                texVerts.push(vec2(0, 1));

                verts.push(vec3(pointTwo, hangingHeight, curDepth));
                texVerts.push(vec2(1, 0));
                verts.push(vec3(pointOne, hangingHeight + objectHeight, curDepth));
                texVerts.push(vec2(0, 1));
                verts.push(vec3(pointTwo, hangingHeight + objectHeight, curDepth));
                texVerts.push(vec2(1, 1));
            }
            else { //on top wall
                var curDepth = curObject[1] - visibleDoorDepth;

                verts.push(vec3(pointOne, hangingHeight, curDepth));
                texVerts.push(vec2(0, 0));
                verts.push(vec3(pointTwo, hangingHeight, curDepth));
                texVerts.push(vec2(-1, 0));
                verts.push(vec3(pointOne, hangingHeight + objectHeight, curDepth));
                texVerts.push(vec2(0, 1));

                verts.push(vec3(pointTwo, hangingHeight, curDepth));
                texVerts.push(vec2(-1, 0));
                verts.push(vec3(pointOne, hangingHeight + objectHeight, curDepth));
                texVerts.push(vec2(0, 1));
                verts.push(vec3(pointTwo, hangingHeight + objectHeight, curDepth));
                texVerts.push(vec2(-1, 1));
            }
        }
    }
    return [verts, texVerts];
}