class Asteroid extends Actor {
  constructor(pos, size) {
    //let shape = round(random(0, 2));
    let shape = 2;
    super(
      pos,
      Asteroid.GetShape(shape, size),
      Asteroid.GetCollider(shape, size),
    );
    this.size = size;
  }

  /**
   * Picks from the 3 available asteroid shapes and scales it appropriately
   * @param {number} value Index of the shape requested
   * @param {number} size Size of the asteroid
   * @returns {vec2[]}
   */
  static GetShape(value, size) {
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

  static GetCollider(shape, size) {
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
            createVector(0, -15),
            createVector(10, -20),
            createVector(20, -10),
            createVector(10, -5),
          ]),
          new Collider([
            createVector(0, -15),
            createVector(20, 5),
            createVector(10, 20),
            createVector(-5, 15),
            createVector(-15, 0),
            createVector(-20, -10),
            createVector(-10, -20),
          ]),
          new Collider([
            createVector(-5, 15),
            createVector(-10, 20),
            createVector(-20, 10),
            createVector(-15, 0),
          ]),
        ];
        break;
      case 2:
        colliders = [
          new Collider([
            createVector(5, -20),
            createVector(20, -10),
            createVector(20, -5),
            createVector(5, 0),
            createVector(-5, -10),
            createVector(-10, -20),
          ]),
          new Collider([
            createVector(5, 0),
            createVector(20, 10),
            createVector(10, 20),
            createVector(5, 15),
          ]),
          new Collider([
            createVector(5, 0),
            createVector(5, 15),
            createVector(-10, 20),
            createVector(-20, 5),
            createVector(-20, -10),
            createVector(-5, -10),
          ]),
        ];
        break;
    }
    return colliders;
  }
}
