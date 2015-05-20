var globalScale = 1.5;

var wallHeight = 10 * globalScale;

var doorWidth = 4 * globalScale;
var doorHeight = 7 * globalScale;
var doorDepth = 0.5;

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
paintings: [painting, startPos, whichWall] specifying paintings and locations
*/

var lobby = {
    numWalls: 4,
    walls: [[midLeftWall, bottomWall],
            [midLeftWall, midBottomWall],
            [midRightWall, midBottomWall],
            [midRightWall, bottomWall]],
    doors: [[(midRightWall + midLeftWall)/2 - doorWidth/2, midBottomWall, ROOMS.HALLWAY]],

    wallColor: COLORS.WHITE,

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

    paintings: []
};

var room1 = {
    numWalls: 4,
    walls: [[midRightWall, midBottomWall],
            [midRightWall, midTopWall],
            [rightWall, midTopWall],
            [rightWall, midBottomWall]],
    doors: [[(midBottomWall + midTopWall)/2 - doorWidth/2, midRightWall, ROOMS.HALLWAY]],

    wallColor: COLORS.WHITE,

    paintings: []
};

var room2 = {
    numWalls: 4,
    walls: [[midRightWall, midTopWall],
            [midRightWall, topWall],
            [rightWall, topWall],
            [rightWall, midTopWall]],
    doors: [[(midTopWall + topWall)/2 - doorWidth/2, midRightWall, ROOMS.HALLWAY]],

    wallColor: COLORS.YELLOW,

    paintings: []
};

var room3 = {
    numWalls: 4,
    walls: [[leftWall, midBottomWall],
            [leftWall, topWall],
            [midLeftWall, topWall],
            [midLeftWall, midBottomWall]],
    doors: [[(midBottomWall + topWall)/2 - doorWidth/2, midLeftWall, ROOMS.HALLWAY]],

    wallColor: COLORS.RED,

    paintings: []
};

var staircase = {
    numWalls: 4,
    walls: [[midLeftWall, topWall],
            [midLeftWall, topStairWall],
            [midRightWall, topStairWall],
            [midRightWall, topWall]],
    doors: [[(midLeftWall + midRightWall)/2 + doorWidth/2, topWall, ROOMS.HALLWAY]],

    wallColor: COLORS.GREEN,

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

    paintings: []
};

var rooms = [lobby, hallway, room1, room2, room3, staircase, shrine];
var curRoom = lobby;

function getRoomVertices(room) {
    var verts = [];
    var walls = room.walls;
    for (var i = 0; i < room.numWalls; i++) {
        //two triangles per wall
        var pointOne = walls[i];
        var pointTwo = walls[0];
        if (i < room.numWalls-1) pointTwo = walls[i+1];

        verts.push(pointOne[0], 0, pointOne[1]);
        verts.push(pointOne[0], wallHeight, pointOne[1]);
        verts.push(pointTwo[0], 0, pointTwo[1]);

        verts.push(pointTwo[0], 0, pointTwo[1]);
        verts.push(pointTwo[0], wallHeight, pointTwo[1]);
        verts.push(pointOne[0], wallHeight, pointOne[1]);
    }

    return verts;
}
function getDoorVertices(room) {
    var verts = [];
    var doors = room.doors;
    for (var i = 0; i < doors.length; i++) {
        var pointOne = doors[i][0];
        var pointTwo = doors[i][0] + doorWidth;
        //two triangles per door
        if (doors[i][1] == leftWall || doors[i][1] == midLeftWall || doors[i][1] == midRightWall || doors[i][1] == rightWall) { //door goes north-south
            verts.push(doors[i][1]+doorDepth, 0, pointOne);
            verts.push(doors[i][1]+doorDepth, 0, pointTwo);
            verts.push(doors[i][1]+doorDepth, doorHeight, pointOne);

            verts.push(doors[i][1]+doorDepth, 0, pointTwo);
            verts.push(doors[i][1]+doorDepth, doorHeight, pointOne);
            verts.push(doors[i][1]+doorDepth, doorHeight, pointTwo);

            verts.push(doors[i][1]-doorDepth, 0, pointOne);
            verts.push(doors[i][1]-doorDepth, 0, pointTwo);
            verts.push(doors[i][1]-doorDepth, doorHeight, pointOne);

            verts.push(doors[i][1]-doorDepth, 0, pointTwo);
            verts.push(doors[i][1]-doorDepth, doorHeight, pointOne);
            verts.push(doors[i][1]-doorDepth, doorHeight, pointTwo);
        }
        else { //door goes east-west
            verts.push(pointOne, 0, doors[i][1]+doorDepth);
            verts.push(pointTwo, 0, doors[i][1]+doorDepth);
            verts.push(pointOne, doorHeight, doors[i][1]+doorDepth);

            verts.push(pointTwo, 0, doors[i][1]+doorDepth);
            verts.push(pointOne, doorHeight, doors[i][1]+doorDepth);
            verts.push(pointTwo, doorHeight, doors[i][1]+doorDepth);

            verts.push(pointOne, 0, doors[i][1]-doorDepth);
            verts.push(pointTwo, 0, doors[i][1]-doorDepth);
            verts.push(pointOne, doorHeight, doors[i][1]-doorDepth);

            verts.push(pointTwo, 0, doors[i][1]-doorDepth);
            verts.push(pointOne, doorHeight, doors[i][1]-doorDepth);
            verts.push(pointTwo, doorHeight, doors[i][1]-doorDepth);
        }
    }
    return verts;
}

function getFloorVertices(room) {
    var verts = [];
    var walls = room.walls;
    if (walls.length != 4) return;

    // two triangles per floor
    verts.push(walls[0][0], 0, walls[0][1]);
    verts.push(walls[1][0], 0, walls[1][1]);
    verts.push(walls[3][0], 0, walls[3][1]);

    verts.push(walls[1][0], 0, walls[1][1]);
    verts.push(walls[2][0], 0, walls[2][1]);
    verts.push(walls[3][0], 0, walls[3][1]);

    return verts;
}
