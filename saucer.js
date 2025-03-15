class Saucer extends Actor {
  /**
   * @param {vec2} pos The position to spawn the saucer
   */
  constructor(pos) {
    /**@type {vec2[]} */
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
    /**@type {Collider[]} */
    let colliders = [
      new CircleCollider(createVector(0, 0), 18),
      new Collider([verts[0], verts[1], verts[2], verts[3]]),
      new Collider([verts[4], verts[5], verts[6], verts[7]]),
    ];
    super(pos, verts, colliders, 2);
    /**
     * The number of frames until the saucer can fire a projectile
     * @type {number}
     * @protected
     */
    this.shootCooldown = round(random(15, 60));
    /**
     * The direction the saucer is moving
     * @type {vec2}
     * @protected
     */
    this.moveDir = createVector(random() > 0.5 ? 1 : -1, 0).normalize();
    if (this.moveDir.x < 0) {
      //this.position.add(createVector(gameInstance.resolution.x, 0));
    }
    /**
     * The amount the saucer's aim can be randomly rotated in either direciton
     * @type {number}
     * @protected
     */
    this.aimRange = 22.5;
  }

  Die() {
    if (
      this.hitLayers.some((layer) => {
        return layer === 0;
      }, this)
    ) {
      gameInstance.player.IncrementScore(
        this instanceof SmallSaucer ? 1000 : 200,
      );
    }
    super.Die();
  }

  Update() {
    //firing logic
    if (this.shootCooldown <= 0) {
      this.Shoot();
    }
    this.shootCooldown = this.shootCooldown > 0 ? this.shootCooldown - 1 : 0;

    //handle random movement
    this.moveDir.rotate(random(-5, 5));
    this.velocity.add(p5.Vector.normalize(this.moveDir).mult(0.02 * deltaTime));
    this.velocity = p5.Vector.mult(this.velocity, 0.9);
    if (this.velocity.mag() <= 0.001) {
      this.velocity = createVector(0, 0);
    }
    if (abs(this.angularVelocity) <= 0.001) {
      this.angularVelocity = 0;
    }

    //update the actor's position with it's velocity
    this.position = p5.Vector.add(this.position, this.velocity);

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

  /**
   * spawns a bullet owned by the saucer and gives it velocity
   * @returns {void}
   * @protected
   */
  Shoot() {
    this.shootCooldown = random(60, 180);
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

  Draw() {
    push();
    fill("orange");
    super.Draw();
    push();
    noStroke();
    circle(this.position.x, this.position.y, this.colliders[0].radius * 2);
    pop();
    pop();
  }
}
