// Main
window.onload = function init()
{
    setupCanvas();
    configureWebgl();
    setupShaders();
    requestAnimationFrame(render);
};

function setupCanvas() {
    // Set up canvas, context, etc.
    canvas = document.getElementById("gl-canvas");

    // Multi-browser support for pointer locking
    canvas.requestPointerLock = canvas.requestPointerLock ||
                                canvas.mozRequestPointerLock ||
                                canvas.webkitRequestPointerLock;

    aspect = canvas.width / canvas.height;
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl)
        alert("WebGL isn't available");
}

function configureWebgl() {
    // Initial configuration settings
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
}

function setupShaders() {
    //  Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Data locations
    positionLocation = gl.getAttribLocation(program, "vPosition");
    matrixLocation = gl.getUniformLocation(program, "matrix");
    colorLocation = gl.getUniformLocation(program, "vColor");
    fragTypeLocation = gl.getUniformLocation(program, "fragType");
    vTexCoord = gl.getAttribLocation(program, "vTexCoord");

    // Set up buffer for vertices
    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.vertexAttribPointer(positionLocation, itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

}

function render(now) {
    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Keep timing consistent on all machines
    now *= .001;
    var timeChange = now - then;
    then = now;

    renderRoom(curRoomIndex);
    updateMovement(timeChange);

    requestAnimationFrame(render);
};

function renderRoom(i) {
    var room = rooms[i];
    var verts;

    // Draw walls
    curColor = room.wallColor;
    verts = getRoomVertices(room, room.wallTexture.scale);
    vertices = verts[0];
    texVertices = verts[1];
    if (room.wallTexture.src == TEXTURES.NO_TEXTURE)
        renderCurrentVertices(TEXTURES.NO_TEXTURE);
    else {
        configureTexture(room.wallTexture);
        renderCurrentVertices(TEXTURES.DRAW_TEXTURE);
    }

    // Draw doors
    curColor = COLORS.BLACK;
    verts = getWallObjectVertices(room.doors, room, WALL_OBJECT.DOORS);
    vertices = verts[0];
    texVertices = verts[1];
    configureTexture(door);
    renderCurrentVertices(TEXTURES.DRAW_TEXTURE);

    // Draw floor & ceiling
    curColor = COLORS.FLOOR_COLOR;
    verts = getFloorVertices(room, groundHeight, room.floorTexture.scale);
    vertices = verts[0];
    texVertices = verts[1];
    configureTexture(room.floorTexture);
    renderCurrentVertices(TEXTURES.DRAW_TEXTURE);
    if (renderCeiling) {
        verts = getFloorVertices(room, wallHeight, room.ceilingTexture.scale);
        vertices = verts[0];
        texVertices = verts[1];
        configureTexture(room.ceilingTexture);
        renderCurrentVertices(TEXTURES.DRAW_TEXTURE);
    }
    
    // Draw paintings
    curColor = COLORS.GREEN;
    paintings = room.paintings;
    for (var i = 0; i < paintings.length; i++) {
        verts = getWallObjectVertices([paintings[i]], room, WALL_OBJECT.PAINTINGS);
        vertices = verts[0];
        texVertices = verts[1];
        configureTexture(paintings[i][2]);
        renderCurrentVertices(TEXTURES.DRAW_TEXTURE);
    }

    // Draw light fixture
    curColor = COLORS.YELLOW;
    vertices = getLightVertices(room);
    renderCurrentVertices(TEXTURES.NO_TEXTURE);
}

function renderCurrentVertices(drawTexture) {
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.disableVertexAttribArray(vTexCoord);

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(vertices)), gl.STATIC_DRAW);
    gl.uniform1i(gl.getUniformLocation(program, "isTextured"), false);

    if (drawTexture) {
        gl.enableVertexAttribArray(vTexCoord);
        gl.uniform1i(gl.getUniformLocation(program, "isTextured"), true);
        gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(texVertices)), gl.STATIC_DRAW);
    }

    gl.uniform4fv(colorLocation, curColor);
    applyTransforms(noTranslation, noRotation, noScale);

    gl.drawArrays(gl.TRIANGLES, 0, vertices.length);
}

function applyTransforms(translation, rotation, scaleFactor) {
        // Compute matrices
        var perspectiveMatrix = perspective(fov, aspect, 1, 100);
        var translationMatrix = translate(translation[0], translation[1], translation[2]);
        var rotationMatrix = rotate(rotation, [1,1,1]);
        var scaleMatrix = scale(scaleFactor, scaleFactor, scaleFactor);

        // Extra camera matrices
        var azimMatrix = rotate(azim, [0,1,0]);
        var pitchMatrix = rotate(pitch, [1,0,0]);

        var camTransMatrix = translate(camX, -camY, camZ);

        // Multiply matrices
        matrix = mult(scaleMatrix, rotationMatrix);
        matrix = mult(matrix, translationMatrix);
        matrix = mult(matrix, camTransMatrix);
        matrix = mult(matrix, azimMatrix);
        matrix = mult(matrix, pitchMatrix);
        matrix = mult(matrix, perspectiveMatrix);

        // Send to shader
        gl.uniformMatrix4fv(matrixLocation, false, flatify(matrix));
}

function attemptMove(axis, dist) {
    var walls = curRoom.walls;
    var doors = curRoom.doors;
    // Assuming square room, walls defined in clockwise order from bottom-right corner
    var leftBorder = walls[0][0];
    var rightBorder = walls[2][0];
    var bottomBorder = walls[0][1];
    var topBorder = walls[2][1];

    var newCamX = -camX;
    var newCamZ = -camZ;
    if (axis == 0) {
        newCamX -= Math.sin(radians(azim+90))*dist;
        newCamZ -= Math.cos(radians(azim+90))*dist;
    }
    else {
        newCamX -= Math.sin(radians(azim))*dist;
        newCamZ -= Math.cos(radians(azim))*dist;
    }

    var movingRight = false;
    var movingUp = false;
    var movingLeft = false;
    var movingDown = false;
    if (newCamX > -camX)
        movingRight = true;
    if (newCamZ < -camZ)
        movingUp = true;
    if (newCamX < -camX)
        movingLeft = true;
    if (newCamZ > -camZ)
        movingDown = true;

    // First check if you've entered a door
    for (var i = 0; i < doors.length; i++) {
        var curDoor = doors[i];
        if (doors[i][1] == leftWall || doors[i][1] == midLeftWall || doors[i][1] == midRightWall || doors[i][1] == rightWall) { // Door goes north-south
            if (newCamZ > curDoor[0] && newCamZ < curDoor[0] + doorWidth && Math.abs(curDoor[1] - newCamX) < doorDepth) {
                //console.log("Vert door, wall placement: " + curDoor[1] + " == " + topWall + " || " + bottomWall);
                // Check movement direction so you don't switch back and forth between rooms
                if (curDoor[1] == rightBorder && movingRight || curDoor[1] == leftBorder && !movingRight) {
                    curRoomIndex = curDoor[2];
                    curRoom = rooms[curRoomIndex];
                    movingRight? camX -= 1 : camX += 1;
                    if (!muted)
                        document.getElementById('door.wav').play();
                    // Toggle floor
                    if (curRoomIndex == 5)
                        toggleFloor();
                }
            }
        }
        else { // Door goes east-west
            if (newCamX > curDoor[0] && newCamX < curDoor[0] + doorWidth && 
                Math.abs(curDoor[1] - newCamZ) < doorDepth) {
                //console.log("Hor door, wall placement: " + curDoor[1] + " == " + topBorder + " || " + bottomBorder);
                // Check movement direction so you don't switch back and forth between rooms
                if (curDoor[1] == topBorder && movingUp || curDoor[1] == bottomBorder && movingDown) {
                    curRoomIndex = curDoor[2];
                    curRoom = rooms[curRoomIndex];
                    movingUp? camZ += 1 : camZ -= 1;
                    if (!muted)
                        document.getElementById('door.wav').play();
                    // Toggle floor
                    if (curRoomIndex == 5)
                        toggleFloor();
                }
            }
        }
    }

    if (newCamX > leftBorder + WALL_GAP && newCamX < rightBorder - WALL_GAP && 
        newCamZ < bottomBorder - WALL_GAP && newCamZ > topBorder + WALL_GAP) // Move freely
        transCam(axis, dist);
    else { // Move against the wall at an angle

        var azimOffset = 0;
        if (aHeld || dHeld)
            azimOffset = 90;
        
        if (newCamX < leftBorder + WALL_GAP ||
            newCamX > rightBorder - WALL_GAP) { // left and right walls

            newCamZ = - camZ - Math.cos(radians(azim + azimOffset)) * dist;            
            if (newCamZ < bottomBorder - WALL_GAP && 
                newCamZ > topBorder + WALL_GAP) {
                camZ = - newCamZ;
            }
        }

        else if (newCamZ < topBorder + WALL_GAP ||
            newCamZ > bottomBorder - WALL_GAP) { // top and bottom walls
            newCamX = - camX + Math.cos(radians(azim + 90 + azimOffset)) * dist;            
            if (newCamX < rightBorder - WALL_GAP && 
                newCamX > leftBorder + WALL_GAP) {
                camX = - newCamX;
            }
        }
    }
}

// Convert the given distance to changes in global X and Z coordinates based on the azimuth
function transCam(axis, dist) {
    if (axis == 0) { //X axis
        camX += Math.sin(radians(azim+90))*dist;
        camZ += Math.cos(radians(azim+90))*dist;
    }
    else if (axis == 1) { //Z axis
        camX += Math.sin(radians(azim))*dist;
        camZ += Math.cos(radians(azim))*dist;
    }
}

function cycleRooms() {
    curRoomIndex++;
    if (curRoomIndex == rooms.length)
        curRoomIndex = 0;
    curRoom = rooms[curRoomIndex];
}

function toggleFloor() {
    if (hallway.doors[0][2] == ROOMS.LOBBY)
        hallway.doors[0][2] = ROOMS.SHRINE;
    else
        hallway.doors[0][2] = ROOMS.LOBBY;
}

// From book, added options for the two different cubes to use nearest neighbor or tri-linear mipmapping
function configureTexture(tex) {
    image = document.getElementById(tex.src);
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function moveCallback(e) {
    var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
    var movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
    azim -= 0.2 * movementX;
    if (azim < -360 || azim > 360) {
        azim = 0;
    }
    pitch -= 0.3 * movementY;
    if (pitch > 75)
        pitch = 75;
    if (pitch < -75)
        pitch = -75;
}

function updateMovement(delta) {
    if (wHeld)
        attemptMove(1, MOVEMENT_SPEED * delta);
    if (aHeld)
        attemptMove(0, MOVEMENT_SPEED * delta);
    if (sHeld)
        attemptMove(1, -MOVEMENT_SPEED * delta);
    if (dHeld)
        attemptMove(0, -MOVEMENT_SPEED * delta);
    if (iHeld)
        transCam(1, MOVEMENT_SPEED * delta);
    if (jHeld)
        transCam(0, MOVEMENT_SPEED * delta);
    if (kHeld)
        transCam(1, -MOVEMENT_SPEED * delta);
    if (lHeld)
        transCam(0, -MOVEMENT_SPEED * delta);
    if (rightHeld)
        azim -= 2;
    if (leftHeld)
        azim += 2;
    if (shiftHeld)
        camY -= .25;
    if (spaceHeld)
        camY += .25;
}

document.onkeydown = keyPressed;
document.onkeyup = keyUpHandler;

function keyPressed(e) {
    //console.log(e.keyCode);

    switch(e.keyCode) {
        case 16: //shift
            shiftHeld = true;
            break;
        case 27: // esc
            break;
        case 32: //space
            spaceHeld = true;
            break;
        case 37: //left
            leftHeld = true;
            break;
        case 38: //up
            pitch += 2;
            break;
        case 39: //right
            rightHeld = true;
            break;
        case 40: //down
            pitch -= 2;
            break;
        case 65: //a
            aHeld = true;
            break;
        case 67: //c
            printCamCoords();
            break;
        case 68: //d
            dHeld = true;
            break;
        case 70: //f
            toggleFullscreen();
            break;
        case 72: //h
            break;
        case 73: //i
            iHeld = true;
            break;
        case 74: //j
            jHeld = true;
            break;
        case 75: //k
            kHeld = true;
            break;
        case 76: //l
            lHeld = true;
            break;
        case 77: //m
            muted = !muted;
            break;
        case 78: //n
        case 80: //p
            break;
        case 82: //r
            restart();
            break;
        case 83: //s
            sHeld = true;
            break;
        case 87: //w
            wHeld = true;
            break;
        case 89: //y
    }
}

function keyUpHandler(e) {
    switch (e.keyCode) {
        case 37: //left
            leftHeld = false;
            break;
        case 39: //right
            rightHeld = false;
            break;
        case 65: //a
            aHeld = false;
            break;        
        case 68: //d
            dHeld = false;
            break;
        case 73: //i
            iHeld = false;
            break;
        case 74: //j
            jHeld = false;
            break;
        case 75: //k
            kHeld = false;
            break;
        case 76: //l
            lHeld = false;
            break;
        case 83: //s
            sHeld = false;
            break;
        case 87: //w
            wHeld = false;
            break;
        case 16: //shift
            shiftHeld = false;
            break;
        case 32: //space
            spaceHeld = false;
            break;
    }
}

function restart() {
    fov = initFOV;
    camX = initCamX;
    camY = initCamY;
    camZ = initCamZ;
    azim = initAzim;
    pitch = initPitch;
    curRoomIndex = 0;
    curRoom = rooms[0];
    if (hallway.doors[0][2] == ROOMS.LOBBY)
        hallway.doors[0][2] = ROOMS.SHRINE;
}

function exitFullscreen() {
    if(document.exitFullscreen) {
        document.exitFullscreen();
    } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if(document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
    fullScreenEnabled = false;
    canvas.width = INITIAL_CANVAS_WIDTH;
    canvas.height = INITIAL_CANVAS_HEIGHT;
    aspect = canvas.width / canvas.height;
}

function toggleFullscreen() {
    var canvas = document.getElementById("gl-canvas");

    if (canvas.width == screen.width && canvas.height == screen.height) {
        exitFullscreen();
        document.removeEventListener("mousemove", this.moveCallback, false);
    }
    else {
        canvas.requestPointerLock();
        document.addEventListener("mousemove", this.moveCallback, false);
        
        if(canvas.requestFullscreen)
            canvas.requestFullscreen();
        else if(canvas.mozRequestFullScreen)
            canvas.mozRequestFullScreen();
        else if(canvas.webkitRequestFullscreen)
            canvas.webkitRequestFullscreen();
        else if(canvas.msRequestFullscreen)
            canvas.msRequestFullscreen();

        fullScreenEnabled = true;
        canvas.width = screen.width;
        canvas.height = screen.height;
        aspect = canvas.width / canvas.height;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
}

// ---------------- Debugging -------------------
function printMatrix(description, mat) {
    // Print a 4x4 matrix - for debugging
    console.log(description + ":");
    if (Array.isArray(mat[0])) {
        console.log(mat[0]);
        console.log(mat[1]);
        console.log(mat[2]);
        console.log(mat[3]);
    }
    else {
        var start = 0;
        for (var i = 0; i < 4; i++) {
            console.log("[" + mat[start] + ", " + mat[start+1] + ", " + mat[start+2] + ", " + mat[start+3] + "]");
            start += 4;
        }
    }
}

function printCamCoords() {
    console.log("x: " + camX + ", y: " + camY + ", z: " + camZ);
    console.log("azim: " + azim + ", pitch: " + pitch);
}

function renderAllRooms() {
    for (var i = 0; i < rooms.length; i++)
        renderRoom(i);
}
