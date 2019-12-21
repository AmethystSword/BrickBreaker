
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

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

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.closePath();
}
 function paddleLogic() {
      //paddle logic
      if (rightArrowPressed) {
        paddleX += 8;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    }
    if (leftArrowPressed) {
        paddleX -= 8;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }
 }






