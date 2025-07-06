/**@type {Game} */
let gameInstance;
// Set to true to display debug info for saucer navigation
let debug = false;

function setup() {
  angleMode(DEGREES);
  createCanvas(800, 600).id("canvas");
  gameInstance = new Game();
}

function draw() {
  gameInstance.Update();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
