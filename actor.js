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
     * @private
     */
    this.rotation = 0;
    /**
     * The actor's current velocity
     * @type {vec2}
     * @private
     */
    this.velocity = createVector(0, 0);
    /**
     * The speed at which the object is rotating
     * @type {number}
     * @private
     */
    this.angularVelocity = 0;
    /**
     * List of colliders that make up the actor's shape for the physics system
     * @type {Collider[]}
     * @public
     */
    this.colliders = cols;
    /**
     * Radius of the object. Used to cull unnessecary collision checks.
     * @type {number}
     * @public
     */
    this.collisionRadius = Collider.GetRadius(cols);
    this.points = verts;
    this.hit = false;
    this.isDead = false;
  }

  Update() {
    this.position = p5.Vector.add(this.position, this.velocity);
    this.rotation += this.angularVelocity;
    this.isDead = this.hit;
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
   */
  Die() {
    // TODO: Implement particle spawning etc.
    print(this);
    print("died");
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
      for (let j = 0; j < this.colliders.length; j++) {
        col |= this.colliders[j].CheckCollision(
          this.position,
          this.rotation,
          actors[i],
        );
        if (col) {
          break;
        }
      }
    }
    return col;
  }

  /**
   * Adjusts the positions and rotations of the actor's colliders.
   * @returns {Collider[]}
   */
  GetColliders() {
    /**@type {Collider[]} */
    let colliders = [];
    this.colliders.forEach((col) => {
      if (col instanceof CircleCollider) {
        colliders.push(
          new CircleCollider(
            p5.Vector.rotate(col.position, this.rotation).add(this.position),
            col.radius,
          ),
        );
      } else {
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
