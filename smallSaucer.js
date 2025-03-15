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

    this.sensor = new CircleCollider(createVector(0, 0), 200);
    this.upBooster = false;
    this.downBooster = false;
    this.leftBooster = false;
    this.rightBooster = false;

    this.actorsSensed = [];
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

    let bullet = new Bullet(
      p5.Vector.add(this.position, shootDir),
      this.collisionLayer,
    );
    bullet.velocity = p5.Vector.mult(shootDir, 10);
    this.velocity = p5.Vector.add(
      p5.Vector.mult(shootDir, -1.25),
      this.velocity,
    );
    gameInstance.actors.push(bullet);
  }

  Update() {
    //set velocities to 0 if they're below a certain threshold
    if (this.velocity.mag() <= 0.001) {
      this.velocity = createVector(0, 0);
    }

    //update the actor's position with it's velocity
    this.position = p5.Vector.add(this.position, this.velocity);
    this.rotation += this.angularVelocity;

    //kill the actor if it has been hit
    this.isDead = this.hit;

    //wrap the actor's position at the edges of the game
    this.position = createVector(
      this.position.x,
      (this.position.y + gameInstance.resolution.y) % gameInstance.resolution.y,
    );
    //kill saucers that leave the left or right edge of the screen
    if (
      this.position.x + 50 < 0 ||
      this.position.x - 50 > gameInstance.resolution.x
    ) {
      this.isDead = true;
    }
  }

  CheckCollisions(actors) {
    actors.forEach((actor) => {

    });
    return super.CheckCollisions(actors);
  }
}
