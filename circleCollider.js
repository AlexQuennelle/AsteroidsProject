class CircleCollider extends Collider {
  constructor(position, radius) {
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
  CheckCollision(pos, angle, actor) {
    let col = false;
    /**@type {vec2} */
    let adjustedPos = p5.Vector.rotate(this.position, angle).add(pos);
    /**@type {Collider[]} */
    let colliders = actor.GetColliders();

    colliders.forEach((collider) => {
      col |= CircleCollider.CheckCollider(adjustedPos, radius, collider);
    });
  }

  /******************************************/
  /*             Static Methods             */
  /******************************************/

  /**
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
        col &= Collider.CheckAxis(
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
