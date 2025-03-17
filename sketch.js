/**@type {Game} */
let gameInstance;

function setup() {
  angleMode(DEGREES);
  createCanvas(windowWidth, windowHeight);
  gameInstance = new Game();
}

function draw() {
  gameInstance.Update();
  push();
  noStroke();
  fill(50);
  rect(0, 0, (width - gameInstance.resolution.x) / 2, height);
  rect(
    width / 2 + gameInstance.resolution.x / 2,
    0,
    (width - gameInstance.resolution.x) / 2,
    height,
  );

  rect(0, 0, width, (height - gameInstance.resolution.y) / 2);
  rect(
    0,
    height / 2 + gameInstance.resolution.y / 2,
    width,
    (height - gameInstance.resolution.y) / 2,
  );
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
