/**
 * A 2 dimensional vector.
 * @typedef {Vector} vec2
 * @property {number} x X component
 * @property {number} y Y component
 */

/**
 * An instance of the game. Not a singleton.
 * Contains all "global" state related to the functioning of the game.
 * @class
 */
class Game {
  constructor() {
    this.resolution = createVector(800, 600);
    /**
     * The high level state of the game
     * 0 = title screen
     * 1 = gameplay
     * 2 = game over screen
     * @type {number}
     * @private
     */
    this.state = 0;
    /**
     * list of all active actors
     * @type {Actor[]}
     */
    this.actors = [];
    this.SpawnPlayer();
    this.actors.push(new Asteroid(createVector(200, 100), 2));
  }

  /**
   * Creates a new instance of the player character and adds it to the actors array
   * also keeps a direct reference to the player character
   * @returns {void}
   * @private
   */
  SpawnPlayer() {
    this.player = new PlayerShip(
      createVector(this.resolution.x / 2, this.resolution.y / 2),
    );
    this.actors.push(this.player);
  }

  /**
   * The game instance's main update loop.
   * @returns {void}
   * @public
   */
  Update() {
    this.UpdatePysics();
    this.Draw();
  }

  /**
   * perfoms physics updates for all actors and particles.
   * @returns {void}
   * @private
   */
  UpdatePysics() {
    //filter out dead actors
    let newActors = [];
    this.actors.forEach((actor) => {
      if (!actor.isDead || actor instanceof PlayerShip) {
        newActors.push(actor);
      } 
      if (actor.isDead) {
        actor.Die();
      }
    });
    this.actors = newActors;

    //check collision on all actors
    this.actors.forEach((actor) => {
      let hit = actor.CheckCollisions(
        this.actors.toSpliced(this.actors.indexOf(actor), 1),
      );
      actor.hit ||= hit;
    });

    //tick pysics for all actors
    this.actors.forEach((actor) => {
      actor.Update();
    });
  }

  /**
   * Draws the game to the screen
   * @returns {void}
   * @private
   */
  Draw() {
    //draw the background
    push();
    fill(5);
    rect(0, 0, this.resolution.x, this.resolution.y);
    pop();

    //draw all actors
    this.actors.forEach((actor) => {
      actor.Draw();
    });
  }
}
