// Main
function bodyLoaded() {
    setupCanvas();
    configureWebgl();
    setupShaders();
    restart();

    requestAnimationFrame(render);
}

function setupCanvas() {
    // Set up canvas, context, etc.
    canvas = document.getElementById("gl-canvas");

    // Multi-browser support for pointer locking
    canvas.requestPointerLock = canvas.requestPointerLock ||
                                canvas.mozRequestPointerLock ||
                                canvas.webkitRequestPointerLock ||
                                canvas.msRequestPointerLock;

    canvas.requestFullscreen = canvas.requestFullscreen ||
                               canvas.mozRequestFullScreen ||
                               canvas.webkitRequestFullscreen ||
                               canvas.msRequestFullscreen;

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
    gl.bindAttribLocation(program, 0, "vPosition");
    gl.bindAttribLocation(program, 1, "vNormal");
    gl.bindAttribLocation(program, 2, "vTexCoord");

    positionLocation = gl.getAttribLocation(program, "vPosition");
    normalLocation = gl.getAttribLocation(program, "vNormal");
    vTexCoord = gl.getAttribLocation(program, "vTexCoord");
    matrixLocation = gl.getUniformLocation(program, "matrix");
    vTexCoord = gl.getAttribLocation(program, "vTexCoord");

    gl.uniform4fv(gl.getUniformLocation(program, "vColor"), vec4(1.0, 1.0, 0.0, 1.0));
    gl.uniform1i(gl.getUniformLocation(program, "isLit"), true);

    // Set up buffer for vertices
    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.vertexAttribPointer(positionLocation, itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    // Set up buffer for normals
    nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.vertexAttribPointer(normalLocation, itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLocation);

    // Set up buffer for texture vertices
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
    var deltaTime = now - then;
    then = now;

    frameCount++;
    //if (frameCount % 30 == 0)
        //console.log("FPS: " + frameCount/now);

    renderRoom(deltaTime);
    updateMovement(deltaTime);

    // Fade previous song out
    if (prevSong) {
        var newVol = prevSong.volume - deltaTime * 0.25;
        if (newVol <= 0) { 
            prevSong.pause(); 
            prevSong = null; 
        }
        else { prevSong.volume = newVol; }        
    }

    // Fade current song in
    if (curRoom.song) {
        var newVol = curRoom.song.volume + deltaTime * 0.10;
        if (newVol > 1) { curRoom.song.volume = 1.0; }
        else { curRoom.song.volume = newVol; }
    }

    requestAnimationFrame(render);
}

function renderRoom(deltaTime) {
    var room = rooms[curRoomIndex];
    var verts;

    // Hijack control when player enters shrine
    if (curRoomIndex == ROOMS.SHRINE && !enteredShrine) {
        camX = initCamX;
        camY = initCamY;
        camZ = initCamZ;
        pitch = -10;
        azim = 180;
        allowControl = false;
        enteredShrine = true;
    }
    if (enteredShrine)
        timerCheck(deltaTime);

    if (curRoomIndex == ROOMS.SHRINE)
        setLighting(false);
    else
        setLighting(true);

    // Draw walls
    if (!room.hasRendered)
        room.verts["walls"] = getRoomVertices(room, room.wallTexture.scale);
    vertices = room.verts["walls"][0];
    normals = room.verts["walls"][1];
    texVertices = room.verts["walls"][2];
    if (room.wallTexture.src == SETTINGS.NO_TEXTURE)
        renderCurrentVertices(SETTINGS.NO_TEXTURE, SETTINGS.DRAW_LIGHT);
    else {
        configureTexture(room.wallTexture);
        renderCurrentVertices(SETTINGS.DRAW_TEXTURE, SETTINGS.DRAW_LIGHT);
    }

    // Draw doors
    if (!room.hasRendered)
        room.verts["doors"] = getWallObjectVertices(room.doors, room, WALL_OBJECT.DOORS);
    vertices = room.verts["doors"][0];
    normals = room.verts["doors"][1];
    texVertices = room.verts["doors"][2];
    configureTexture(door);
    renderCurrentVertices(SETTINGS.DRAW_TEXTURE, SETTINGS.DRAW_LIGHT);

    // Draw floor & ceiling
    if (!room.hasRendered)
        room.verts["floor"] = getFloorVertices(room, groundHeight, room.floorTexture.scale);
    vertices = room.verts["floor"][0];
    normals = room.verts["floor"][1];
    texVertices = room.verts["floor"][2];
    configureTexture(room.floorTexture);
    renderCurrentVertices(SETTINGS.DRAW_TEXTURE, SETTINGS.DRAW_LIGHT);
    if (!room.hasRendered)
        room.verts["ceiling"] = getFloorVertices(room, wallHeight, room.ceilingTexture.scale);
    if (renderCeiling) {
        vertices = room.verts["ceiling"][0];
        normals = room.verts["ceiling"][1]
        texVertices = room.verts["ceiling"][2];
        configureTexture(room.ceilingTexture);
        renderCurrentVertices(SETTINGS.DRAW_TEXTURE, SETTINGS.DRAW_LIGHT);
    }
    
    // Draw paintings
    paintings = room.paintings;
    for (var i = 0; i < paintings.length; i++) {
        verts = getWallObjectVertices([paintings[i]], room, WALL_OBJECT.PAINTINGS);
        vertices = verts[0];
        normals = verts[1];
        texVertices = verts[2];
        configureTexture(paintings[i][2]);
        renderCurrentVertices(SETTINGS.DRAW_TEXTURE, SETTINGS.DRAW_LIGHT);
    }

    gl.uniform1i(gl.getUniformLocation(program, "isLit"), false);
    // Draw museum goer, only in exhibit rooms
    if (curRoomIndex != ROOMS.LOBBY && curRoomIndex != ROOMS.HALLWAY && 
    curRoomIndex != ROOMS.SHRINE && curRoomIndex != ROOMS.STAIRCASE) {
        var scottCoords = getScottPosition(deltaTime);
        scottX = scottCoords[0];
        scottZ = scottCoords[1];
        checkScottCollision();
        // Body
        verts = getPersonVertices(0);
        vertices = verts[0];
        normals = verts[1];
        texVertices = verts[2];
        configureTexture(plaid);
        renderCurrentVertices(SETTINGS.DRAW_TEXTURE, SETTINGS.DRAW_LIGHT);
        // Head
        verts = getPersonVertices(1);
        vertices = verts[0];
        normals = verts[1];
        texVertices = verts[2];
        configureTexture(thinkingScott);
        renderCurrentVertices(SETTINGS.DRAW_TEXTURE, SETTINGS.DRAW_LIGHT);
    }

    // Draw light fixture(s)
    verts = getLightVertices(room, numLights);
    vertices = verts[0];
    normals = verts[1];
    texVertices = verts[2];
    configureTexture(lightFixture);
    renderCurrentVertices(SETTINGS.DRAW_TEXTURE, SETTINGS.DRAW_LIGHT);

    if (!room.hasRendered)
        room.hasRendered = true;
}

function renderCurrentVertices(drawTexture, drawLight) {

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(vertices)), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(texVertices)), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(normals)), gl.STATIC_DRAW);

    applyTransforms(noTranslation, noRotation, noScale);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length);

}

function getScottPosition(deltaTime) {
    scottTimer += deltaTime;
    var contemplationTime = Math.random()*6 + 4;
    if (scottTimer > contemplationTime) {
        pickRandomPainting();
        playHmm();
        if (prevPaintingNum != paintingNum) // need to move to next painting
            scottTimer = -100;
        else
            scottTimer = 2; // don't stay as long
    }
    if (scottTimer >= 0)
        return paintingCoords;
    else { // on the move
        var posX = scottX;
        var posZ = scottZ;
        if (Math.abs(paintingCoords[0] - posX) > 0.1) {
            if (posX < paintingCoords[0])
                posX += SCOTT_SPEED*deltaTime;
            else if (posX > paintingCoords[0])
                posX -= SCOTT_SPEED*deltaTime;
        }
        if (Math.abs(paintingCoords[1] - posZ) > 0.1) {
            if (posZ < paintingCoords[1])
                posZ += SCOTT_SPEED*deltaTime;
            else if (posZ > paintingCoords[1])
                posZ -= SCOTT_SPEED*deltaTime;
        }
        if (Math.abs(paintingCoords[0] - posX) <= 0.1 && Math.abs(paintingCoords[1] - posZ) <= 0.1)
            scottTimer = 0;
        return [posX, posZ];
    }
}

function getContemplationPosition() {
    var painting = curRoom.paintings[paintingNum];
    if (painting == null)
        return [0,0];
    var walls = curRoom.walls;
    var leftBorder = walls[0][0];
    var rightBorder = walls[2][0];
    var bottomBorder = walls[0][1];
    var topBorder = walls[2][1];

    var posX = painting[0];
    var posZ = topBorder + standingDistance;
    if (painting[1] == leftBorder) {
        posX = leftBorder + standingDistance;
        posZ = painting[0];
    }
    else if (painting[1] == rightBorder) {
        posX = rightBorder - standingDistance;
        posZ = painting[0];
    }
    else if (painting[1] == bottomBorder) {
        posX = painting[0];
        posZ = bottomBorder - standingDistance;
    }
    return [posX, posZ];
}

function pickRandomPainting() {
    var len = curRoom.paintings.length;
    prevPaintingNum = paintingNum;
    prevPaintingCoords = getContemplationPosition();
    paintingNum = Math.floor(Math.random()*len);
    paintingCoords = getContemplationPosition();
}

function resetScott() {
    paintingNum = 0;
    scottTimer = 0;
    pickRandomPainting();
}

function checkScottCollision() {
    var leftBorder = scottX - shoveRadius/2;
    var rightBorder = leftBorder + shoveRadius;
    var bottomBorder = scottZ + shoveRadius/2;
    var topBorder = scottZ - shoveRadius;
    var posX = -camX;
    var posZ = -camZ;
    if (posX > leftBorder && posX < rightBorder && posZ < bottomBorder && posZ > topBorder) {
        // Collision, shove player away
        shoveSound.play();
        var left = Math.abs(leftBorder - posX);
        var right = Math.abs(rightBorder - posX);
        var top = Math.abs(topBorder - posZ);
        var bottom = Math.abs(bottomBorder - posZ);
        var min = Math.min(left, right, top, bottom);
        switch (min) {
            case left:
                camX += shoveDistance;
                break;
            case right:
                camX -= shoveDistance;
                break;
            case top:
                camZ += shoveDistance;
                break;
            case bottom:
                camZ -= shoveDistance;
                break;
            default:
                console.log("bad");
        }
    }
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

function setLighting(useLighting) {
    var room = rooms[curRoomIndex];
    var walls = room.walls;
    var leftBorder = walls[0][0];
    var rightBorder = walls[2][0];
    var bottomBorder = walls[0][1];
    var topBorder = walls[2][1];

    var lightPosition = vec3((leftBorder+rightBorder)/2, room.wallHeight-1, (bottomBorder+topBorder)/2, 1.0);

    ambientProduct = room.lighting.ambient;
    lightColor = room.lighting.lightColor;

    gl.uniform1i(gl.getUniformLocation(program, "isLit"), useLighting);
    gl.uniform4fv(gl.getUniformLocation(program, "vAmbientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "vLightColor"), flatten(lightColor));
    gl.uniform3fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
}

function attemptMove(axis, dist) {
    if (!allowControl)
        return;
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
            if (newCamZ > curDoor[0] - doorWidth/2 && newCamZ < curDoor[0] + doorWidth/2 && Math.abs(curDoor[1] - newCamX) < doorDepth) {
                //console.log("Vert door, wall placement: " + curDoor[1] + " == " + topWall + " || " + bottomWall);
                // Check movement direction so you don't switch back and forth between rooms
                if (curDoor[1] == rightBorder && movingRight || curDoor[1] == leftBorder && !movingRight) {
                    if (curRoom.song) {
                        if (prevSong) { prevSong.pause(); }
                        prevSong = curRoom.song;
                    }
                    curRoomIndex = curDoor[2];
                    curRoom = rooms[curRoomIndex];
                    resetScott();
                    wallHeight = curRoom.wallHeight * globalScale;
                    lightHeight = wallHeight - 1;
                    movingRight? camX -= 1 : camX += 1;
                    if (!muted) {
                        doorSound.play();
                        if (curRoom.song) {
                            curRoom.song.load();
                            curRoom.song.volume = 0.0;
                            curRoom.song.play();
                            curRoom.song.loop = true;
                        }
                    }
                }
            }
        }
        else { // Door goes east-west
            if (newCamX > curDoor[0]  - doorWidth/2 && newCamX < curDoor[0] + doorWidth/2 && 
                Math.abs(curDoor[1] - newCamZ) < doorDepth) {
                //console.log("Hor door, wall placement: " + curDoor[1] + " == " + topBorder + " || " + bottomBorder);
                // Check movement direction so you don't switch back and forth between rooms
                if (curDoor[1] == topBorder && movingUp || curDoor[1] == bottomBorder && movingDown) {
                    if (curRoom.song) {
                        if (prevSong) { prevSong.pause(); }
                        prevSong = curRoom.song;
                    }
                    curRoomIndex = curDoor[2];
                    curRoom = rooms[curRoomIndex];
                    resetScott();
                    wallHeight = curRoom.wallHeight * globalScale;
                    lightHeight = wallHeight - 1;
                    movingUp? camZ += 1 : camZ -= 1;
                    if (!muted) {
                        doorSound.play();
                        if (curRoom.song) {
                            curRoom.song.load();
                            curRoom.song.volume = 0.0;
                            curRoom.song.play();
                            curRoom.song.loop = true;
                        }
                    }
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
    checkScottCollision();
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
    wallHeight = curRoom.wallHeight * globalScale;
    lightHeight = wallHeight - 1;
}
function cycleIdol() {
    if (curRoomIndex == ROOMS.HALLWAY && !bottomFloor) {
        switch(idolSign.src) {
            case 'idols1.png':
                idolSign.src = 'idols2.png';
                idol.src = 'cage.png';
                break;
            case 'idols2.png':
                idolSign.src = 'idols3.png';
                idol.src = 'friedman.png';
                break;
            case 'idols3.png':
                idolSign.src = 'idols4.png';
                idol.src = 'blogum.png';
                break;
            case 'idols4.png':
                idolSign.src = 'idols1.png';
                idol.src = 'stallman.png';
                break;
        }
    }
}

function toggleFloor() {
    if (curRoomIndex != ROOMS.STAIRCASE) {
        playHmm();
        return;
    }
    dingSound.play();
    
    bottomFloor = !bottomFloor;

    if (hallway.doors[0][2] == ROOMS.LOBBY) { // floor 1 -> floor 2
        staircase.paintings[0][2] = floor2;
        hallway.doors[0][2] = ROOMS.SHRINE;
        hallway.doors[1][2] = ROOMS.ROOM6;
        hallway.doors[2][2] = ROOMS.ROOM4;
        hallway.doors[3][2] = ROOMS.ROOM5;
        hallway.paintings[1][2] = shrineSign;
        hallway.paintings.push([(midLeftWall + midRightWall)/2 - 1.5*doorWidth, midBottomWall, idolSign]);
    }
    else { // floor 2 -> floor 1
        staircase.paintings[0][2] = floor1;
        hallway.doors[0][2] = ROOMS.LOBBY;
        hallway.doors[1][2] = ROOMS.ROOM3;
        hallway.doors[2][2] = ROOMS.ROOM1;
        hallway.doors[3][2] = ROOMS.ROOM2;
        hallway.paintings[1][2] = lobbySign;
        hallway.paintings.pop();
    }

}

function playSpotlight() {
    spotlightSound.load();
    spotlightSound.play();
}

function playHmm() {
    var idleSound = Math.floor(Math.random()*3);
    idleSounds[idleSound].load();
    idleSounds[idleSound].play();
}

function timerCheck(deltaTime) {
    timer += deltaTime;
    if (timer > 2 && !timerCheck1) {
        timerCheck1 = true;
        numLights = 2;
        playSpotlight();
    }
    if (timer > 3 && !timerCheck2) {
        timerCheck2 = true;
        numLights = 4;
        playSpotlight();
    }
    if (timer > 4 && !timerCheck3) {
        timerCheck3 = true;
        numLights = 6;
        playSpotlight();
    }
    if (timer > 5 && !timerCheck4) {
        timerCheck4 = true;
        numLights = 8;
        playSpotlight();
    }
    if (timer > 6 && !timerCheck5) {
        timerCheck5 = true;
        numLights = 10;
        playSpotlight();
    }
    if (timer > 7 && !timerCheck6) {
        timerCheck6 = true;
        numLights = 12;
        playSpotlight();
    }
    if (timer > 8 && !timerCheck7) {
        timerCheck7 = true;
        numLights = 14;
        playSpotlight();
    }
    if (timer > 9 && !timerCheck8) {
        timerCheck8 = true;
        numLights = 16;
        playSpotlight();
    }
    if (timer > 10 && !timerCheck9) {
        timerCheck9 = true;
        shrine.paintings.push(shrinePainting);
        playSpotlight();
    }

    if (timer > 47.8 && !timerCheck10) {
        toggleFloor();
        restart();
    }
    if (pitch < 0)
        pitch += 1*deltaTime;
    if (timer > 2) {
        if (camZ > -200)
            camZ -= 30*deltaTime;
        else if (camZ > -300)
            camZ -= 20*deltaTime;
        else if (camZ > -400)
            camZ -= 10*deltaTime;
        else if (camZ > -460)
            camZ -= 5*deltaTime;
        if (camY < 15)
            camY += 2*deltaTime;
        else if (camY < 40)
            camY += 4*deltaTime;
        else if (camY < 125)
            camY += 5*deltaTime;
    }
}

// From book
function configureTexture(tex) {
    var image = document.getElementById(tex.src);
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function moveCallback(e) {
    if (!allowControl)
        return;
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
    if (!allowControl)
        return;
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
        camY -= 0;//.25;
    if (spaceHeld)
        camY += 0;//.25;
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
            if (allowControl)
                pitch += 2;
            break;
        case 39: //right
            rightHeld = true;
            break;
        case 40: //down
            if (allowControl)
                pitch -= 2;
            break;
        case 65: //a
            aHeld = true;
            break;
        case 67: //c
            //renderCeiling = !renderCeiling;
            break;
        case 68: //d
            dHeld = true;
            break;
        case 69:
            cycleIdol();
            break;
        case 70: //f
            toggleFullscreen();
            break;
        case 72: //h
            printCamCoords();
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
            if (curRoom.song.paused)
                curRoom.song.play();
            else
                curRoom.song.pause();
            break;
        case 78: //n
        case 80: //p
            restart();
            break;
        case 82: //r
            break;
        case 83: //s
            sHeld = true;
            break;
        case 84: //t
            toggleFloor();
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
    if (prevSong) {prevSong.pause();}
    if (curRoom.song) {curRoom.song.pause();}

    fov = initFOV;
    camX = initCamX;
    camY = initCamY;
    camZ = initCamZ;
    azim = initAzim;
    pitch = initPitch;
    curRoomIndex = 0;
    curRoom = rooms[0];

    wallHeight = curRoom.wallHeight * globalScale;
    lightHeight = wallHeight - 1;
    hallway.doors[0][2] = ROOMS.LOBBY;
    enteredShrine = false;
    timer = 0;
    allowControl = true;
    numLights = 1;
    
    shrine.paintings = [];
    timerCheck1 = false;
    timerCheck2 = false;
    timerCheck3 = false;
    timerCheck4 = false;
    timerCheck5 = false;
    timerCheck6 = false;
    timerCheck7 = false;
    timerCheck8 = false;
    timerCheck9 = false;
    timerCheck10 = false;

    staircase.paintings[0][2] = floor1;
    hallway.doors[0][2] = ROOMS.LOBBY;
    hallway.doors[1][2] = ROOMS.ROOM3;
    hallway.doors[2][2] = ROOMS.ROOM1;
    hallway.doors[3][2] = ROOMS.ROOM2;
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
        canvas.requestFullscreen();
        
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
    console.log("Scott x: " + scottX + ", Scott Z: " + scottZ);
}
