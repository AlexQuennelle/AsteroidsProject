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
  constructor(pos, verts, cols, collisionLayer) {
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
    /**
     * The actor's collision layer.
     * Actors on the same collision layer will not collide
     * @type {number}
     * @protected
     */
    this.collisionLayer = collisionLayer;
    /**
     * The collision layers that have collided with this actor
     * @type {number[]}
     * @protected
     */
    this.hitLayers = [];
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
    let drawShape = (offset = createVector(0, 0)) => {
      push();
      noStroke();
      beginShape(TRIANGLE_FAN);
      this.points.forEach((point) => {
        let adjustedVert = p5.Vector.rotate(point, this.rotation).add(offset);
        vertex(
          adjustedVert.x + this.position.x,
          adjustedVert.y + this.position.y,
        );
      });
      endShape(CLOSE);
      pop();
    };
    drawShape();
    if (this.position.y - this.collisionRadius <= 0) {
      drawShape(createVector(0, gameInstance.resolution.y));
    }
    if (this.position.y + this.collisionRadius >= gameInstance.resolution.y) {
      drawShape(createVector(0, -gameInstance.resolution.y));
    }
    if (this.position.x - this.collisionRadius <= 0) {
      drawShape(createVector(gameInstance.resolution.x, 0));
    }
    if (this.position.x + this.collisionRadius >= gameInstance.resolution.x) {
      drawShape(createVector(-gameInstance.resolution.x, 0));
    }
  }

  /**
   * Handles dying logic on an actor
   * @returns {void}
   * @public
   */
  Die() {
    this.hitLayers = [];
    for (let i = 0; i < round(random(5, 15)); i++) {
      let particle = new Particle(
        this.position,
        round(random(3, 7)),
        p5.Vector.random2D().mult(random(1, 5)),
        0.9,
      );
      gameInstance.particles.push(particle);
    }
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
    let isInRadius = (caller, actor, offset = createVector(0, 0)) => {
      return (
        caller.position.dist(p5.Vector.add(offset, actor.position)) <=
        caller.collisionRadius + actor.collisionRadius
      );
    };
    let newActors = actors.filter((actor) => {
      return (
        (isInRadius(this, actor) ||
          isInRadius(
            this,
            actor,
            createVector(0, -gameInstance.resolution.y),
          ) ||
          isInRadius(this, actor, createVector(0, gameInstance.resolution.y)) ||
          isInRadius(
            this,
            actor,
            createVector(-gameInstance.resolution.x, 0),
          ) ||
          isInRadius(
            this,
            actor,
            createVector(gameInstance.resolution.x, 0),
          )) &&
        this.collisionLayer !== actor.collisionLayer
      );
    }, this);
    let col = false;
    for (let i = 0; i < newActors.length; i++) {
      if (newActors[i] instanceof PlayerShip && newActors[i].iFrames > 0) {
        continue;
      }
      let actorCol = false;
      for (let j = 0; j < this.colliders.length; j++) {
        actorCol ||= this.colliders[j].CheckCollision(
          this.position,
          this.rotation,
          newActors[i],
        );
        if (actorCol) {
          newActors[i].hitLayers.push(this.collisionLayer);
          newActors[i].hit = true;
          this.hitLayers.push(newActors[i].collisionLayer);
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
    let loop = (caller, offset = createVector(0, 0)) => {
      let colliders = [];
      caller.colliders.forEach((col) => {
        //special case for circle colliders
        if (col instanceof CircleCollider) {
          colliders.push(
            new CircleCollider(
              p5.Vector.rotate(
                p5.Vector.add(col.position, offset),
                caller.rotation,
              )
                .add(caller.position)
                .add(offset),
              col.radius,
            ),
          );
        } else {
          /**@type {vec2[]} */
          let newVerts = [];
          for (let i = 0; i < col.verts.length; i++) {
            newVerts.push(
              p5.Vector.rotate(col.verts[i], caller.rotation)
                .add(caller.position)
                .add(offset),
            );
          }
          colliders.push(new Collider(newVerts, col.normals));
        }
      });
      return colliders;
    };
    colliders = loop(this);
    //this.colliders.forEach((col) => {
    //  //special case for circle colliders
    //  if (col instanceof CircleCollider) {
    //    colliders.push(
    //      new CircleCollider(
    //        p5.Vector.rotate(col.position, this.rotation).add(this.position),
    //        col.radius,
    //      ),
    //    );
    //  } else {
    //    /**@type {vec2[]} */
    //    let newVerts = [];
    //    for (let i = 0; i < col.verts.length; i++) {
    //      newVerts.push(
    //        p5.Vector.rotate(col.verts[i], this.rotation).add(this.position),
    //      );
    //    }
    //    colliders.push(new Collider(newVerts, col.normals));
    //  }
    //});
    if (this.position.y - this.collisionRadius <= 0) {
      colliders = colliders.concat(
        loop(this, createVector(0, gameInstance.resolution.y)),
      );
    }
    if (this.position.y + this.collisionRadius >= gameInstance.resolution.y) {
      colliders = colliders.concat(
        loop(this, createVector(0, -gameInstance.resolution.y)),
      );
    }
    if (this.position.x - this.collisionRadius <= 0) {
      colliders = colliders.concat(
        loop(this, createVector(gameInstance.resolution.x, 0)),
      );
    }
    if (this.position.x + this.collisionRadius >= gameInstance.resolution.x) {
      colliders = colliders.concat(
        loop(this, createVector(0, -gameInstance.resolution.x, 0)),
      );
    }
    return colliders;
  }
}
