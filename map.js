var globalScale = 1;

var wallHeight = 10 * globalScale;

var doorWidth = 4 * globalScale;
var doorHeight = 7 * globalScale;

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
walls: array of points defining four corners of room IN CLOCKWISE ORDER
doors: [startPos, whichWall] specifying door locations
*/

var lobby = {
    numWalls: 4,
    walls: [[midLeftWall, bottomWall],
            [midLeftWall, midBottomWall],
            [midRightWall, midBottomWall],
            [midRightWall, bottomWall]],
    doors: [[(midRightWall + midLeftWall)/2 - doorWidth/2, midBottomWall]]
};

var hallway = {
    numWalls: 4,
    walls: [[midLeftWall, midBottomWall],
            [midLeftWall, topWall],
            [midRightWall, topWall],
            [midRightWall, midBottomWall]],
    doors: [[(midRightWall + midLeftWall)/2 - doorWidth/2, midBottomWall],
            [(midBottomWall + topWall)/2 - doorWidth/2, midLeftWall],
            [(midBottomWall + midTopWall)/2 - doorWidth/2, midRightWall],
            [(midTopWall + topWall)/2 - doorWidth/2, midRightWall],
            [(midLeftWall + midRightWall)/2 + doorWidth/2, topWall]]
};

var room1 = {
    numWalls: 4,
    walls: [[midRightWall, midBottomWall],
            [midRightWall, midTopWall],
            [rightWall, midTopWall],
            [rightWall, midBottomWall]],
    doors: [[(midBottomWall + midTopWall)/2 - doorWidth/2, midRightWall]]
};

var room2 = {
    numWalls: 4,
    walls: [[midRightWall, midTopWall],
            [midRightWall, topWall],
            [rightWall, topWall],
            [rightWall, midTopWall]],
    doors: [[(midTopWall + topWall)/2 - doorWidth/2, midRightWall]]
};

var room3 = {
    numWalls: 4,
    walls: [[leftWall, midBottomWall],
            [leftWall, topWall],
            [midLeftWall, topWall],
            [midLeftWall, midBottomWall]],
    doors: [[(midBottomWall + topWall)/2 - doorWidth/2, midLeftWall]]
};

var staircase = {
    numWalls: 4,
    walls: [[midLeftWall, topWall],
            [midLeftWall, topStairWall],
            [midRightWall, topStairWall],
            [midRightWall, topWall]],
    doors: [[(midLeftWall + midRightWall)/2 + doorWidth/2, topWall]]
};

var shrine = {
    numWalls: 4,
    walls: [[midLeftWall, shrineBottomWall],
            [leftWall, midBottomWall],
            [rightWall, midBottomWall],
            [midRightWall, shrineBottomWall]],
    doors: [[(midRightWall + midLeftWall)/2 - doorWidth/2, midBottomWall]]
};

var testRoom = {
    numWalls: 3,
    walls: [[midLeftWall, bottomWall],
            [(midLeftWall + midRightWall)/2, midBottomWall],
            [midRightWall, bottomWall]],
    doors: []
};

var testRoom2 = {
    numWalls: 5,
    walls: [[midLeftWall, bottomWall],
            [leftWall, midBottomWall],
            [(midLeftWall + midRightWall)/2, midTopWall],
            [rightWall, midBottomWall],
            [midRightWall, bottomWall]],
    doors: []
};

var rooms = [lobby, hallway, room1, room2, room3, staircase, shrine, testRoom, testRoom2];

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

    //todo: add floor, ceiling
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
            verts.push(doors[i][1], 0, pointOne);
            verts.push(doors[i][1], 0, pointTwo);
            verts.push(doors[i][1], doorHeight, pointOne);

            verts.push(doors[i][1], 0, pointTwo);
            verts.push(doors[i][1], doorHeight, pointOne);
            verts.push(doors[i][1], doorHeight, pointTwo);
        }
        else { //door goes east-west
            verts.push(pointOne, 0, doors[i][1]);
            verts.push(pointTwo, 0, doors[i][1]);
            verts.push(pointOne, doorHeight, doors[i][1]);

            verts.push(pointTwo, 0, doors[i][1]);
            verts.push(pointOne, doorHeight, doors[i][1]);
            verts.push(pointTwo, doorHeight, doors[i][1]);
        }
    }
    return verts;
}