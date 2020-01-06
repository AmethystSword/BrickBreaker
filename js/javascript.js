
const PADDLE_HEIGHT = 20;
let PADDLE_WIDTH = 200;
const BALL_RADIUS = 15;

const bottomPaddleMargin = 50;

let gameOver = false;
let gamePaused = true;

let rightArrowPressed = false;
let leftArrowPressed = false;

let score = 0;
let life = 5;
let level = 1;
const maxLevel = 6;

const paddle = {
    x: canvas.width / 2 - PADDLE_WIDTH / 2,
    y: canvas.height - PADDLE_HEIGHT - bottomPaddleMargin,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dx: 7,
    fColor: '#2e3548',
    strColor: 'black',
    lineWidth: 3
}

//DRAW PADDLE
function drawPaddle() {
    ctx.beginPath();
    ctx.lineWidth = paddle.lineWidth;
    ctx.fillStyle = paddle.fColor;
    ctx.strokeStyle = paddle.strColor;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
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
    fColor: undefined,
    //strColor: 'black',
    //lineWidth: 3
}
const colors = ['green', 'pink', '#fe997e', '#e7d2df',
    '#d4636f', '#b3e885', '#f2e6e6', '#952572', '#ed1c24'];
function randomColor() {
    ball.fColor = colors[Math.round(Math.random() * colors.length)];
}


//DRAW BALL
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    if (ball.fColor === undefined) {
        ctx.fillStyle = 'white';
    }
    else {
        ctx.fillStyle = ball.fColor;
    }
    ctx.fill();
    //ctx.lineWidth = ball.lineWidth;
    //ctx.strokeStyle = ball.strColor;
    //ctx.stroke();
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
        paddle_wall_hit.play();
    }

    if (ball.y - ball.radius <= 0) {
        ball.dy = -ball.dy;
        randomColor();
        paddle_wall_hit.play();
    }
}

//BALL AND PADDLE COLLISION DETECTION
function BallAndPaddle() {
    if (ball.x <= paddle.x + paddle.width && ball.x >= paddle.x && ball.y + ball.radius >= paddle.y && ball.y < paddle.y + Math.abs(ball.dy)) {

        paddle_wall_hit.play();

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
    columns: 8,
    width: 80,
    height: 20,
    offSetTop: 20,
    marginTop: 40,
    fColor: '#2e3548',
    strColor: 'brick',
    lineWidth: 4
}
let offSetLeft = ((canvas.width / brick.columns) - brick.width) / 2;

//CREATE BRICKS - even new bricks
let bricks = [];

function createBricks() {
    for (let r = 0; r < brick.rows; r++) {
        bricks[r] = [];
        for (let c = 0; c < brick.columns; c++) {
            bricks[r][c] = {
                x: c * (brick.width + 2 * offSetLeft) + offSetLeft,
                y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                status: 1
            }
        }
    }
}
createBricks();


//DRAW BRICKS
// status 1 = paint the brick
// status 0 = the brick was hit by a ball, delete it
function drawBricks() {
    for (let r = 0; r < brick.rows; r++) {
        for (let c = 0; c < brick.columns; c++) {
            let b = bricks[r][c];

            if (b.status == 1) {
                ctx.beginPath();
                ctx.fillStyle = brick.fColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);
                ctx.lineWidth = brick.lineWidth;
                ctx.strokeStyle = brick.strColor;
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
                    brick_hit.play();
                    ball.dy = -ball.dy;
                    b.status = 0; //uz se nevykresli znova
                    score++; //score se zvetsi o 1
                    if (score % 10 == 0 && score != 0) {
                        ball.speed += 0.5;
                    }
                }
            }
        }
    }
}


//DEAD END!
function deadEnd() {
    if (ball.y + ball.radius > canvas.height + 2 * ball.radius) {
        life--; //lose a life
        life_lost.play();

        //GAME OVER
        if (life <= 0) {
            gameOver = true;
            draw();
            youLose(); //gameover screen
        }
        else {
            resetBall();
        }
    }
}

function levelUp() {
    let levelDone = true;

    for (let r = 0; r < brick.rows; r++) {
        for (let c = 0; c < brick.columns; c++) {
            levelDone = levelDone && !bricks[r][c].status;
            //false if some bricks are still there --> true + false == false
        }
    }
    if (levelDone === true) {
        console.log('true');
        if (level >= maxLevel) {
            youWin(); //win screen
            gameOver = true;
            return; //dont go to following lines in this if loop
        }
        level_cleared.play();
        brick.rows++;
        createBricks();

        if (level > 1) {
            paddle.dx += 2;
            ball.speed += 1;
            console.log(ball.speed);
        }
        level++;
        resetBall();
    }
}

//RESET BALL POSITION
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = paddle.y - ball.radius;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -(Math.sqrt(Math.pow(ball.speed, 2) - Math.pow(ball.dx, 2)));
    paddle.x = canvas.width / 2 - paddle.width / 2;
    paddle.y = canvas.height - paddle.height - bottomPaddleMargin;
    pausePlayImg.src = 'img/play.png';
    gamePaused = !gamePaused;
    draw();
}

//DRAW GAME STATISTICS -> LIVES, SCORE, LEVEL
function drawGameStats(text, textX, textY, img, imgX, imgY) {
    //draw text
    ctx.font = '500 35px Alegreya, serif';
    ctx.fillStyle = 'black';
    ctx.fillText(text, textX, textY);
    //draw image
    ctx.drawImage(img, imgX, imgY, img.width, img.height);
}

//DRAW EVERYTHING AT ONCE
function draw() {
    ctx.drawImage(bg_img, 0, 0, canvas.width, canvas.height);

    drawBricks();
    drawBall();
    drawPaddle();
    //score
    drawGameStats(score, 40, 30, score_img, 8, 8);
    //life
    drawGameStats(life, canvas.width - 30, 30, life_img, canvas.width - 65, 5);
    //level
    drawGameStats(level, canvas.width / 2, 30, level_img, canvas.width / 2 - 33, 8);
}

//UPDATE EVERYTHING
function update() {
    paddleMovement();
    ballMovement();

    ballAndWall();
    BallAndPaddle();
    collisionDetection();

    deadEnd();
    levelUp();
}


//ALL OVER AGAIN DOMINO EFFECT
function EternalCycle() {
    if (gamePaused == true) {
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    draw();
    update();

    if (gameOver !== true) {
        requestAnimationFrame(EternalCycle);
    }
}

let first = 0;
//FIRST START
$(document).keydown(function (e) {
    if (e.keyCode == 80 || e.keyCode === 13 || e.keyCode === 32) {
        if (first == 0) {
            first = 1;
            $('#press').fadeOut();
            EternalCycle();
        }
        pausePlayManager();
    }
});


ctx.font = '500 35px Alegreya, serif';
ctx.fillStyle = 'black';
ctx.fillText('', 50, 400); //bez tohohle se nejak spatne zobrazuje font xd

window.onload = function () { draw(); } //draw once before moving


//SOUND MUTE/UNMUTE BUTTON CHANGE
let soundImg = document.getElementById('sound');
soundImg.addEventListener('click', audioManager);

function audioManager() {
    let soundImgSrc = soundImg.getAttribute('src');
    //conditional (ternary) operator
    let soundImgNewSrc = soundImgSrc == 'img/SOUND_ON.png' ? 'img/SOUND_OFF.png' : 'img/SOUND_ON.png';
    // SoundImgSrc == 'img/SOUND_ON.png'     -->  condition 
    // ? execution -> if condition = true
    // : execution -> if condition = false
    soundImg.setAttribute('src', soundImgNewSrc); //soundElement.src = soundImg

    paddle_wall_hit.muted = paddle_wall_hit.muted ? false : true;
    brick_hit.muted = brick_hit.muted ? false : true;
    level_cleared.muted = level_cleared.muted ? false : true;
    life_lost.muted = life_lost.muted ? false : true;
    happy_end.muted = happy_end.muted ? false : true;
    game_over_sound.muted = game_over_sound.muted ? false : true;
}

//PAUSE/PLAY BUTTON CHANGE
let pausePlayImg = document.getElementById('pause');
pausePlayImg.addEventListener('click', pausePlayManager);

function pausePlayManager() {
    console.log(ball.fColor);
    let pausePlayImgSrc = pausePlayImg.getAttribute('src');
    let pausePlayImgNewSrc = pausePlayImgSrc == 'img/pause.png' ? 'img/play.png' : 'img/pause.png';
    pausePlayImg.setAttribute('src', pausePlayImgNewSrc);

    if (pausePlayImgNewSrc == 'img/pause.png') { //pause the game
        gamePaused = !gamePaused;
        EternalCycle();
    }

    if (pausePlayImgNewSrc == 'img/play.png') {
        gamePaused = !gamePaused;

    }
}

const endScreen = document.getElementById('endScreen');
const win = document.getElementById('win');
const lose = document.getElementById('lose');
const again = document.getElementById('again');
const victory = document.getElementById('victory');
const press = document.getElementById('press');

//CLICK ON PLAY AGAIN BUTTON
again.onclick = function () { location.reload(); }

//CHANGE PLAY AGAIN BUTTON COLOR
again.addEventListener('mouseover', function () { again.style.color = '#A0DB8E'; })
$('#again').mouseout(function () { again.style.color = '#FFF'; });

//YOU WIN IMAGE
function youWin() {
    endScreen.style.display = 'block';
    win.style.display = 'block';
    again.style.display = 'block';
    victory.style.display = 'block';
    happy_end.play();
}

//YOU LOSE IMAGE
function youLose() {
    endScreen.style.display = 'block';
    lose.style.display = 'block';
    again.style.display = 'block';
    game_over_sound.play();
}


