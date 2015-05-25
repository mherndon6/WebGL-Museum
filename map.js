/* Room:
numWalls: number of walls in room (should be 4, but 3 or >4 might work by default)
walls: array of points defining four corners of room IN CLOCKWISE ORDER FROM BOTTOMLEFT
doors: [startPos, whichWall, room] specifying door location and room it goes to
lighting: specify lighting type, ambient values, light positions, etc...
paintings: [startPos, whichWall, painting] specifying paintings and locations
*/

var testLight = {
    ambient: vec4(0.2, 0.2, 0.0),
    diffuse: vec4(0.2, 0.2, 0.0),
    specular: vec4(0.2, 0.2, 0.0),
    shininess: 1
};

var lobby = {
    numWalls: 4,
    walls: [[midLeftWall, bottomWall],
            [midLeftWall, midBottomWall],
            [midRightWall, midBottomWall],
            [midRightWall, bottomWall]],
    wallHeight: 10,
    doors: [[(midRightWall + midLeftWall)/2, midBottomWall, ROOMS.HALLWAY]],

    wallColor: COLORS.BLACK,
    wallTexture: none,

    floorTexture: lobbyCarpet,
    ceilingTexture: lobbyCeiling,

    lighting: testLight,

    paintings: []
};

var hallway = {
    numWalls: 4,
    walls: [[midLeftWall, midBottomWall],
            [midLeftWall, topWall],
            [midRightWall, topWall],
            [midRightWall, midBottomWall]],
    wallHeight: 10,
    doors: [[(midRightWall + midLeftWall)/2, midBottomWall, ROOMS.LOBBY],
            [(midBottomWall + topWall)/2, midLeftWall, ROOMS.ROOM3],
            [(midBottomWall + midTopWall)/2, midRightWall, ROOMS.ROOM1],
            [(midTopWall + topWall)/2, midRightWall, ROOMS.ROOM2],
            [(midLeftWall + midRightWall)/2 + doorWidth/2, topWall, ROOMS.STAIRCASE]],

    wallColor: COLORS.WHITE,
    wallTexture: drywall,

    floorTexture: lobbyCarpet,
    ceilingTexture: lobbyCeiling,

    lighting: testLight,

    paintings: [[(midLeftWall + midRightWall)/2 + doorWidth/2, topWall, elevatorSign]]
};

var room1 = {
    numWalls: 4,
    walls: [[midRightWall, midBottomWall],
            [midRightWall, midTopWall],
            [rightWall, midTopWall],
            [rightWall, midBottomWall]],
    wallHeight: 15,
    doors: [[(midBottomWall + midTopWall)/2, midRightWall, ROOMS.HALLWAY]],

    wallColor: COLORS.WHITE,
    wallTexture: marble,
    floorTexture: marbleTile,
    ceilingTexture: marble,

    lighting: testLight,

    song: new Audio("res/room1.mp3"),
    paintings: [[(rightWall + midRightWall)/2, midTopWall, horatii],
                [(midBottomWall + midTopWall)/2, rightWall, napoleon],
                [(rightWall + midRightWall)/2, midBottomWall, wolfe]]
};

var room2 = {
    numWalls: 4,
    walls: [[midRightWall, midTopWall],
            [midRightWall, topWall],
            [rightWall, topWall],
            [rightWall, midTopWall]],
    wallHeight: 10,
    doors: [[(midTopWall + topWall)/2, midRightWall, ROOMS.HALLWAY]],

    wallColor: COLORS.WHITE,
    wallTexture: wood,

    floorTexture: woodFloor,
    ceilingTexture: wood,

    lighting: testLight,

    song: new Audio("res/room2.mp3"),
    paintings: [[(rightWall + midRightWall)/2, topWall, ulysses],
                [(topWall + midTopWall)/2, rightWall, moonlitLandscape],
                [(rightWall + midRightWall)/2, midTopWall, xp]]
};

var room3 = {
    numWalls: 4,
    walls: [[leftWall, midBottomWall],
            [leftWall, topWall],
            [midLeftWall, topWall],
            [midLeftWall, midBottomWall]],
    wallHeight: 10,
    doors: [[(midBottomWall + topWall)/2, midLeftWall, ROOMS.HALLWAY]],

    wallColor: COLORS.WHITE,
    wallTexture: marble,

    floorTexture: marbleTile,
    ceilingTexture: marble,

    lighting: testLight,

    song: new Audio("res/room3.mp3"),
    paintings: [[(leftWall + midLeftWall)/2, midBottomWall, sundayAfternoon],
                [(midBottomWall + midTopWall)/2, leftWall, pearlEarring],
                [midTopWall, leftWall, ecceHomo],
                [(midTopWall + topWall)/2, leftWall, monaLisa],
                [(leftWall + midLeftWall)/2, topWall, starryNight]]
};

var room4 = {
    numWalls: room1.numWalls,
    walls: room1.walls,
    wallHeight: room1.wallHeight,
    doors: room1.doors,

    wallColor: COLORS.GREEN,
    wallTexture: wood,

    floorTexture: woodFloor,
    ceilingTexture: wood,

    lighting: testLight,

    song: new Audio("res/room4.mp3"),
    paintings: [[(rightWall + midRightWall)/2, midTopWall, sunset],
                [(midBottomWall + midTopWall)/2, rightWall, hetSteen],
                [(rightWall + midRightWall)/2, midBottomWall, sleighRide]]
};

var room5 = {
    numWalls: room2.numWalls,
    walls: room2.walls,
    wallHeight: room2.wallHeight,
    doors: room2.doors,
    
    wallColor: COLORS.WHITE,
    wallTexture: drywall,

    floorTexture: drywall,
    ceilingTexture: lobbyCeiling,

    lighting: testLight,

    song: new Audio("res/room5.mp3"),
    paintings: [[(rightWall + midRightWall)/2, topWall, nocturne],
                [(topWall + midTopWall)/2, rightWall, phaeton],
                [(rightWall + midRightWall)/2, midTopWall, impressionSunrise]]
};

var room6 = {
    numWalls: room3.numWalls,
    walls: room3.walls,
    wallHeight: 25,
    doors: room3.doors,

    wallColor: COLORS.WHITE,
    wallTexture: drywall,

    floorTexture: drywall,
    ceilingTexture: lobbyCarpet,

    lighting: testLight,

    song: new Audio("res/room6.mp3"),
    paintings: [[(leftWall + midLeftWall)/2, midBottomWall, weepingWoman],
                [(midBottomWall + midTopWall)/2 - 10, leftWall, snowStorm],
                [(midTopWall + topWall)/2 + 10, leftWall, scream],
                [(leftWall + midLeftWall)/2, topWall, pompeii]]
};

var staircase = {
    numWalls: 4,
    walls: [[midLeftWall, topWall],
            [midLeftWall, topStairWall],
            [midRightWall, topStairWall],
            [midRightWall, topWall]],
    wallHeight: 10,
    doors: [[(midLeftWall + midRightWall)/2 + doorWidth/2, topWall, ROOMS.HALLWAY]],

    wallColor: COLORS.WHITE,
    wallTexture: drywall,

    floorTexture: lobbyCarpet,
    ceilingTexture: lobbyCeiling,

    lighting: testLight,

    paintings: [[(midLeftWall + midRightWall)/2, topStairWall, floor1]]
};

var shrine = {
    numWalls: 4,
    walls: [[leftWall - 50000, shrineBottomWall],
            [leftWall - 50000, midBottomWall],
            [rightWall + 50000, midBottomWall],
            [rightWall + 50000, shrineBottomWall]],
    wallHeight: 7500,
    doors: [[(midRightWall + midLeftWall)/2, midBottomWall, ROOMS.HALLWAY]],

    wallColor: COLORS.WHITE,
    wallTexture: drywall,

    floorTexture: lobbyCarpet,
    ceilingTexture: lobbyCeiling,

    lighting: testLight,

    paintings: [[(midLeftWall + midRightWall)/2, shrineBottomWall - 250, scott]]
};

var rooms = [lobby, hallway, room1, room2, room3, staircase, 
             room4, room5, room6, shrine];
var curRoom = lobby;

function getRoomVertices(room, scaleDown) {
    var verts = [];
    var norms = [];
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

        var normal = vec3(0, 0, -1);
        if (i == 0 || i == 2) //vertical walls
            normal = vec3(1, 0, 0);
        norms.push(normal, normal, normal, normal, normal, normal);

    }
    return [verts, norms, texVerts];
}

function getFloorVertices(room, height, scaleDown) {
    var verts = [];
    var norms = [];
    var texVerts = [];
    var walls = room.walls;
    var roomWidth = (walls[2][0] - walls[0][0]) * textureScale / scaleDown;
    var roomLength = (walls[2][1] - walls[0][1]) * textureScale / scaleDown;
    if (walls.length != 4) return;

    // two triangles per floor
    verts.push(vec3(walls[0][0], height, walls[0][1]));
    texVerts.push(vec2(0, 0));
    verts.push(vec3(walls[1][0], height, walls[1][1]));
    texVerts.push(vec2(0, 1*roomLength));
    verts.push(vec3(walls[3][0], height, walls[3][1]));
    texVerts.push(vec2(1*roomWidth, 0));

    verts.push(vec3(walls[1][0], height, walls[1][1]));
    texVerts.push(vec2(0, 1*roomLength));
    verts.push(vec3(walls[2][0], height, walls[2][1]));
    texVerts.push(vec2(1*roomWidth, 1*roomLength));
    verts.push(vec3(walls[3][0], height, walls[3][1]));
    texVerts.push(vec2(1*roomWidth, 0));

    // Vertical normals for all floors
    var normal = vec3(0, 1, 0);
    norms.push(normal, normal, normal, normal, normal, normal);

    return [verts, norms, texVerts];
}

function getLightVertices(room) {
    var verts = [];
    var walls = room.walls;
    var leftBorder = walls[0][0];
    var rightBorder = walls[2][0];
    var bottomBorder = walls[0][1];
    var topBorder = walls[2][1];

    var lightX = (leftBorder + rightBorder)/2 - lightWidth/2;
    var lightZ = (bottomBorder + topBorder)/2 - lightWidth/2;

    // just a box for now
    verts.push(vec3(lightX, lightHeight, lightZ));
    verts.push(vec3(lightX, lightHeight, lightZ + lightWidth));
    verts.push(vec3(lightX + lightWidth, lightHeight, lightZ));
    verts.push(vec3(lightX, lightHeight, lightZ + lightWidth));
    verts.push(vec3(lightX + lightWidth, lightHeight, lightZ));
    verts.push(vec3(lightX + lightWidth, lightHeight, lightZ + lightWidth));

    verts.push(vec3(lightX, lightHeight, lightZ));
    verts.push(vec3(lightX, wallHeight, lightZ));
    verts.push(vec3(lightX + lightWidth, lightHeight, lightZ));
    verts.push(vec3(lightX + lightWidth, wallHeight, lightZ));
    verts.push(vec3(lightX, wallHeight, lightZ));
    verts.push(vec3(lightX + lightWidth, lightHeight, lightZ));

    verts.push(vec3(lightX, lightHeight, lightZ + lightWidth));
    verts.push(vec3(lightX, wallHeight, lightZ + lightWidth));
    verts.push(vec3(lightX + lightWidth, lightHeight, lightZ + lightWidth));
    verts.push(vec3(lightX + lightWidth, wallHeight, lightZ + lightWidth));
    verts.push(vec3(lightX, wallHeight, lightZ + lightWidth));
    verts.push(vec3(lightX + lightWidth, lightHeight, lightZ + lightWidth));

    verts.push(vec3(lightX, lightHeight, lightZ));
    verts.push(vec3(lightX, lightHeight, lightZ + lightWidth));
    verts.push(vec3(lightX, wallHeight, lightZ + lightWidth));
    verts.push(vec3(lightX, lightHeight, lightZ));
    verts.push(vec3(lightX, wallHeight, lightZ));
    verts.push(vec3(lightX, wallHeight, lightZ + lightWidth));

    verts.push(vec3(lightX + lightWidth, lightHeight, lightZ));
    verts.push(vec3(lightX + lightWidth, lightHeight, lightZ + lightWidth));
    verts.push(vec3(lightX + lightWidth, wallHeight, lightZ + lightWidth));
    verts.push(vec3(lightX + lightWidth, lightHeight, lightZ));
    verts.push(vec3(lightX + lightWidth, wallHeight, lightZ));
    verts.push(vec3(lightX + lightWidth, wallHeight, lightZ + lightWidth));

    return verts;
}

function getWallObjectVertices(objects, room, type) {
    var verts = [];
    var norms = [];
    var texVerts = [];
    var objectHeight = doorHeight;
    var objectWidth = doorWidth;
    var hangingHeight = 0;

    var walls = room.walls;
    for (var i = 0; i < objects.length; i++) {
        var curObject = objects[i];

        if (type == WALL_OBJECT.PAINTINGS) {
            objectWidth = curObject[2].width * INCHES_SCALE;
            objectHeight = curObject[2].height * INCHES_SCALE;
            hangingHeight = curObject[2].hangingHeight;
        }

        var pointOne = curObject[0] - objectWidth/2;
        var pointTwo = curObject[0] + objectWidth/2;

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

                var normal = vec3(1, 0, 0);
                norms.push(normal, normal, normal, normal, normal, normal);
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

                var normal = vec3(-1, 0, 0);
                norms.push(normal, normal, normal, normal, normal, normal);
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

                var normal = vec3(0, 0, -1);
                norms.push(normal, normal, normal, normal, normal, normal);
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

                var normal = vec3(0, 0, 1);
                norms.push(normal, normal, normal, normal, normal, normal);
            }
        }
    }
    return [verts, norms, texVerts];
}
