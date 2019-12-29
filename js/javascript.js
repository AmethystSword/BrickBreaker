let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');

let scriptPaddle = document.createElement('script');
scriptPaddle.src = 'js/paddle.js';
document.body.appendChild(scriptPaddle);

canvas.width = '1100';
canvas.height = '500';

let ballRadius = 15;

let paddleHeight = 20;
let paddleWidth = 200;

let x = canvas.width / 2; //x pozice micku
let y = canvas.height - paddleHeight - 20 - ballRadius; //y pozice micku
let dx = 4;
let dy = -4;

let ballColor = undefined;
let frameStart = 0;

const colors = ['green', 'blue', 'violet', 'yellow', 'red', 'pink', 'black', 'orange'];

let rightArrowPressed = false;
let leftArrowPressed = false;

let paddleX = (canvas.width / 2) - paddleWidth / 2;
let paddleY = canvas.height - paddleHeight - 20;

let brickColumnCount = 3; //pocet sloupecku
let brickRowCount = 3; //pocet radku
let brickPadding = 5; //odstup mezi kvadriky
let brickOffsetTop = 20; // odstup od horni steny
let brickSideOffset = 20; //odstup od bocni steny
let brickWidth = (canvas.width - 2 * brickSideOffset - brickColumnCount * 2 * brickPadding) / brickColumnCount; //sirka
let brickHeight = (canvas.height / 2 - brickOffsetTop - brickRowCount * 2 * brickPadding) / brickRowCount; //vyska

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

let score = 0;
let lives = 3;

function randomColor() {
    ballColor = colors[Math.round(Math.random() * colors.length)];
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    paddleLogic();
    ballMovement();
    drawScore(); //score is up to date
    drawLives();
    collisionDetection();
    deadEnd();
    requestAnimationFrame(draw);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);

    if (ballColor === undefined) {
        ctx.fillStyle = 'black';
    }
    else {
        ctx.fillStyle = ballColor;
    }
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {         //PADDLE
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.closePath();
}

// status 1 = paint the brick
// status 0 = the brick was hit by a ball, delete it
function drawBricks() {         //BRICKS
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {

            if (bricks[c][r].status == 1) {
                let brickX = (c * (brickWidth + 2 * brickPadding)) + brickSideOffset + brickPadding;
                let brickY = (r * (brickHeight + 2 * brickPadding)) + brickOffsetTop + brickPadding;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function paddleLogic() {        //PADDLE
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

function ballMovement() {       //BALL
    //BOUNCING 
    if (y - ballRadius <= 0) { //top wall
        dy = -dy;
        randomColor();
    }

    if (x - ballRadius < 0 || x + ballRadius > canvas.width) { //right / left wall
        dx = -dx;
        randomColor();
    }

    //PADDLE COLLISION DETECTION
    if ((x + ballRadius <= paddleX + paddleWidth && x + ballRadius >= paddleX) && (y + ballRadius >= paddleY && y + ballRadius <= paddleY + dy)) {
        dy = -dy;
    }

    x += dx;
    y += dy;
}

function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 8, 20); //posledni dva parametry jsou souradnice
}

function drawLives() {
    ctx.font = '16px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r]; //konkretni brick konkretniho sloupecku

            if (b.status == 1) {
                if ((x + ballRadius >= b.x && x - ballRadius <= b.x + brickWidth) && (y - ballRadius >= b.y && y - ballRadius <= b.y + brickHeight)) { ///:::DGSFGFDSH
                    dy = -dy;
                    b.status = 0; //uz se nevykresli znova
                    score++; //score se zvetsi o 1
                    if (score == brickColumnCount * brickRowCount) {
                        cancelAnimationFrame(draw);
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        drawBricks();
                        drawBall();
                        drawPaddle();
                        drawScore();
                        setTimeout(function() {
                            alert('YOU WIN! You have managed to destroy all the bricks!');
                            document.location.reload();
                        }, 100);
                    }
                }
            }
        }
    }
}

function deadEnd() { //GAMEOVER
    if ((x > paddleX + paddleWidth + ballRadius || x + ballRadius < paddleX) && y - 2 * ballRadius >= canvas.height) {
        //GAME OVER
        if (!lives) {
            //GAME OVER
            alert('GAME OVER');
            cancelAnimationFrame(draw);
            document.location.reload();
        }
        else { //restart
            lives--;
            x = canvas.width / 2;
            y = canvas.height - paddleHeight - 20 - ballRadius;;
            dx = 3;
            dy = -3;
            paddleX = (canvas.width / paddleWidth) / 2;
        }
    }
}

document.addEventListener('keydown', function (e) {
    if (e.keyCode === 13 || e.keyCode === 32) {
        frameStart == 1;
    }
}, { once: true });

draw();

//what to do next
    // = speed the ball up
    // = odraz podle mista dotyku s paddle
