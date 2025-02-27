/**@type {Game} */
let gameInstance;

function setup() {
  angleMode(DEGREES);
  createCanvas(windowWidth, windowHeight);
  gameInstance = new Game();
  //frameRate(0.6);
}

function draw() {
  background(5);
  gameInstance.Update();
  //gameInstance.player.position = createVector(mouseX, mouseY);
  circle(width / 2, height / 2, 5);
}
