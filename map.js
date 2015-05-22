var globalScale = 1.5;
var textureScale = .05;

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
var bottomWall = 0 * globalScale;
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

    paintings: [[midLeftWall + 5, topWall, monaLisa]]
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
    wallTexture: drywall,

    floorTexture: lobbyCarpet,

    paintings: []
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

function getDoorVertices(room) {
    var verts = [];
    var texVerts = [];
    var doors = room.doors;
    for (var i = 0; i < doors.length; i++) {
        var pointOne = doors[i][0];
        var pointTwo = doors[i][0] + doorWidth;
        //two triangles per door
        if (doors[i][1] == leftWall || doors[i][1] == midLeftWall || doors[i][1] == midRightWall || doors[i][1] == rightWall) { //door goes north-south
            verts.push(vec3(doors[i][1]+visibleDoorDepth, 0, pointOne));
            texVerts.push(vec2(0, 0));
            verts.push(vec3(doors[i][1]+visibleDoorDepth, 0, pointTwo));
            texVerts.push(vec2(-1, 0));
            verts.push(vec3(doors[i][1]+visibleDoorDepth, doorHeight, pointOne));
            texVerts.push(vec2(0, 1));

            verts.push(vec3(doors[i][1]+visibleDoorDepth, 0, pointTwo));
            texVerts.push(vec2(-1, 0));
            verts.push(vec3(doors[i][1]+visibleDoorDepth, doorHeight, pointOne));
            texVerts.push(vec2(0, 1));
            verts.push(vec3(doors[i][1]+visibleDoorDepth, doorHeight, pointTwo));
            texVerts.push(vec2(-1, 1));

            verts.push(vec3(doors[i][1]-visibleDoorDepth, 0, pointOne));
            texVerts.push(vec2(0, 0));
            verts.push(vec3(doors[i][1]-visibleDoorDepth, 0, pointTwo));
            texVerts.push(vec2(1, 0));
            verts.push(vec3(doors[i][1]-visibleDoorDepth, doorHeight, pointOne));
            texVerts.push(vec2(0, 1));

            verts.push(vec3(doors[i][1]-visibleDoorDepth, 0, pointTwo));
            texVerts.push(vec2(1, 0));
            verts.push(vec3(doors[i][1]-visibleDoorDepth, doorHeight, pointOne));
            texVerts.push(vec2(0, 1));
            verts.push(vec3(doors[i][1]-visibleDoorDepth, doorHeight, pointTwo));
            texVerts.push(vec2(1, 1));
        }
        else { //door goes east-west
            verts.push(vec3(pointOne, 0, doors[i][1]+visibleDoorDepth));
            texVerts.push(vec2(0, 0));
            verts.push(vec3(pointTwo, 0, doors[i][1]+visibleDoorDepth));
            texVerts.push(vec2(1, 0));
            verts.push(vec3(pointOne, doorHeight, doors[i][1]+visibleDoorDepth));
            texVerts.push(vec2(0, 1));

            verts.push(vec3(pointTwo, 0, doors[i][1]+visibleDoorDepth));
            texVerts.push(vec2(1, 0));
            verts.push(vec3(pointOne, doorHeight, doors[i][1]+visibleDoorDepth));
            texVerts.push(vec2(0, 1));
            verts.push(vec3(pointTwo, doorHeight, doors[i][1]+visibleDoorDepth));
            texVerts.push(vec2(1, 1));

            verts.push(vec3(pointOne, 0, doors[i][1]-visibleDoorDepth));
            texVerts.push(vec2(0, 0));
            verts.push(vec3(pointTwo, 0, doors[i][1]-visibleDoorDepth));
            texVerts.push(vec2(-1, 0));
            verts.push(vec3(pointOne, doorHeight, doors[i][1]-visibleDoorDepth));
            texVerts.push(vec2(0, 1));

            verts.push(vec3(pointTwo, 0, doors[i][1]-visibleDoorDepth));
            texVerts.push(vec2(-1, 0));
            verts.push(vec3(pointOne, doorHeight, doors[i][1]-visibleDoorDepth));
            texVerts.push(vec2(0, 1));
            verts.push(vec3(pointTwo, doorHeight, doors[i][1]-visibleDoorDepth));
            texVerts.push(vec2(-1, 1));
        }
    }
    return [verts, texVerts];
}

function getFloorVertices(room) {
    var verts = [];
    var texVerts = [];
    var walls = room.walls;
    var roomWidth = (walls[2][0] - walls[0][0]) * textureScale;
    var roomHeight = (walls[2][1] - walls[0][1]) * textureScale;
    if (walls.length != 4) return;

    // two triangles per floor
    verts.push(vec3(walls[0][0], 0, walls[0][1]));
    texVerts.push(vec2(0, 0));
    verts.push(vec3(walls[1][0], 0, walls[1][1]));
    texVerts.push(vec2(0, 1*roomHeight));
    verts.push(vec3(walls[3][0], 0, walls[3][1]));
    texVerts.push(vec2(1*roomWidth, 0));

    verts.push(vec3(walls[1][0], 0, walls[1][1]));
    texVerts.push(vec2(0, 1*roomHeight));
    verts.push(vec3(walls[2][0], 0, walls[2][1]));
    texVerts.push(vec2(1*roomWidth, 1*roomHeight));
    verts.push(vec3(walls[3][0], 0, walls[3][1]));
    texVerts.push(vec2(1*roomWidth, 0));

    return [verts, texVerts];
}

function getPaintingVertices(painting) {
    // [startPoint, whichWall, paintingObject]
    var verts = [];
    var texVerts = [];
    var wall = painting[1];
    var paintingWidth = painting[2].width;
    var paintingHeight = painting[2].height;
    var hangingHeight = painting[2].hangingHeight;

    var pointOne = painting[0];
    var pointTwo = painting[0] + paintingWidth;

    //two triangles per painting
    if (wall == leftWall || wall == midLeftWall || wall == midRightWall || wall == rightWall) { //goes north-south
        verts.push(vec3(wall+visibleDoorDepth, hangingHeight, pointOne));
        texVerts.push(vec2(0, 0));
        verts.push(vec3(wall+visibleDoorDepth, hangingHeight, pointTwo));
        texVerts.push(vec2(-1, 0));
        verts.push(vec3(wall+visibleDoorDepth, hangingHeight + paintingHeight, pointOne));
        texVerts.push(vec2(0, 1));

        verts.push(vec3(wall+visibleDoorDepth, hangingHeight, pointTwo));
        texVerts.push(vec2(-1, 0));
        verts.push(vec3(wall+visibleDoorDepth, paintingHeight, pointOne));
        texVerts.push(vec2(0, 1));
        verts.push(vec3(wall+visibleDoorDepth, paintingHeight, pointTwo));
        texVerts.push(vec2(-1, 1));

        verts.push(vec3(wall-visibleDoorDepth, hangingHeight, pointOne));
        texVerts.push(vec2(0, 0));
        verts.push(vec3(wall-visibleDoorDepth, hangingHeight, pointTwo));
        texVerts.push(vec2(1, 0));
        verts.push(vec3(wall-visibleDoorDepth, hangingHeight + paintingHeight, pointOne));
        texVerts.push(vec2(0, 1));

        verts.push(vec3(wall-visibleDoorDepth, hangingHeight, pointTwo));
        texVerts.push(vec2(1, 0));
        verts.push(vec3(wall-visibleDoorDepth, hangingHeight + paintingHeight, pointOne));
        texVerts.push(vec2(0, 1));
        verts.push(vec3(wall-visibleDoorDepth, hangingHeight + paintingHeight, pointTwo));
        texVerts.push(vec2(1, 1));
    }
    else { //goes east-west
        verts.push(vec3(pointOne, hangingHeight, wall+visibleDoorDepth));
        texVerts.push(vec2(0, 0));
        verts.push(vec3(pointTwo, hangingHeight, wall+visibleDoorDepth));
        texVerts.push(vec2(1, 0));
        verts.push(vec3(pointOne, hangingHeight + paintingHeight, wall+visibleDoorDepth));
        texVerts.push(vec2(0, 1));

        verts.push(vec3(pointTwo, hangingHeight, wall+visibleDoorDepth));
        texVerts.push(vec2(1, 0));
        verts.push(vec3(pointOne, hangingHeight + paintingHeight, wall+visibleDoorDepth));
        texVerts.push(vec2(0, 1));
        verts.push(vec3(pointTwo, hangingHeight + paintingHeight, wall+visibleDoorDepth));
        texVerts.push(vec2(1, 1));

        verts.push(vec3(pointOne, hangingHeight, wall-visibleDoorDepth));
        texVerts.push(vec2(0, 0));
        verts.push(vec3(pointTwo, hangingHeight, wall-visibleDoorDepth));
        texVerts.push(vec2(-1, 0));
        verts.push(vec3(pointOne, hangingHeight + paintingHeight, wall-visibleDoorDepth));
        texVerts.push(vec2(0, 1));

        verts.push(vec3(pointTwo, hangingHeight, wall-visibleDoorDepth));
        texVerts.push(vec2(-1, 0));
        verts.push(vec3(pointOne, hangingHeight + paintingHeight, wall-visibleDoorDepth));
        texVerts.push(vec2(0, 1));
        verts.push(vec3(pointTwo, hangingHeight + paintingHeight, wall-visibleDoorDepth));
        texVerts.push(vec2(-1, 1));
        
    }
    return [verts, texVerts];
}
