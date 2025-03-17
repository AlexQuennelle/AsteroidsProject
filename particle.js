class Particle {
  constructor(
    pos,
    lifetime,
    velocity = createVector(0, 0),
    damping = 1,
    col = "white",
  ) {
    /**@type {vec2} */
    this.position = pos;
    /**@type {number} */
    this.lifetime = lifetime;
    /**@type {vec2} */
    this.velocity = velocity;
    /**@type {number} */
    this.damping = damping;
    this.col = col;
  }

  Update() {
    this.lifetime--;
    this.velocity = p5.Vector.mult(this.velocity, this.damping);
    this.position = p5.Vector.add(this.position, this.velocity);
    this.Draw();
  }

  Draw() {
    push();
    fill(this.col);
    noStroke();
    circle(this.position.x, this.position.y, 5);
    pop();
  }
}
