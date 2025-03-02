class Bullet extends Actor {
  /**
   * @param {vec2} position
   * @param {boolean} isPlayerBullet wether the bullet belongs to the player
   */
  constructor(position, isPlayerBullet) {
    super(position, [], [new CircleCollider(createVector(0, 0), 5)]);
    this.isPlayerBullet = isPlayerBullet;
    this.radius = 5;
    this.lifetime = 60;
  }
  Update() {
    if (this.lifetime <= 0) {
      this.isDead = true;
    }
    super.Update();
    this.lifetime--;
  }
  Draw() {
    push();
    noStroke();
    circle(this.position.x, this.position.y, this.radius * 2);
    pop();
  }
  /**
   * @param {Actor[]} actors
   */
  CheckCollisions(actors) {
    let newActors = [];
    actors.forEach((actor) => {
      if (
        !(actor instanceof PlayerShip) ||
        (actor instanceof PlayerShip && !this.isPlayerBullet)
      ) {
        newActors.push(actor);
      }
    });
    return super.CheckCollisions(newActors);
  }
}
