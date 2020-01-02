//LOADING IMAGES STARTS RIGHT HERE...

const bg_img = new Image();
bg_img.src = 'img/bgIMG.jpg';

const life_img = new Image();
life_img.src = 'img/life.png';

const score_img = new Image();
score_img.src = 'img/score.png';

const level_img = new Image();
level_img.src = 'img/level.png';

//LOADING IMAGES END HERE...

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








