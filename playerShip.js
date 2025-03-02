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
    super(pos, verts, cols);
    /**
     * The player's current score.
     * @type {number}
     */
    this.score = 0;
    /**
     * The number of lives the player has remaining
     * @type {number}
     */
    this.lives = 0;
    /**
     * The number of frames left in the player's invincibilty
     * @type {number}
     */
    this.iFrames = 0;
    this.shootCooldown = 0;
  }
  Update() {
    this.shootCooldown = this.shootCooldown > 0 ? this.shootCooldown - 1 : 0;
    this.iFrames = this.iFrames > 0 ? this.iFrames - 1 : 0;
    this.HandleInput();
    super.Update();
    this.velocity = p5.Vector.mult(this.velocity, 0.9);
    this.angularVelocity *= 1 / (abs(this.angularVelocity) + 1);
    this.isDead = this.hit;
  }

  HandleInput() {
    const rotationSpeed = 0.1;
    const acceleration = createVector(0, -0.02 * deltaTime);
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
    // Space
    if (keyIsDown(32)) {
      if (this.shootCooldown <= 0) {
        this.shootCooldown = 20;
        this.Shoot();
      }
    }
  }

  /**
   * Shoots a projectile
   */
  Shoot() {
    let bullet = new Bullet(
      p5.Vector.add(this.position, createVector(0, -20).rotate(this.rotation)),
      true,
    );
    bullet.velocity = createVector(0, -10).rotate(this.rotation);
    this.velocity = p5.Vector.add(this.velocity, createVector(0,2).rotate(this.rotation));
    bullet.rotation = this.rotation;
    gameInstance.actors.push(bullet);
  }

  /**
   * @param {Actor[]} actors list of actors to check collision against
   * @returns {boolean}
   * @public
   */
  CheckCollisions(actors) {
    let newActors = [];
    actors.forEach((actor) => {
      if (
        !(actor instanceof Bullet) ||
        (actor instanceof Bullet && !actor.isPlayerBullet)
      ) {
        newActors.push(actor);
      }
    });
    return super.CheckCollisions(newActors);
    //let col = false;
    //for (let i = 0; i < actors.length; i++) {
    //  if (actors[i] instanceof Bullet && actors[i].isPlayerBullet) {
    //    continue;
    //  }
    //  for (let j = 0; j < this.colliders.length; j++) {
    //    col |= this.colliders[j].CheckCollision(
    //      this.position,
    //      this.rotation,
    //      actors[i],
    //    );
    //    if (col) {
    //      break;
    //    }
    //  }
    //}
    //return col;
  }
}
