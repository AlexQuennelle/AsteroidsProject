/**
 * Simple collider for circular physics objects
 */
class CircleCollider extends Collider {
  constructor(position, radius) {
    //pass empty lists to the super constructor
    //because this collider is a circle it doesn't need vertices or normals
    super([], []);
    /**
     * The position of the collider relative to its parent
     * @type {vec2} position
     */
    this.position = position;
    /**
     * the radius of the collider
     * @type {number}
     */
    this.radius = radius;
  }

  /**
   * @inheritdoc
   * @param {vec2} pos The position of the collider's parent actor
   * @param {number} angle The anlge of the collider's parent actor
   * @param {Actor} actor The actor to check collision against
   */
  CheckCollision(pos, angle, actor) {
    let col = false;
    /**@type {vec2} */
    let adjustedPos = p5.Vector.rotate(this.position, angle).add(pos);
    /**@type {Collider[]} */
    let colliders = actor.GetColliders();

    colliders.forEach((collider) => {
      col ||= CircleCollider.CheckCollider(adjustedPos, this.radius, collider);
    });
    return col;
  }

  /******************************************/
  /*             Static Methods             */
  /******************************************/

  /**
   * Check if a given collider overlaps a circle with a given position and radius
   * @param {vec2} pos position of the current collider
   * @param {number} rad radius of the current collider
   * @param {Collider} collider collider to check against
   */
  static CheckCollider(pos, rad, collider) {
    let col = true;
    if (collider instanceof CircleCollider) {
      let nor = p5.Vector.sub(pos, collider.position).normalize();
      col = Collider.CheckAxis(
        [
          p5.Vector.add(pos, p5.Vector.mult(nor, rad)),
          p5.Vector.add(pos, p5.Vector.mult(nor, -rad)),
        ],
        [
          p5.Vector.add(
            collider.position,
            p5.Vector.mult(nor, collider.radius),
          ),
          p5.Vector.add(
            collider.position,
            p5.Vector.mult(nor, -collider.radius),
          ),
        ],
        nor,
      );
    } else {
      collider.normals.forEach((nor) => {
        col &&= Collider.CheckAxis(
          [
            p5.Vector.add(pos, p5.Vector.mult(nor, rad)),
            p5.Vector.add(pos, p5.Vector.mult(nor, -rad)),
          ],
          collider.verts,
          nor,
        );
      });
    }
    return col;
  }
}
