/**@type {Game} */
let gameInstance;

function setup() {
  angleMode(DEGREES);
  createCanvas(windowWidth, windowHeight);
  gameInstance = new Game();
  //frameRate(0.6);
}

function draw() {
  gameInstance.Update();
  push();
  noStroke();
  fill(50);
  rect(0,0,(width - gameInstance.resolution.x) / 2, height);
  rect((width / 2 + gameInstance.resolution.x / 2),0,(width - gameInstance.resolution.x) / 2, height);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
