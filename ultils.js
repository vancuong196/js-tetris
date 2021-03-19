/**
 * get right-most index (of a array) that value is not zero
 * @param {3rd index} n3 
 * @param {2nd index} n2 
 * @param {1nd index} n1 
 * @returns right-most index (of a array) that value is not zero, -1 if all is zero
 */
function getMax(n3, n2, n1){
    if (n3>0){
        return 2;
    }
    if (n2>0){
        return 1;
    }
    if (n1>0){
        return 0;
    }
    return -1;
}
/**
 * get left-most index (of a array) that value is not zero
 * @param {3rd index} n3 
 * @param {2nd index} n2 
 * @param {1st index} n1 
 * @returns left-most index that value is not zero, -1 if all is zero
 */
function getMin(n3,n2,n1){
    if (n1>0){
        return 0;
    }
    if (n2>0){
        return 1;
    }
    if (n3>0){
        return 2;
    }
    return -1;
}
/**
 * draw a line in canvas
 * @param {html5 canvas} canvas 
 * @param {start point x cor} x1 
 * @param {start point y cor} y1 
 * @param {end point x cor} x2 
 * @param {end point y cor} y2 
 */
function drawLine(canvas, x1, y1, x2, y2) {
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

/**
 * draw a rect on the canvas
 * @param {html5 canvas} canvas 
 * @param {x cor} x 
 * @param {y cor} y 
 * @param {width} w 
 * @param {height} h 
 * @param {clolor of the rect} color 
 */
function drawRect(canvas, x, y, w, h, color){
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    drawLine(canvas,x,y,x,y+w);
    drawLine(canvas,x,y,x+w,y);
    drawLine(canvas,x+w,y,x+w,y+w);
    drawLine(canvas,x,y+w,x+w,y+w);
}

/**
 * get random integer within range(min, max)
 */
 function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * sleep
 * @param {sleep time in mili second} milliseconds 
 */
 function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}