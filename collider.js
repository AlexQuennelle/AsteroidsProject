/**
 * Contains functionality and data related to collision detection.
 * Performs the Separating Axis Theorem to detect collision.
 *
 * NOTE: Colliders must be convex
 * Concave objects can be constructed using multiple convex colliders.
 *
 * @class
 */
class Collider {
  constructor() {
    /**
     * List of vertices that make up a convex collider
     * @type {vec2[]}
     * @private
     */
    this.verts = [];
    /**
     * List of normals.
     * Derived from a list of vertices.
     * @type {vec2[]}
     * @private
     */
    this.normals = [];
  }

  /**
   * Checks if the current collider is overlapping any of an actor's colliders.
   * @param {vec2} pos The position of the collider's parent actor
   * @param {number} angle The angle of the collider's parent actor
   * @param {Actor} actor The actor to check collision against
   * @returns {boolean}
   * @public
   */
  CheckCollision(pos, angle, actor) {
  }


  /******************************************/
  /*             Static Methods             */
  /******************************************/

  /**
   * Gets the distance of the furthest point from the center in an array of colliders
   * Used in culling the number of full collision checks
   * @param {Collider[]} colliders List of colliders to check
   * @returns {number}
   */
  static GetRadius(colliders) {
    let r = 0;
    for (let c = 0; c < colliders.length; c++) {
      for (let v = 0; v < colliders[c].verts.length; v++) {
        let dist = p5.Vector.mag(colliders[c].verts[v]);
        if (dist > r) {
          r = dist;
        }
      }
    }
    return r;
  }
}
