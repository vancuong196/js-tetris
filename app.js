/**
 * global vars declaretion
 */

var makeBlockFallTimer = undefined;
var canvas = undefined;
var height = 0;
var width = 0;
var baseX = 0;
var baseY = 0;
var moveDirection = 0;
var isMovingDownFast = false;
var gameBoardBitmap = undefined;
var currentBlock = undefined;

/**
 * register events
 */
{
    /**
     * initialize webapp when html page is loaded
     */
    window.addEventListener('load', (event) => {
        initApplication();
        updateUserInterface();
    });

    /**
     * we have to recalculate size, repaint all blocks when size is changing
     */
    window.addEventListener('resize', (event) => {
        updateUserInterface();
    });

    /**
     * add events to control the falling block
     */
    document.addEventListener("keydown", onKeyDown, false);

    document.addEventListener("keyup", onKeyUp, false);
}

/**
 * repaint game board using game board bitmap
 */
function rePaintGameBoard() {
    gameBoardBitmap.forEach((row, y) => {
        row.forEach((value, x) => {
            var xOffset = (x) * BLOCK_SIZE + baseX;
            var yOffset = (y) * BLOCK_SIZE + baseY;
            if (value > 0) {
                drawRect(canvas, xOffset, yOffset, BLOCK_SIZE, BLOCK_SIZE, colors[value]);
            } else {
                drawRect(canvas, xOffset, yOffset, BLOCK_SIZE, BLOCK_SIZE, "#ff0000");
            }
        })
    });
}

/**
 * get a random block, with random shape and color
 * @returns random block
 */
function getRandomBlock() {
    var blocks = [I, J, T, O, Z, L];
    //var blocks = [O,O,O,O,O,O];
    var randomTypeIndex = getRandomInt(0, 5);
    var block = blocks[randomTypeIndex];
    var randomShapeIndex = getRandomInt(0, 3);
    var shape = block[randomShapeIndex];

    var bl = {
        pos: {
            x: WIDTH_TOTAL_BLOCK / 2 - 1,
            y: 0
        },
        points: shape,
        type: randomTypeIndex,
        shape: randomShapeIndex
    }

    for (y = 0; y < 3; y++) {
        for (var x = 0; x < 3; x++) {
            if (bl.points[y][x] > 0) {
                bl.points[y][x] = getRandomInt(1, 6);
            }
        }
    }
    return bl;
}

/**
 * rotate shape of a block
 * @param {block} bl 
 */
function rotateShape(bl) {
    var blocks = [I, J, T, O, Z, L];
    var block = blocks[bl.type];
    var newShapeIndex = 0;
    if (bl.shape < 3) {
        newShapeIndex = bl.shape + 1;
    } else {
        newShapeIndex = 0;
    }
    if (!checkColisionWhenChangeShape(bl, block[newShapeIndex])){
        bl.shape = newShapeIndex;
        bl.points = block[newShapeIndex];
        for (y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                if (bl.points[y][x] > 0) {
                    bl.points[y][x] = getRandomInt(1, 6);
                }
            }
        }
    }
}

/**
 * key event
 */
function onKeyDown(e) {
    switch (e.keyCode) {
        case 37:
            // try to set state to move left when left key pressed
            if (currentBlock.pos.x >= 1 && checkIfCanMoveLeft(currentBlock)) {
                moveDirection = -1;
            } else {
                moveDirection = 0;
            }
            break;
        case 16:
            console.log("up");
            break;
        case 39:
            // try to set state to move right when right key pressed
            if (currentBlock.pos.x < WIDTH_TOTAL_BLOCK && checkIfCanMoveRight(currentBlock)) {
                moveDirection = 1;
            } else {
                moveDirection = 0;
            }
            break;
        case 40:
            // if it's falling fast, no need to change
            if (isMovingDownFast) {
                return;
            }
            // make falling speed faster
            clearInterval(makeBlockFallTimer);
            isMovingDownFast = true;
            makeBlockFallTimer = setInterval(updateFallingBlock, 30);
            break;
        case 13:
        case 32:

            // rotate current block shape
            rotateCurrentShape();
            break;
    }
}

/**
 * when downkey is released, we need to make falling speed normal
 * @param {event} e 
 */
function onKeyUp(e) {
    switch (e.keyCode) {
        case 40:
            clearInterval(makeBlockFallTimer);
            makeBlockFallTimer = setInterval(updateFallingBlock, 500);
            isMovingDownFast = false;
            break;
    }
}

/**
 * change current falling block shape
 */
function rotateCurrentShape() {
    removeShapeFromBitmap(currentBlock);
    rotateShape(currentBlock);
    addShapeToBitmap(currentBlock);
    rePaintGameBoard();
}

/**
 * make current block fall down by increase y cor
 */
function updateFallingBlock() {

    if (!checkIfCanMoveDown(currentBlock)) {
        score();
        currentBlock = getRandomBlock();
        if (checkGameOver(currentBlock)){
            alert("game over");
        }
        return;
    }
    removeShapeFromBitmap(currentBlock);
    currentBlock.pos.y++;
    addShapeToBitmap(currentBlock);
    rePaintGameBoard();
}

/**
 * first run initialize
 */
function initApplication() {
    canvas = document.getElementById("myCanvas");

    updateWindowSize();
    initializeGameData();

    currentBlock = getRandomBlock();

    makeBlockFallTimer = setInterval(updateFallingBlock, 500);

    setInterval(function () {
        switch (moveDirection) {
            case 1:
                if (!isLimitXRight(currentBlock)) {
                    updateCurrentHorizontal(1);
                }
                break;
            case -1:
                updateCurrentHorizontal(-1);
                break;
        }
        moveDirection = 0;
    }, 50);
}

function initializeGameData() {
    gameBoardBitmap = [];
    for (var i = 0; i < HEIGHT_TOTAL_BLOCK; i++) {
        var row = [];
        for (var j = 0; j < WIDTH_TOTAL_BLOCK; j++) {
            row.push(0);
        }
        gameBoardBitmap.push(row);
    }
}

/**
 * update view params
 */
function updateUserInterface() {
    updateWindowSize();
    calculateGameBoardArea();
    rePaintGameBoard();
}

/**
 * get browser window size
 */
function updateWindowSize() {
    // update window size
    height = $(window).height();
    width = $(window).width();
    canvas.height = height;
    canvas.width = width;
}

/**
 * calculate area to draw game board
 */
function calculateGameBoardArea() {
    var centerLine = width / 2;
    baseX = centerLine - BLOCK_SIZE * WIDTH_TOTAL_BLOCK / 2;

    var centerVertical = height / 2;
    baseY = centerVertical - BLOCK_SIZE * HEIGHT_TOTAL_BLOCK / 2;
}

/**
 * add a shape of a block to current game bitmap, make it displayed in the board
 * @param {block to add to game board bitmap} bl 
 */
function addShapeToBitmap(bl) {
    for (var y = 0; y < 3; y++) {
        for (var x = 0; x < 3; x++) {
            if (bl.points[y][x] > 0) {
                gameBoardBitmap[bl.pos.y + y][bl.pos.x + x] = bl.points[y][x];
            }
        }
    }
}

/**
 * remve move a block shape from current game board
 * @param {block to remove shape from game board bit map} bl 
 */
function removeShapeFromBitmap(bl) {
    for (var y = 0; y < 3; y++) {
        for (var x = 0; x < 3; x++) {
            var row = bl.points[y];
            var value = row[x];
            if (value > 0) {
                gameBoardBitmap[bl.pos.y + y][bl.pos.x + x] = 0;
            }
        }
    }
}

/**
 * update block position when move left or right
 * @param {moving direction, 1 if move right, -1 move left} direction 
 */
function updateCurrentHorizontal(direction) {

    removeShapeFromBitmap(currentBlock);
    currentBlock.pos.x += direction;
    addShapeToBitmap(currentBlock);
    rePaintGameBoard();
}

/**
 * check if a block can be moved down
 * @param {block to check} block 
 * @returns true if can, false if can't
 */
function checkIfCanMoveDown(block) {
    var result = true;
    var ry1 = block.points[0];
    var ry2 = block.points[1];
    var ry3 = block.points[2];
    var y1 = getMax(ry3[0], ry2[0], ry1[0]);
    var y2 = getMax(ry3[1], ry2[1], ry1[1]);
    var y3 = getMax(ry3[2], ry2[2], ry1[2]);
    var points = [{ x: 0, y: y1 }, { x: 1, y: y2 }, { x: 2, y: y3 }]
    points.forEach(maxPoint => {
        if (maxPoint.y > 0 && checkIfStaticPointExist(block.pos.x + maxPoint.x, block.pos.y + 1 + maxPoint.y)) {
            result = false;
        }
    });
    return result;
};

/**
 * check if a block can be move right
 * @param {block to check} block 
 * @returns true if can, false if can't
 */
function checkIfCanMoveRight(block) {
    var result = true;
    var ry1 = block.points[0];
    var ry2 = block.points[1];
    var ry3 = block.points[2];
    var x1 = getMax(ry1[2], ry1[1], ry1[0]);
    var x2 = getMax(ry2[2], ry2[1], ry2[0]);
    var x3 = getMax(ry3[2], ry3[1], ry3[0]);
    var points = [{ x: x1, y: 0 }, { x: x2, y: 1 }, { x: x3, y: 2 }]
    points.forEach(maxPoint => {
        if (maxPoint.x > 0 && checkIfStaticPointExist(block.pos.x + maxPoint.x + 1, block.pos.y + maxPoint.y)) {
            result = false;
        }
    });
    return result;
}

/**
 * check if a block can move to left
 * @param {block to check} block 
 * @returns true if can, false if can't
 */
function checkIfCanMoveLeft(block) {
    var result = true;
    var ry1 = block.points[0];
    var ry2 = block.points[1];
    var ry3 = block.points[2];
    var x1 = getMin(ry1[2], ry1[1], ry1[0]);
    var x2 = getMin(ry2[2], ry2[1], ry2[0]);
    var x3 = getMin(ry3[2], ry3[1], ry3[0]);
    var points = [{ x: x1, y: 0 }, { x: x2, y: 1 }, { x: x3, y: 2 }]
    points.forEach(maxPoint => {
        if (maxPoint.x > 0 && checkIfStaticPointExist(block.pos.x + maxPoint.x - 1, block.pos.y + maxPoint.y)) {
            result = false;
        }
    });
    return result;
}

/**
 * check if a position in bitmap is available
 * @param {x cor} x 
 * @param {y cor} y 
 * @returns return false if available
 */
function checkIfStaticPointExist(x, y) {
    if (y >= HEIGHT_TOTAL_BLOCK || x < 0 || x >= WIDTH_TOTAL_BLOCK || y < 0) {
        return true;
    }
    if (gameBoardBitmap[y][x] > 0) {
        return true;
    }
    return false;
}

/**
 * calcalute game score after a block is setle down
 */
function score() {
    for (var i = HEIGHT_TOTAL_BLOCK - 1; i >= 0; i--) {
        var row = gameBoardBitmap[i];
        var col = row.find(x => x == 0);
        if (col == undefined) {
            //alert('haha');
            drawAnimationOnScored(i);
            for (var j = 0; j < WIDTH_TOTAL_BLOCK; j++) {
                row[j] = 0;
            }
            moveBitMapDowOneRow(i);
            score();
        }
    }
}

/**
 * shift down bitmap by one 1 unit from fromRow
 * @param {row that will be remove} fromRow 
 */
function moveBitMapDowOneRow(fromRow) {
    for (var i = fromRow; i > 0; i--) {
        var row = gameBoardBitmap[i];
        var upperRow = gameBoardBitmap[i - 1];
        for (var j = 0; j < WIDTH_TOTAL_BLOCK; j++) {
            row[j] = upperRow[j];
        }
    }
    var rowZero = gameBoardBitmap[0];
    for (var j = 0; j < WIDTH_TOTAL_BLOCK; j++) {
        rowZero[j] = 0;
    }
}

/**
 * show remove row animation
 * @param {row that will be remove} y 
 */
function drawAnimationOnScored(y) {
    var row = gameBoardBitmap[y];
    row.forEach((value, x) => {
        var xOffset = (x) * BLOCK_SIZE + baseX;
        var yOffset = (y) * BLOCK_SIZE + baseY;
        if (value > 0) {
            drawRect(canvas, xOffset, yOffset, BLOCK_SIZE, BLOCK_SIZE, "#ffffff");
        } else {
            drawRect(canvas, xOffset, yOffset, BLOCK_SIZE, BLOCK_SIZE, "#ff0000");
        }
    })
    sleep(50);
    row.forEach((value, x) => {
        var xOffset = (x) * BLOCK_SIZE + baseX;
        var yOffset = (y) * BLOCK_SIZE + baseY;
        if (value > 0) {
            drawRect(canvas, xOffset, yOffset, BLOCK_SIZE, BLOCK_SIZE, "#f9e40b");
        } else {
            drawRect(canvas, xOffset, yOffset, BLOCK_SIZE, BLOCK_SIZE, "#ff0000");
        }
    });
    sleep(100);
    row.forEach((value, x) => {
        var xOffset = (x) * BLOCK_SIZE + baseX;
        var yOffset = (y) * BLOCK_SIZE + baseY;
        if (value > 0) {
            drawRect(canvas, xOffset, yOffset, BLOCK_SIZE, BLOCK_SIZE, "#ffffff");
        } else {
            drawRect(canvas, xOffset, yOffset, BLOCK_SIZE, BLOCK_SIZE, "#ff0000");
        }
    })
}

/**
 * check if new block cannot be added to game board, means game over
 * @param {new block created} bl 
 * @returns 
 */
function checkGameOver(bl) {
    for (var y = 0; y < 3; y++) {
        for (var x = 0; x < 3; x++) {
            var row = bl.points[y];
            var value = row[x];
            if (value > 0 && gameBoardBitmap[bl.pos.y + y][bl.pos.x + x] >0) {
                 return true;
            }
        }
    }
    return false;
}

/**
 * check if block can change its shape
 * @param {current block to check} bl 
 * @param {new shape of block} points 
 * @returns 
 */
function checkColisionWhenChangeShape(bl, points) {
    for (var y = 0; y < 3; y++) {
        for (var x = 0; x < 3; x++) {
            if (points[y][x] > 0 && (bl.pos.y + y>= HEIGHT_TOTAL_BLOCK || bl.pos.x + x >= WIDTH_TOTAL_BLOCK)) {
                 return true;
            }
        }
    }
    return false;
}

/**
 * check if block can move right
 * @param {block tocheck} block 
 * @returns 
 */
function isLimitXRight(block){
    var max =block.points[0].x;
    for (var i=1; i< block.points.length; i++){
        if (block.points[i].x>max){
            max = block.points[i].x;
        }
    }
    if ((max+block.pos.x)>=(WIDTH_TOTAL_BLOCK-1)){
        return true;
    }
    return false;
}