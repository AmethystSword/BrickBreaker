document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

function keyDownHandler(e) { // e = event - v event parametru jsou informace o udalosti
    if (e.key == "Right" || e.key == "ArrowRight" || e.keyCode == 39) { // pri stisku sipek jsou promenne pro stisk sipek 'true'
        rightArrowPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft" || e.keyCode == 37) {
        leftArrowPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight" || e.keyCode == 39) { //pokud nejsou stisknute sipky tak logicky jejich promenne jsou 'false'
        rightArrowPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft" || e.keyCode == 37) {
        leftArrowPressed = false;
    }
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    //canvas.offsetLeft = distance between the left edge of the canvas and left edge of the viewport
    //e.clientX = horizontal position of mouse in viewport
    if (relativeX >= 0 + paddle.width/2 && relativeX <= canvas.width - paddle.width/2) {
        paddle.x = relativeX - paddle.width/2;
    }
}

again.style.top = `${(canvas.height/100) * 70}px`;
again.style.left = `${(canvas.width/100) * 41.7}px`;

win.style.left = `${(canvas.width/100) * 39.5}px`;
win.style.top = `${canvas.height/100 * 26}px`;

lose.style.width = `${canvas.width}px`;
lose.style.top = `-30px`;

endScreen.style.width = `${canvas.width}px`;
endScreen.style.height = `${canvas.height}px`;

victory.style.left = `${(canvas.width/100) * 36.5}px`;
victory.style.top = `20px`;







