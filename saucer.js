class Saucer extends Actor {
  /**
   * @param {vec2} pos The position to spawn the saucer
   */
  constructor(pos) {
    let verts = [
      createVector(20, -7.5),
      createVector(35, 7.5),
      createVector(-35, 7.5),
      createVector(-20, -7.5),
      createVector(-17.5, -7.5),
      createVector(-14, -18),
      createVector(14, -18),
      createVector(17.5, -7.5),
    ];
    let colliders = [
      new CircleCollider(createVector(0, 0), 18),
      new Collider([verts[0], verts[1], verts[2], verts[3]]),
      new Collider([verts[4], verts[5], verts[6], verts[7]]),
    ];
    super(pos, verts, colliders);
  }

  Draw() {
    super.Draw();
    push();
    noStroke();
    circle(this.position.x, this.position.y, 36);
    pop();
  }
}
