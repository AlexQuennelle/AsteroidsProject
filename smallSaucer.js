class SmallSaucer extends Saucer {
  constructor(pos) {
    super(pos);
    this.points.forEach((point) => {
      point.mult(0.6);
    });
    this.colliders = [
      new CircleCollider(createVector(0, 0), 18 * 0.6),
      new Collider([
        this.points[0],
        this.points[1],
        this.points[2],
        this.points[3],
      ]),
      new Collider([
        this.points[4],
        this.points[5],
        this.points[6],
        this.points[7],
      ]),
    ];
    this.aimRange = 2.5;
  }

  /**
   * spawns a bullet owned by the saucer and gives it velocity
   * @returns {void}
   * @protected
   */
  Shoot() {
    this.shootCooldown = random(30, 120);
    let shootDir = p5.Vector.sub(gameInstance.player.position, this.position)
      .normalize()
      .rotate(random(-this.aimRange, this.aimRange));

    let bullet = new Bullet(p5.Vector.add(this.position, shootDir), false);
    bullet.velocity = p5.Vector.mult(shootDir, 10);
    this.velocity = p5.Vector.add(
      p5.Vector.mult(shootDir, -1.25),
      this.velocity,
    );
    gameInstance.actors.push(bullet);
  }
}
