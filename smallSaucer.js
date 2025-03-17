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

    this.targetDir = createVector(1, 0);
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
    //firing logic
    if (this.shootCooldown <= 0) {
      this.Shoot();
    }
    this.shootCooldown = this.shootCooldown > 0 ? this.shootCooldown - 1 : 0;
    //set velocities to 0 if they're below a certain threshold
    this.velocity = p5.Vector.mult(this.velocity, 0.9);
    if (this.velocity.mag() <= 0.001) {
      this.velocity = createVector(0, 0);
    }

    this.CalculateThrust();

    if (this.upBooster) {
      this.velocity = p5.Vector.add(
        this.velocity,
        createVector(0, -0.02 * deltaTime),
      );
      gameInstance.particles.push(
        new Particle(
          p5.Vector.add(
            this.position,
            createVector(0, 10).rotate(random(-30, 30)),
          ),
          round(random(3, 10)),
          createVector(0, 0),
          1,
          "red",
        ),
      );
    }
    if (this.rightBooster) {
      this.velocity = p5.Vector.add(
        this.velocity,
        createVector(0.02 * deltaTime, 0),
      );
      gameInstance.particles.push(
        new Particle(
          p5.Vector.add(
            this.position,
            createVector(-20, 0).rotate(random(-30, 30)),
          ),
          round(random(3, 10)),
          createVector(0, 0),
          1,
          "red",
        ),
      );
    }
    if (this.downBooster) {
      this.velocity = p5.Vector.add(
        this.velocity,
        createVector(0, 0.02 * deltaTime),
      );
      gameInstance.particles.push(
        new Particle(
          p5.Vector.add(
            this.position,
            createVector(0, -10).rotate(random(-30, 30)),
          ),
          round(random(3, 10)),
          createVector(0, 0),
          1,
          "red",
        ),
      );
    }
    if (this.leftBooster) {
      this.velocity = p5.Vector.add(
        this.velocity,
        createVector(-0.02 * deltaTime, 0),
      );
      gameInstance.particles.push(
        new Particle(
          p5.Vector.add(
            this.position,
            createVector(20, 0).rotate(random(-30, 30)),
          ),
          round(random(3, 10)),
          createVector(0, 0),
          1,
          "red",
        ),
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

  Draw() {
    this.actorsSensed = this.actorsSensed.sort((a, b) => {
      return (
        p5.Vector.dist(this.position, a.position) -
        a.collisionRadius -
        (p5.Vector.dist(this.position, b.position) - b.collisionRadius)
      );
    });
    push();
    strokeWeight(5);
    fill(255, 0, 0, 128);
    let avgDir = createVector(0, 0);
    this.actorsSensed.forEach((actor) => {
      let dir = p5.Vector.sub(this.position, actor.position);
      dir = p5.Vector.mult(
        p5.Vector.normalize(dir),
        this.sensor.radius - (p5.Vector.mag(dir) - actor.collisionRadius),
      );
      avgDir = p5.Vector.add(avgDir, dir);
      noStroke();
      circle(actor.position.x, actor.position.y, actor.collisionRadius * 2);
      stroke("red");
      line(
        this.position.x,
        this.position.y,
        this.position.x + dir.x,
        this.position.y + dir.y,
      );
    }, this);
    if (this.actorsSensed.length > 1) {
      avgDir = p5.Vector.div(avgDir, this.actorsSensed.length - 1);
    }
    avgDir = p5.Vector.mult(
      this.targetDir,
      1 - avgDir.mag() / this.sensor.radius,
    )
      .add(p5.Vector.normalize(avgDir).mult(avgDir.mag() / this.sensor.radius))
      .mult(this.sensor.radius);
    stroke(0, 0, 255, 128);
    line(
      this.position.x,
      this.position.y,
      this.position.x + avgDir.x,
      this.position.y + avgDir.y,
    );
    pop();
    super.Draw();
    push();
    noFill();
    stroke("green");
    strokeWeight(2.5);
    circle(this.position.x, this.position.y, this.sensor.radius * 2);
    pop();
  }

  CalculateThrust() {
    this.upBooster = false;
    this.downBooster = false;
    this.leftBooster = false;
    this.rightBooster = false;

    let thrustDir = createVector(0, 0);
    this.actorsSensed.forEach((actor) => {
      let dir = p5.Vector.sub(this.position, actor.position);
      dir = p5.Vector.mult(
        p5.Vector.normalize(dir),
        this.sensor.radius - (p5.Vector.mag(dir) - actor.collisionRadius),
      );
      thrustDir = p5.Vector.add(thrustDir, dir);
    }, this);
    if (this.actorsSensed.length > 1) {
      thrustDir = p5.Vector.div(thrustDir, this.actorsSensed.length - 1);
    }
    thrustDir = p5.Vector.mult(
      this.targetDir,
      1 - thrustDir.mag() / this.sensor.radius,
    ).add(
      p5.Vector.normalize(thrustDir).mult(thrustDir.mag() / this.sensor.radius),
    );

    let alignment = p5.Vector.dot(thrustDir, this.targetDir);
    if (alignment < -0.5) {
      thrustDir = createVector(thrustDir.y, -thrustDir.x);
    }
    thrustDir = p5.Vector.normalize(thrustDir);

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

  /**
   * @param {vec2} actors
   */
  CheckCollisions(actors) {
    let isInRadius = (caller, actor, offset = createVector(0, 0)) => {
      return (
        caller.position.dist(p5.Vector.add(offset, actor.position)) <=
        caller.collisionRadius + actor.collisionRadius + this.sensor.radius
      );
    };
    this.actorsSensed = [];
    actors.forEach((actor) => {
      if (
        (isInRadius(this, actor) ||
          isInRadius(this, actor, createVector(0, gameInstance.resolution.y)) ||
          isInRadius(
            this,
            actor,
            createVector(0, -gameInstance.resolution.y),
          )) &&
        //this.sensor.CheckCollision(this.position, 0, actor) &&
        actor.collisionLayer !== this.collisionLayer
      ) {
        this.actorsSensed.push(actor);
      }
    }, this);
    return super.CheckCollisions(actors);
  }
}
