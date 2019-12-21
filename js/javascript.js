let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');

canvas.width = '1100';
canvas.height = '500';

let ballRadius = 15;

let paddleHeight = 20;
let paddleWidth = canvas.width;

let x = canvas.width / 2; //x pozice micku
let y = canvas.height - paddleHeight - 20 - ballRadius; //y pozice micku
let dx = 3;
let dy = -3;

let speed = 10; //sec

let ballColor = undefined;

const colors = ['green', 'blue', 'violet', 'yellow', 'red', 'pink', 'black', 'orange'];

let rightArrowPressed = false;
let leftArrowPressed = false;

let paddleX = (canvas.width / 2) - paddleWidth / 2;
let paddleY = canvas.height - paddleHeight - 20;

let brickColumnCount = 10; //pocet sloupecku
let brickRowCount = 7; //pocet radku
let brickPadding = 5; //odstup mezi kvadriky
let brickOffsetTop = 20; // odstup od horni steny
let brickSideOffset = 20; //odstup od bocni steny
let brickWidth = (canvas.width - 2 * brickSideOffset - brickColumnCount * 2 * brickPadding) / brickColumnCount; //sirka
let brickHeight = (canvas.height / 2 - brickOffsetTop - brickRowCount * 2 * brickPadding) / brickRowCount; //vyska

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1};
    }
}


function randomColor() {
    ballColor = colors[Math.round(Math.random() * colors.length)];
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

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    //BOUNCING 
    if (y - ballRadius <= 0) { //top wall
        dy = -dy;
        randomColor();
    }

    if (x - ballRadius < 0 || x + ballRadius > canvas.width) { //right / left wall
        dx = -dx;
        randomColor();
    }

    //GAME OVER
    if ((x > paddleX + paddleWidth + ballRadius || x + ballRadius < paddleX) && y - 2 * ballRadius >= canvas.height) {
        //GAME OVER
        alert('GAME OVER');
        clearInterval(interval); //stop the time
        document.location.reload();

    }

    //paddle collision detection
    if ((x + ballRadius <= paddleX + paddleWidth && x + ballRadius >= paddleX) && (y + ballRadius >= paddleY && y + ballRadius <= paddleY + dy)) {
        dy = -dy;
    }
    paddleLogic(); 
    x += dx;
    y += dy;

}

function drawForTheFirstTime() {
    drawBricks();
    drawBall();
    drawPaddle();
}

document.addEventListener('keydown', function (e) {
    if (e.keyCode === 13 || e.keyCode === 32) {
        let interval = setInterval(draw, speed); // every 10 ms
    }
})
document.onload = function() {
    drawForTheFirstTime();
};

//what to do next
    // = speed the ball up
    // = odraz podle mista dotyku s paddle
