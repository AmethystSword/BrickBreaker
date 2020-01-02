let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');

// ADD BORDER TO CANVAS
canvas.style.border = "1px solid #0ff";

// MAKE LINE THINK WHEN DRAWING TO CANVAS
ctx.lineWidth = 3;

canvas.width = '1100';
canvas.height = '500';

const PADDLE_HEIGHT = 20;
let PADDLE_WIDTH = 200;
let BALL_RADIUS = 15;
const bottomPaddleMargin = 50;

let frameStart = false;
let gameOver = false;

let rightArrowPressed = false;
let leftArrowPressed = false;

let score = 0;
let life = 3;

const paddle = {
    x: canvas.width / 2 - PADDLE_WIDTH / 2,
    y: canvas.height - PADDLE_HEIGHT - bottomPaddleMargin,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dx: 5
}

//DRAW PADDLE
function drawPaddle() {
    ctx.beginPath();
    ctx.fillStyle = '#2e3548';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.strokestyle = '#ffcd05'
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.closePath();
}

//PADDLE MOVEMENT
function paddleMovement() {
    if (rightArrowPressed) {
        paddle.x += paddle.dx;
        if (paddle.x + paddle.width > canvas.width) {
            paddle.x = canvas.width - paddle.width;
        }
    }
    if (leftArrowPressed) {
        paddle.x -= paddle.dx;
        if (paddle.x < 0) {
            paddle.x = 0;
        }
    }
}


const ball = {
    x: canvas.width / 2,
    y: paddle.y - BALL_RADIUS,
    radius: BALL_RADIUS,
    speed: 4,
    dx: 3 * (Math.random() * 2 - 1),
    dy: -3,
    color: undefined
}
const colors = ['green', 'blue', 'violet', 'yellow', 'red', 'pink', 'black', 'orange'];
function randomColor() {
    ball.color = colors[Math.round(Math.random() * colors.length)];
}

//DRAW BALL
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.strokestyle = '#2e3548';
    if (ball.color === undefined) {
        ctx.fillStyle = 'black';
    }
    else {
        ctx.fillStyle = ball.color;
    }
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

//BALL MOVEMENT
function ballMovement() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}


//BALL AND WALL COLLISION DETECTION
function ballAndWall() {
    if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) { //left right
        ball.dx = -ball.dx;
        randomColor();
    }

    if (ball.y - ball.radius <= 0) {
        ball.dy = -ball.dy;
        randomColor();
    }
}

//BALL AND PADDLE COLLISION DETECTION
function BallAndPaddle() {
    if (ball.x <= paddle.x + paddle.width && ball.x >= paddle.x && ball.y >= paddle.y  && ball.y < paddle.y + Math.abs(ball.dy)) {

        //check where ball hit the paddle
        let collidePoint = ball.x - (paddle.x + paddle.width / 2);
        //ball on the left edge -> 0 - paddle.width/2 == -paddle.width/2
        //ball on the right edge -> (paddle.x + paddle.width) - (paddle.x + paddle.width/2) == paddle.width/2
        //ball in centre -> (paddle.x + paddle.width/2) - (paddle.x + paddle.width/2) == 0

        collidePoint = collidePoint / (paddle.width / 2); // -1 to 1

        let angle = (collidePoint * Math.PI) / 3;
        //ex. (0,5 * PI) / 3 == 30 degrees ... max. angle = 60 degrees

        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = - ball.speed * Math.cos(angle);
    }
}


const brick = {
    rows: 1,
    columns: 5,
    width: 55,
    height: 20,
    offSetLeft: 20,
    offSetTop: 20,
    marginTop: 40,
    fillColor: "#2e3548",
    strokeColor: "#FFF"
}

let bricks = [];
for (let r = 0; r < brick.rows; r++) {
    bricks[r] = [];
    for (let c = 0; c < brick.columns; c++) {
        bricks[r][c] = {
            x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
            y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
            status: 1
        }
    }
}

//DRAW BRICKS
// status 1 = paint the brick
// status 0 = the brick was hit by a ball, delete it
function drawBricks() {
    for (let r = 0; r < brick.rows; r++) {
        for (let c = 0; c < brick.columns; c++) {
            let b = bricks[r][c];

            if (b.status == 1) {
                ctx.beginPath();
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);
                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//BALL AND BRICK COLLISION DETECTION
function collisionDetection() {
    for (let r = 0; r < brick.rows; r++) {
        for (let c = 0; c < brick.columns; c++) {
            let b = bricks[r][c]; //konkretni brick konkretniho sloupecku

            if (b.status == 1) {

                if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height) {
                    ball.dy = -ball.dy;
                    b.status = 0; //uz se nevykresli znova
                    score++; //score se zvetsi o 1
                }
            }
        }
    }
}


//DEAD END!
function deadEnd() {
    if (ball.y + ball.radius >= canvas.height) {
        life--; //lose a life
        resetBall();

        //GAME OVER
        if (!life) {
            gameOver = true;
            cancelAnimationFrame(internalCycle);
            //youLose();
        }
    }
}

//RESET BALL POSITION
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = paddle.x - ball.radius;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}

//DRAW GAME STATISTICS -> LIVES, SCORE, LEVEL
function drawGameStats(text, textX, textY, img, imgX, imgY) {
    //draw text
    ctx.font = '16px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(text, textX, textY);
    //draw image
    ctx.drawImage(img, imgX, imgY, width = 25, height = 25);    
}

//DRAW EVERYTHING AT ONCE
function draw() {
    //draw paddle
    drawPaddle();
    //draw ball
    drawBall();
    //draw bricks
    drawBricks();

    //score
    drawGameStats(score, 35, 25, score_img, 5, 5);
    //life
    drawGameStats(life, canvas.width - 25, 25, life_img, canvas.width - 55, 5);
    
}

//UPDATE EVERYTHING
function update() {
    paddleMovement();
    ballMovement();

    ballAndWall();
    BallAndPaddle();
    collisionDetection();

    deadEnd();
}

//ALL OVER AGAIN DOMINO EFFECT
function internalCycle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //ctx.drawImage(bg_img, 0, 0, canvas.width, canvas.height);

    draw();
    update();
    
    document.addEventListener('keydown', function (e) {
        if (e.keyCode === 13 || e.keyCode === 32) {
            frameStart = true;
        }
    }, { once: true });

    if (!gameOver) {
            requestAnimationFrame(internalCycle);
    }
}

internalCycle(); //for once

//what to do next
    // = speed the ball up

