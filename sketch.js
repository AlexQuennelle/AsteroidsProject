let gameInstance;

function setup() {
  angleMode(DEGREES);
  createCanvas(windowWidth, windowHeight);
  gameInstance = new Game();
}

function draw() {
  background(5);
  gameInstance.Update();
  circle(width / 2, height / 2, 5);
}
