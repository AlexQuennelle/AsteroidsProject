/**
 * Object representing the asteroids in the game
 * @extends Actor
 */
class Asteroid extends Actor {
  /**
   * @param {vec2} pos The position of the asteroid
   * @param {number} size Integer size of the asteroid between 1 and 3
   */
  constructor(pos, size) {
    /**@type {number} */
    let shape = round(random(0, 2));
    super(
      pos,
      Asteroid.GetShape(shape, size),
      Asteroid.GetCollider(shape, size),
    );
    /**
     * Integer size of the asteroid between 1 and 3
     * @type {number}
     * @private
     */
    this.size = size;
  }

  /******************************************/
  /*             Static Methods             */
  /******************************************/

  /**
   * Picks from the 3 available asteroid shapes and scales it appropriately
   * @param {number} value Index of the shape requested
   * @param {number} size Size of the asteroid
   * @returns {vec2[]}
   * @private
   */
  static GetShape(value, size) {
    /**@type {vec2[][]} */
    let shapes = [
      [
        createVector(0, -10),
        createVector(10, -20),
        createVector(20, -10),
        createVector(15, 0),
        createVector(20, 10),
        createVector(5, 20),
        createVector(-10, 20),
        createVector(-20, 10),
        createVector(-20, -10),
        createVector(-10, -20),
      ],
      [
        createVector(0, -15),
        createVector(10, -20),
        createVector(20, -10),
        createVector(10, -5),
        createVector(20, 5),
        createVector(10, 20),
        createVector(-5, 15),
        createVector(-10, 20),
        createVector(-20, 10),
        createVector(-15, 0),
        createVector(-20, -10),
        createVector(-10, -20),
      ],
      [
        createVector(5, -20),
        createVector(20, -10),
        createVector(20, -5),
        createVector(5, 0),
        createVector(20, 10),
        createVector(10, 20),
        createVector(5, 15),
        createVector(-10, 20),
        createVector(-20, 5),
        createVector(-20, -10),
        createVector(-5, -10),
        createVector(-10, -20),
      ],
    ];
    let shape = shapes[value];
    shape.forEach((point) => {
      point.mult(size);
    });
    return shape;
  }

  /**
   * Generates the appropriate array of colliders for a given asteroid shape and size
   * @param {number} size The size of the asteroid
   * @param {number} shape the shape of the asteroid
   * @returns {Collider[]}
   * @private
   */
  static GetCollider(shape, size) {
    /**@type {Collider[]} */
    let colliders = [];
    switch (shape) {
      case 0:
        colliders = [
          new Collider([
            createVector(0 * size, -10 * size),
            createVector(10 * size, -20 * size),
            createVector(20 * size, -10 * size),
            createVector(15 * size, 0 * size),
          ]),
          new Collider([
            createVector(0 * size, -10 * size),
            createVector(15 * size, 0 * size),
            createVector(20 * size, 10 * size),
            createVector(5 * size, 20 * size),
            createVector(-10 * size, 20 * size),
            createVector(-20 * size, 10 * size),
          ]),
          new Collider([
            createVector(0 * size, -10 * size),
            createVector(-20 * size, 10 * size),
            createVector(-20 * size, -10 * size),
            createVector(-10 * size, -20 * size),
          ]),
        ];
        break;
      case 1:
        colliders = [
          new Collider([
            createVector(0 * size, -15 * size),
            createVector(10 * size, -20 * size),
            createVector(20 * size, -10 * size),
            createVector(10 * size, -5 * size),
          ]),
          new Collider([
            createVector(0 * size, -15 * size),
            createVector(20 * size, 5 * size),
            createVector(10 * size, 20 * size),
            createVector(-5 * size, 15 * size),
            createVector(-15 * size, 0 * size),
            createVector(-20 * size, -10 * size),
            createVector(-10 * size, -20 * size),
          ]),
          new Collider([
            createVector(-5 * size, 15 * size),
            createVector(-10 * size, 20 * size),
            createVector(-20 * size, 10 * size),
            createVector(-15 * size, 0 * size),
          ]),
        ];
        break;
      case 2:
        colliders = [
          new Collider([
            createVector(5 * size, -20 * size),
            createVector(20 * size, -10 * size),
            createVector(20 * size, -5 * size),
            createVector(5 * size, 0 * size),
            createVector(-5 * size, -10 * size),
            createVector(-10 * size, -20 * size),
          ]),
          new Collider([
            createVector(5 * size, 0 * size),
            createVector(20 * size, 10 * size),
            createVector(10 * size, 20 * size),
            createVector(5 * size, 15 * size),
          ]),
          new Collider([
            createVector(5 * size, 0 * size),
            createVector(5 * size, 15 * size),
            createVector(-10 * size, 20 * size),
            createVector(-20 * size, 5 * size),
            createVector(-20 * size, -10 * size),
            createVector(-5 * size, -10 * size),
          ]),
        ];
        break;
    }
    return colliders;
  }
}
