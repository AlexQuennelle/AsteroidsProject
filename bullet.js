/**
 * Projectile object that has a limited lifetime of 45 frames
 * @extends {Actor}
 */
class Bullet extends Actor {
  /**
   * @param {vec2} position
   * @param {number} owner wether the bullet belongs to the player
   */
  constructor(position, owner) {
    super(position, [], [new CircleCollider(createVector(0, 0), 5)], owner);
    this.radius = 5;
    this.lifetime = 45;
  }

  Update() {
    super.Update();
    if (this.lifetime <= 0) {
      this.isDead = true;
    }
    this.lifetime--;
  }

  Draw() {
    push();
    noStroke();
    circle(this.position.x, this.position.y, this.radius * 2);
    pop();
  }
}
