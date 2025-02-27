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
  /**
   * @param {vec2[]} vertices The vertices that make up the collider's shape.
   */
  constructor(vertices, normals = Collider.CalculateNormals(vertices)) {
    /**
     * List of vertices that make up a convex collider
     * @type {vec2[]}
     * @private
     */
    this.verts = vertices;
    /**
     * List of normals.
     * Derived from a list of vertices.
     * @type {vec2[]}
     * @private
     */
    this.normals = normals;
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
    let col = false;
    /**@type {vec2[]} */
    let adjustedVerts = [];
    /**@type {vec2[]} */
    let adjustedNormals = [];
    /**@type {Collider[]} */
    let colliders = actor.GetColliders();

    this.verts.forEach((vert) => {
      adjustedVerts.push(p5.Vector.rotate(vert, angle).add(pos));
    });
    this.normals.forEach((nor) => {
      adjustedNormals.push(p5.Vector.rotate(nor, angle));
    });
    colliders.forEach((collider) => {
      col |= Collider.CheckCollider(adjustedVerts, adjustedNormals, collider);
    });
    return col;
  }

  /******************************************/
  /*             Static Methods             */
  /******************************************/

  /**
   * Checks if
   * @param {vec2[]} verts The vertices of the current collider
   * @param {vec2[]} normals The normals of the current collider
   * @param {Collider} collider the collider to check against
   * @returns {boolean}
   * @private
   */
  static CheckCollider(verts, normals, collider) {
    let col = true;
    let allNors = normals.concat(collider.normals);
    allNors.forEach((nor) => {
      col &= this.CheckAxis(verts, collider.verts, nor);
    });
    return col;
  }

  /**
   * Checks if 2 convex shapes defined by lists of vertices overlap along a given axis.
   * @param {vec2[]} verts List of vertices that make up the first shape
   * @param {vec2[]} otherVerts List of vertices that make up the second shape
   * @param {vec2} axis The axis along which to test overlapping
   * @returns {boolean}
   * @private
   */
  static CheckAxis(verts, otherVerts, axis) {
    let min1 = Number.MAX_VALUE;
    let min2 = Number.MAX_VALUE;

    let max1 = Number.NEGATIVE_INFINITY;
    let max2 = Number.NEGATIVE_INFINITY;

    verts.forEach((vert) => {
      let proj = p5.Vector.dot(vert, axis);
      min1 = min1 > proj ? proj : min1;
      max1 = max1 < proj ? proj : max1;
    });
    otherVerts.forEach((vert) => {
      let proj = p5.Vector.dot(vert, axis);
      min2 = min2 > proj ? proj : min2;
      max2 = max2 < proj ? proj : max2;
    });
    return (min1 < max2 && min1 >= min2) || (min2 < max1 && min2 >= min1);
  }

  /**
   * Gets the distance of the furthest point from the center in an array of colliders
   * Used in culling the number of full collision checks
   * @param {Collider[]} colliders List of colliders to check
   * @returns {number}
   * @public
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

  /**
   * Calculates a list of normals from an array of vertices.
   * Assumes clockwise winding order.
   * @param {vec2[]} verts List of vertieces to caculate normal vectors from.
   * @returns {vec2[]}
   * @private
   */
  static CalculateNormals(verts) {
    /**@type {vec2[]} */
    let normals = [];
    for (let i = 0; i < verts.length; i++) {
      /**@type {vec2} */
      let nor = p5.Vector.sub(verts[i], verts[(i + 1) % verts.length]);
      nor = createVector(-nor.y, nor.x).normalize();
      if (normals.length < 1) {
        normals.push(nor);
      } else {
        let dupe = false;
        for (let i = 0; i < normals.length; i++) {
          dupe |=
            (nor.x === normals[i].x && nor.y === normals[i].y) ||
            (-nor.x === normals[i].x && -nor.y === normals[i].y);
        }
        if (!dupe) {
          normals.push(nor);
        }
      }
    }
    return normals;
  }
}
