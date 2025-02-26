/**
 * Player controlled ship.
 */
class PlayerShip extends Actor {
  /**
   * @param {vec2} pos The position the player should spawn
   */
  constructor(pos) {
    let verts = [
      createVector(0, -25),
      createVector(15, 15),
      createVector(0, 10),
      createVector(-15, 15),
    ];
    let cols = [
      new Collider([verts[0], verts[1], verts[2]]),
      new Collider([verts[0], verts[2], verts[3]]),
    ];
    //call base constructor
    super(pos, cols);
    this.points = verts;
  }
  Update() {
    this.HandleInput();
    super.Update();
  }

  HandleInput() {
    const rotationSpeed = 0.005;
    const acceleration = createVector(0, -0.01 * deltaTime);
    // W
    if (keyIsDown(87)) {
      this.velocity = p5.Vector.add(
        this.velocity,
        p5.Vector.rotate(acceleration, this.rotation),
      );
    }
    // A
    if (keyIsDown(65)) {
      this.angularVelocity += -rotationSpeed * deltaTime;
    }
    // S
    if (keyIsDown(83)) {
    }
    // D
    if (keyIsDown(68)) {
      this.angularVelocity += rotationSpeed * deltaTime;
    }
  }

  Draw() {
    push();
    noStroke();
    beginShape(TRIANGLE_FAN);
    this.points.forEach((point) => {
      let adjustedVert = p5.Vector.rotate(point, this.rotation);
      vertex(
        adjustedVert.x + this.position.x,
        adjustedVert.y + this.position.y,
      );
    });
    endShape(CLOSE);
    pop();
  }
}
