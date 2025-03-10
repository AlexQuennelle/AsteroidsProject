/**
 * Anything that interacts with the physics system
 * @class
 */
class Actor {
  /**
   * @param {vec2} pos The initial position of the actor
   * @param {vec2[]} verts The vertices that make up the actor's shape
   * @param {Collider[]} cols A list of colliders that make up the actor's collision shape
   */
  constructor(pos, verts, cols) {
    /**
     * The actor's current position in 2D space
     * @type {vec2}
     * @public
     */
    this.position = pos;
    /**
     * The actor's current rotation angle in degrees
     * @type {number}
     * @protected
     */
    this.rotation = 0;
    /**
     * The actor's current velocity
     * @type {vec2}
     * @protected
     */
    this.velocity = createVector(0, 0);
    /**
     * The speed at which the object is rotating
     * @type {number}
     * @protected
     */
    this.angularVelocity = 0;
    /**
     * List of colliders that make up the actor's shape for the physics system
     * @type {Collider[]}
     * @protected
     */
    this.colliders = cols;
    /**
     * Radius of the object. Used to cull unnessecary collision checks.
     * @type {number}
     * @public
     */
    this.collisionRadius = Collider.GetRadius(cols);
    /**
     * The points that make up the actor
     * @type {vec2[]}
     * @protected
     */
    this.points = verts;
    /**
     * Wether the actor collided with another
     * @type {boolean}
     * @public
     */
    this.hit = false;
    /**
     * Wether the actor is dead and should be ignored in future update ticks
     * @type {boolean}
     * @public
     */
    this.isDead = false;
  }

  /**
   * Physics tick update
   * @returns {void}
   * @public
   */
  Update() {
    //set velocities to 0 if they're below a certain threshold
    if (this.velocity.mag() <= 0.001) {
      this.velocity = createVector(0, 0);
    }
    if (abs(this.angularVelocity) <= 0.001) {
      this.angularVelocity = 0;
    }

    //update the actor's position with it's velocity
    this.position = p5.Vector.add(this.position, this.velocity);
    this.rotation += this.angularVelocity;

    //kill the actor if it has been hit
    this.isDead = this.hit;

    //wrap the actor's position at the edges of the game
    this.position = createVector(
      (this.position.x + gameInstance.resolution.x) % gameInstance.resolution.x,
      (this.position.y + gameInstance.resolution.y) % gameInstance.resolution.y,
    );
  }

  /**
   * Draws the actor
   * @returns {void}
   * @public
   */
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

  /**
   * Handles dying logic on an actor
   * @returns {void}
   * @public
   */
  Die() {
    // TODO: Implement particle spawning etc.
  }

  /**
   * Checks collisions against other actors.
   * Returns true if any of the current actor's colliders overlap
   * any other collider
   * @param {Actor[]} actors list of actors to check collision against
   * @returns {boolean}
   * @public
   */
  CheckCollisions(actors) {
    let col = false;
    for (let i = 0; i < actors.length; i++) {
      if (
        this.position.dist(actors[i].position) >
        this.collisionRadius + actors[i].collisionRadius
      ) {
        continue;
      }
      let actorCol = false;
      for (let j = 0; j < this.colliders.length; j++) {
        actorCol ||= this.colliders[j].CheckCollision(
          this.position,
          this.rotation,
          actors[i],
        );
        if (actorCol) {
          if (
            (this instanceof Bullet && this.isPlayerBullet) ||
            (actors[i] instanceof Bullet && actors[i].isPlayerBullet)
          ) {
            if (actors[i] instanceof Saucer) {
              gameInstance.player.IncrementScore(
                actors[i] instanceof SmallSaucer ? 1000 : 200,
              );
            }
            if (this instanceof Saucer) {
              gameInstance.player.IncrementScore(
                this instanceof SmallSaucer ? 1000 : 200,
              );
            }
            if (actors[i] instanceof Asteroid || this instanceof Asteroid) {
              let points = 0;
              switch (actors[i].size) {
                case 1:
                  points = 100;
                  break;
                case 2:
                  points = 50;
                  break;
                case 3:
                  points = 20;
                  break;
              }
              gameInstance.player.IncrementScore(points);
            } else if (actors[i] instanceof Saucer) {
              print("saucer");
              gameInstance.player.IncrementScore(
                actors[i] instanceof SmallSaucer ? 1000 : 200,
              );
            }
          }
          actors[i].hit = true;
          col ||= actorCol;
          break;
        }
      }
    }
    return col;
  }

  /**
   * Adjusts the positions and rotations of the actor's colliders.
   * @returns {Collider[]}
   * @public
   */
  GetColliders() {
    /**@type {Collider[]} */
    let colliders = [];
    this.colliders.forEach((col) => {
      //special case for circle colliders
      if (col instanceof CircleCollider) {
        colliders.push(
          new CircleCollider(
            p5.Vector.rotate(col.position, this.rotation).add(this.position),
            col.radius,
          ),
        );
      } else {
        /**@type {vec2[]} */
        let newVerts = [];
        for (let i = 0; i < col.verts.length; i++) {
          newVerts.push(
            p5.Vector.rotate(col.verts[i], this.rotation).add(this.position),
          );
        }
        colliders.push(new Collider(newVerts, col.normals));
      }
    });
    return colliders;
  }
}
