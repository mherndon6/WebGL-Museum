
var wallHeight = 10;

var doorWidth = 3;
var doorHeight = 7;

var leftWall = 0;
var midLeftWall = 20;
var midRightWall = 35;
var rightWall = 55;

var shrineBottomWall = 50;
var bottomWall = 0;
var midBottomWall = -15;
var midTopWall = -45
var topWall = -75;
var topStairWall = -85;

/* Room:
numWalls: number of walls in room (should be 4, but 3 or >4 might work by default)
walls: array of points defining four corners of room IN CLOCKWISE ORDER
doors: [startPos, wallPos, horizontal/vertical] specifying door locations
*/

var lobby = {
    numWalls: 4,
    walls: [[midLeftWall, bottomWall],
            [midLeftWall, midBottomWall],
            [midRightWall, midBottomWall],
            [midRightWall, bottomWall]],
    doors: [[(midRightWall + midLeftWall)/2 - doorWidth/2, midBottomWall, 0]]
};

var hallway = {
    numWalls: 4,
    walls: [[midLeftWall, midBottomWall],
            [midLeftWall, topWall],
            [midRightWall, topWall],
            [midRightWall, midBottomWall]]
};

var room1 = {
    numWalls: 4,
    walls: [[midRightWall, midBottomWall],
            [midRightWall, midTopWall],
            [rightWall, midTopWall],
            [rightWall, midBottomWall]]
};

var room2 = {
    numWalls: 4,
    walls: [[midRightWall, midTopWall],
            [midRightWall, topWall],
            [rightWall, topWall],
            [rightWall, midTopWall]]
};

var room3 = {
    numWalls: 4,
    walls: [[leftWall, midBottomWall],
            [leftWall, topWall],
            [midLeftWall, topWall],
            [midLeftWall, midBottomWall]]
};

var staircase = {
    numWalls: 4,
    walls: [[midLeftWall, topWall],
            [midLeftWall, topStairWall],
            [midRightWall, topStairWall],
            [midRightWall, topWall]]
};

var shrine = {
    numWalls: 4,
    walls: [[midLeftWall, shrineBottomWall],
            [leftWall, midBottomWall],
            [rightWall, midBottomWall],
            [midRightWall, shrineBottomWall]]
};

var testRoom = {
    numWalls: 3,
    walls: [[midLeftWall, bottomWall],
            [(midLeftWall+midRightWall)/2, midBottomWall],
            [midRightWall, bottomWall]]
};

var testRoom2 = {
    numWalls: 5,
    walls: [[midLeftWall, bottomWall],
            [leftWall, midBottomWall],
            [(midLeftWall+midRightWall)/2, midTopWall],
            [rightWall, midBottomWall],
            [midRightWall, bottomWall]]
};

var curRoom = -1; //for init
var rooms = [lobby, hallway, room1, room2, room3, staircase, shrine, testRoom, testRoom2];

function getRoomVertices(room) {
    var vertices = [];
    var walls = room.walls;
    for (var i = 0; i < room.numWalls; i++) {
        //two triangles per wall
        var pointOne = walls[i];
        var pointTwo = walls[0];
        if (i < room.numWalls-1) pointTwo = walls[i+1];

        vertices.push(pointOne[0], 0, pointOne[1]);
        vertices.push(pointOne[0], wallHeight, pointOne[1]);
        vertices.push(pointTwo[0], 0, pointTwo[1]);

        vertices.push(pointTwo[0], 0, pointTwo[1]);
        vertices.push(pointTwo[0], wallHeight, pointTwo[1]);
        vertices.push(pointOne[0], wallHeight, pointOne[1]);
    }

    //todo: add floor, ceiling
    return vertices;
}
