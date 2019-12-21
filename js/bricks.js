// status 1 = paint the brick
// status 0 = the brick was hit by a ball, delete it
function drawBricks() {
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

function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r]; //konkretni brick konkretniho sloupecku

            if (b.status == 1) {
                if ((x + ballRadius >= b.x && x - ballRadius <= b.x + brickWidth) && (y - ballRadius >= b.y && y - ballRadius <= b.y + brickHeight)) { ///:::DGSFGFDSH
                    dy = -dy;
                    b.status = 0; //u6 se nevykresli znova
                }
            }
        }
    }
}

