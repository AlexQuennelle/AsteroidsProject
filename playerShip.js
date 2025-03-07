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
     * @public
     */
    this.score = 0;
    /**
     * The number of lives the player has remaining
     * @type {number}
     * @private
     */
    this.lives = 3;
    /**
     * The number of points the player has made towards the next bonus life
     * @type {number}
     * @private
     */
    this.progressToNextLife = 0;
    /**
     * The number of frames left in the player's invincibilty
     * @type {number}
     * @public
     */
    this.iFrames = 0;
    /**
     * The number of frames before the player can shoot again
     * @type {number}
     * @private
     */
    this.shootCooldown = 0;
    /**
     * The number of frames before the player regains control after respawning
     * @type {number}
     * @private
     */
    this.respawnTime = 0;
  }

  Update() {
    if (this.respawnTime > 0) {
      this.respawnTime--;
    } else {
      this.shootCooldown = this.shootCooldown > 0 ? this.shootCooldown - 1 : 0;
      this.iFrames = this.iFrames > 0 ? this.iFrames - 1 : 0;
      this.HandleInput();
      super.Update();
      this.velocity = p5.Vector.mult(this.velocity, 0.9);
      this.angularVelocity *= 1 / (abs(this.angularVelocity) + 1);
      this.isDead = this.hit;
    }
  }

  Draw() {
    push();
    if (this.iFrames > 0) {
      fill(255, 100);
    }
    if (this.respawnTime <= 0) {
      super.Draw();
    }
    pop();
  }

  /**
   * Handles logic related to respawning and decrementing the lives on the player
   * @returns {void}
   * @public
   */
  Die() {
    super.Die();
    if (this.lives <= 0) {
      // TODO: proper game over logic
      print("GAME OVER!");
      gameInstance.GameOver();
    }
    this.hit = false;
    this.isDead = false;
    this.respawnTime = 30;
    this.iFrames = 60;
    this.lives--;

    this.position = createVector(
      gameInstance.resolution.x / 2,
      gameInstance.resolution.y / 2,
    );
    this.velocity = createVector(0, 0);
    this.rotation = 0;
  }

  Teleport() {
    this.respawnTime = 15;
    this.position = createVector(
      random(0, gameInstance.resolution.x),
      random(0, gameInstance.resolution.y),
    );
  }

  /**
   * Handles player input via keyboard
   * @returns {void}
   * @private
   */
  HandleInput() {
    const rotationSpeed = 0.2;
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
      this.Teleport();
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
   * @returns {void}
   * @private
   */
  Shoot() {
    let bullet = new Bullet(
      p5.Vector.add(this.position, createVector(0, -20).rotate(this.rotation)),
      true,
    );
    bullet.velocity = createVector(0, -10).rotate(this.rotation);
    this.velocity = p5.Vector.add(
      this.velocity,
      createVector(0, 1.25).rotate(this.rotation),
    );
    bullet.rotation = this.rotation;
    gameInstance.actors.push(bullet);
  }

  /**
   * increments the player's score and awards bonus lives every 10 000 points
   * @param {number} points
   * @returns {void}
   * @public
   */
  IncrementScore(points) {
    this.score += points;
    let previousProgress = this.progressToNextLife;
    this.progressToNextLife = (this.progressToNextLife + points) % 10000;
    if (previousProgress > this.progressToNextLife) {
      this.lives++;
    }
  }

  /**
   * @param {Actor[]} actors list of actors to check collision against
   * @returns {boolean}
   * @public
   */
  CheckCollisions(actors) {
    if (this.iFrames > 0) {
      return false;
    }
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
  }
}
