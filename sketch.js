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
}
