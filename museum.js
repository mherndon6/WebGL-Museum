// Main
window.onload = function init()
{
    setupCanvas();
    configureWebgl();
    setupShaders();
    initCube();
    requestAnimationFrame(render);
};

function setupCanvas() {
    // Set up canvas, context, etc.
    canvas = document.getElementById("gl-canvas");
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

    // Vertex data locations
    positionLocation = gl.getAttribLocation(program, "vPosition");
    matrixLocation = gl.getUniformLocation(program, "matrix");
    colorLocation = gl.getUniformLocation(program, "vColor");
    fragTypeLocation = gl.getUniformLocation(program, "fragType");
}

function initCube() {
    // Set up buffer for vertices
    var cubeVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, itemSize, gl.FLOAT, false, 0, 0);
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
    // Draw walls
    curColor = rooms[i].wallColor;
    vertices = getRoomVertices(rooms[i]);   
    renderCurrentVertices();

    // Draw doors
    curColor = COLORS.BLACK;
    vertices = getDoorVertices(rooms[i]);
    renderCurrentVertices();

    // Draw floor
    curColor = COLORS.FLOOR_COLOR;
    vertices = getFloorVertices(rooms[i]);
    renderCurrentVertices();

}
function renderCurrentVertices() {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.uniform4fv(colorLocation, curColor);
    applyTransforms(noTranslation, noRotation, noScale);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length/3);
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

function updateMovement(delta) {
    if (wHeld) {
        attemptMove(1, MOVEMENT_SPEED * delta);
    }
    if (aHeld) {
        attemptMove(0, MOVEMENT_SPEED * delta);
    }
    if (sHeld) {
        attemptMove(1, -MOVEMENT_SPEED * delta);
    }
    if (dHeld) {
        attemptMove(0, - MOVEMENT_SPEED * delta);
    }
}

// ---------------- Other Stuff -------------------

document.onkeydown = keyPressed;
document.onkeyup = keyUpHandler;

function keyPressed(e) {
    console.log(e.keyCode);

    switch(e.keyCode) {
        case 16: //shift
            camY -= .25;
            break;
        case 27: // esc
            break;
        case 32: //space
            camY += .25;
            break;
        case 37: //left
            azim += 2;
            break;
        case 38: //up
            pitch += 2;
            break;
        case 39: //right
            azim -= 2;
            break;
        case 40: //down
            pitch -= 2;
            break;
        case 65: //a
            aHeld = true;
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
            transCam(1, .5);
            break;
        case 74: //j
            transCam(0, .5);
            break;
        case 75: //k
            transCam(1, -.5);
            break;
        case 76: //l
            transCam(0, -.5);
            break;
        case 78: //n
        case 80: //p
            break;
        case 82: //r
            fov = initFOV;
            camX = initCamX;
            camY = initCamY;
            camZ = initCamZ;
            azim = initAzim;
            pitch = initPitch;
            break;
        case 83: //s
            sHeld = true;
            break;
        case 87: //w
            wHeld = true;
            break;
        case 89: //y
    }
    printCamCoords();
}

function keyUpHandler(e) {
    switch (e.keyCode) {
        case 65: //a
            aHeld = false;
            break;        
        case 68: //d
            dHeld = false;
            break;
        case 83: //s
            sHeld = false;
            break;
        case 87: //w
            wHeld = false;
            break;
    }
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
        document.addEventListener("fullscreenchange", fullScreenChange, false);
        document.addEventListener("mozfullscreenchange", fullScreenChange, false);
        document.addEventListener("webkitfullscreenchange", fullScreenChange, false);

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

function moveCallback(e) {
    var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
    var movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
    azim -= 0.2 * movementX;
    pitch -= 0.3 * movementY;
    if (pitch > 45)
        pitch = 45;
    if (pitch < -45)
        pitch = -45;
}

function fullScreenChange() {
    if (document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled) {
        console.log("enter");
    }
    else {
        console.log("exit");
        exitFullscreen();
    }
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

    console.log(movingRight + " " + movingUp + " " + movingLeft + " " + movingDown);

    // First check if you've entered a door
    for (var i = 0; i < doors.length; i++) {
        var curDoor = doors[i];
        if (doors[i][1] == leftWall || doors[i][1] == midLeftWall || doors[i][1] == midRightWall || doors[i][1] == rightWall) { // Door goes north-south
            if (newCamZ > curDoor[0] && newCamZ < curDoor[0] + doorWidth && Math.abs(curDoor[1] - newCamX) < doorDepth) {
                console.log("Vert door, wall placement: " + curDoor[1] + " == " + topWall + " || " + bottomWall);
                // Check movement direction so you don't switch back and forth between rooms
                if (curDoor[1] == rightBorder && movingRight || curDoor[1] == leftBorder && !movingRight) {
                    curRoomIndex = curDoor[2];
                    curRoom = rooms[curRoomIndex];
                    movingRight? camX -= 1 : camX += 1;
                }
            }
        }
        else { // Door goes east-west
            if (newCamX > curDoor[0] && newCamX < curDoor[0] + doorWidth && Math.abs(curDoor[1] - newCamZ) < doorDepth) {
                console.log("Hor door, wall placement: " + curDoor[1] + " == " + topBorder + " || " + bottomBorder);
                // Check movement direction so you don't switch back and forth between rooms
                if (curDoor[1] == topBorder && movingUp || curDoor[1] == bottomBorder && movingDown) {
                    curRoomIndex = curDoor[2];
                    curRoom = rooms[curRoomIndex];
                    movingUp? camZ += 1 : camZ -= 1;
                }
            }
        }
    }

    //console.log("Bounds: Hor " + leftBorder + " to " + rightBorder + " and Vert " + topBorder + " to " + bottomBorder);
    //console.log("Trying to go to: " + newCamX + ", " + newCamZ);
    if (newCamX > leftBorder && newCamX < rightBorder && newCamZ < bottomBorder && newCamZ > topBorder)
        transCam(axis, dist);
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
