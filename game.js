let paddle;
let ball;
let bricks = [];
let brickRowCount = 5;
let brickColumnCount = 7;
let brickWidth;
let brickHeight;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let score = 0;
let lives = 3;
function setup() {
  createCanvas(400, 400);
  brickWidth = 40;
  brickHeight = 20;

  paddle = new Paddle();
  ball = new Ball();

  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let pointValue = Math.floor(random(1, 6));
      let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
      let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
      bricks.push(
        new Brick(brickX, brickY, brickWidth, brickHeight, pointValue)
      );
    }
  }
}

function draw() {
  background(0);

  paddle.update();
  paddle.display();

  ball.update();
  ball.display();

  ball.check_paddle_collision(paddle);

  for (let i = bricks.length - 1; i >= 0; i--) {
    let brick = bricks[i];
    if (ball.check_brick_collision(brick)) {
      score += brick.pointValue;
      bricks.splice(i, 1);
    } else {
      brick.display();
    }
  }

  textSize(20);
  fill(255);
  text("Score: " + score, 10, 30);
  text("Lives: " + lives, 300, 30);

  if (ball.y > height && lives > 0) {
    textSize(30);
    fill(255);
    lives--;
    setup();
  }

  if (ball.y > height && lives == 0) {
    textSize(30);
    fill(255);
    text("Game Over :(", width / 2 - 80, height / 2);
    noLoop();
  }

  if (won(bricks)) {
    text("Game Won :)", width / 2 - 80, height / 2);
    noLoop();
  }
}

function won(bricks) {
  return bricks.length == 0;
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    paddle.moveLeft();
  } else if (keyCode === RIGHT_ARROW) {
    paddle.moveRight();
  }
}

function keyReleased() {
  paddle.stop();
}

class Paddle {
  constructor() {
    this.width = 100;
    this.height = 10;
    this.x = width / 2 - this.width / 2;
    this.y = height - 20;
    this.speed = 10;
    this.direction = 0;
  }

  display() {
    fill(255);
    rect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.x += this.direction * this.speed;
    this.x = constrain(this.x, 0, width - this.width);
  }

  moveLeft() {
    this.direction = -1;
  }

  moveRight() {
    this.direction = 1;
  }

  stop() {
    this.direction = 0;
  }
}

class Ball {
  constructor() {
    this.radius = 10;
    this.x = width / 2;
    this.y = height / 2;
    this.speedX = 4;
    this.speedY = -4;
  }

  display() {
    fill(255);
    circle(this.x, this.y, 2 * this.radius);
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < this.radius || this.x > width - this.radius) {
      this.speedX *= -1;
    }
    if (this.y < this.radius) {
      this.speedY *= -1;
    }
  }

  check_paddle_collision(paddle) {
    if (
      this.y + this.radius >= paddle.y &&
      this.x >= paddle.x &&
      this.x <= paddle.x + paddle.width
    ) {
      this.speedY *= -1;
    }
  }

  check_brick_collision(brick) {
    if (
      this.y - this.radius <= brick.y + brick.height &&
      this.y + this.radius >= brick.y &&
      this.x >= brick.x &&
      this.x <= brick.x + brick.width
    ) {
      this.speedY *= -1;
      return true;
    }
    return false;
  }
}

class Brick {
  constructor(x, y, width, height, pointValue) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.pointValue = pointValue;
  }

  display() {
    if (this.pointValue == 1) fill("green");
    if (this.pointValue == 2) fill("yellow");
    if (this.pointValue == 3) fill("blue");
    if (this.pointValue == 4) fill("red");
    if (this.pointValue == 5) fill("white");
    rect(this.x, this.y, this.width, this.height);
    textSize(12);
    fill(0);
    text(
      this.pointValue,
      this.x + this.width / 2 - 5,
      this.y + this.height / 2 + 5
    );
  }
}
