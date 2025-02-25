/**
 * Anything that interacts with the physics system
 * @class
 */
class Actor {
  /**
   * @param {vec2} pos The initial position of the actor
   * @param {Collider[]} cols A list of colliders that make up the actor's collision shape
   */
  constructor(pos, cols) {
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
    this.radius = Collider.GetRadius(colliders);
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
    this.colliders.forEach((_col) => {
      // TODO: Add collider adjustment
      colliders.push(new Collider());
    });
    return colliders;
  }
}
