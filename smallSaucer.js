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

    /**
     * list of actors the saucer is aware of
     * @type {Actor[]}
     * @private
     */
    this.actorsSensed = [];

    this.targetDir = createVector(this.sensor.radius / 4, 0);
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
    this.velocity = p5.Vector.mult(this.velocity, 0.9);
    if (this.velocity.mag() <= 0.001) {
      this.velocity = createVector(0, 0);
    }

    this.CalculateThrust();

    if (this.upBooster) {
      this.velocity = p5.Vector.add(
        this.velocity,
        createVector(0, 0.02 * deltaTime),
      );
    }
    if (this.rightBooster) {
      this.velocity = p5.Vector.add(
        this.velocity,
        createVector(0.02 * deltaTime, 0),
      );
    }
    if (this.downBooster) {
      this.velocity = p5.Vector.add(
        this.velocity,
        createVector(0, -0.02 * deltaTime),
      );
    }
    if (this.leftBooster) {
      this.velocity = p5.Vector.add(
        this.velocity,
        createVector(-0.02 * deltaTime, 0),
      );
    }
    if (
      !(
        this.upBooster ||
        this.rightBooster ||
        this.downBooster ||
        this.leftBooster
      )
    ) {
      this.velocity = p5.Vector.add(
        this.velocity,
        random([
          createVector(0, 0.02 * deltaTime),
          createVector(0.02 * deltaTime, 0),
          createVector(0, -0.02 * deltaTime),
          createVector(-0.02 * deltaTime, 0),
        ]),
      );
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

  CalculateThrust() {
    this.upBooster = false;
    this.downBooster = false;
    this.leftBooster = false;
    this.rightBooster = false;

    let thrustDir = this.targetDir;
    this.actorsSensed.forEach((actor) => {
      let mag =
        this.sensor.radius -
        (p5.Vector.dist(this.position, actor.position) - actor.collisionRadius);
      let dir = p5.Vector.sub(this.position, actor.position)
        .normalize()
        .mult(-mag);
      print(`dir ${dir}`);
      thrustDir = p5.Vector.add(thrustDir, dir);
    });
    thrustDir = p5.Vector.div(thrustDir, this.actorsSensed.length + 1);
    thrustDir = p5.Vector.normalize(thrustDir);
    print(thrustDir);

    let xDir = p5.Vector.dot(thrustDir, createVector(1, 0));
    let yDir = p5.Vector.dot(thrustDir, createVector(0, 1));
    if (xDir >= 0.5) {
      this.rightBooster = true;
    } else if (xDir <= -0.5) {
      this.leftBooster = true;
    }
    if (yDir >= 0.5) {
      this.downBooster = true;
    } else if (yDir <= -0.5) {
      this.upBooster = true;
    }
  }

  CheckCollisions(actors) {
    this.actorsSensed = [];
    actors.forEach((actor) => {
      if (this.sensor.CheckCollision(this.position, 0, actor)) {
        this.actorsSensed.push(actor);
      }
    }, this);
    return super.CheckCollisions(actors);
  }
}
