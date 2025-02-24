/**
 * Anything that interacts with the physics system
 * @class
 */
class Actor {
  constructor() {
    /**
     * List of colliders that make up the actor's shape for the physics system
     * @type {Collider[]}
     * @private
     */
    this.colliders = [];
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
    let overlapped = false;
    actors.forEach((element) => {});
  }
}
