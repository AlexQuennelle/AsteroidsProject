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
    /**
     * List of actors to spawn next update loop
     * @type {Actor[]}
     * @private
     */
    this.toSpawn = [];

    this.timeToNextSaucer = random(180, 600);

    this.screenShakeTime = 0;
    this.level = 1;
  }

  ShakeScreen() {
    this.screenShakeTime = 15;
  }

  /**
   * Starts the game
   * @returns {void}
   * @private
   */
  StartGame() {
    this.SpawnPlayer();
    this.SpawnAsteroids();
  }

  SpawnSaucer() {
    if (
      this.actors.some((item) => {
        return item instanceof Saucer;
      })
    ) {
      return;
    }
    if (this.player.score < 40000) {
      this.actors.push(
        random() < 0.7
          ? new Saucer(createVector(0, random(0, this.resolution.y)))
          : new SmallSaucer(createVector(0, random(0, this.resolution.y))),
      );
    } else {
      this.actors.push(
        new SmallSaucer(createVector(0, random(0, this.resolution.y))),
      );
    }
    this.timeToNextSaucer = random(180, 600);
  }

  /**
   * Spawns a wave of asteroids
   * @param {number} [number=random(3,5)] The number of asteroids to spawn
   * @returns {void}
   * @private
   */
  SpawnAsteroids() {
    for (let i = 0; i < (this.level * 2 + 3); i++) {
      let p = random();
      let asteroid = new Asteroid(
        createVector(
          p <= this.resolution.x / (this.resolution.x + this.resolution.y)
            ? p * this.resolution.x
            : 0,
          p > this.resolution.x / (this.resolution.x + this.resolution.y)
            ? p * this.resolution.y
            : 0,
        ),
        3,
      );
      this.actors.push(asteroid);
    }
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
    switch (this.state) {
      case 0:
        this.TitleScreen();
        break;
      case 1: //gameplay update
        this.UpdatePysics();
        this.DrawGameplay();
        break;
      case 2:
        this.GameOverScreen();
        break;
    }
  }

  /**
   * Draws the title screen and handles it's logic
   * @returns {void}
   * @private
   */
  TitleScreen() {
    let topMargin = (height - this.resolution.y) / 2;

    let buttonCol = color(150, 145, 160, 255);
    if (mouseX >= width / 2 - 200 && mouseX <= width / 2 + 200) {
      if (mouseY >= height / 2 - 50 && mouseY <= height / 2 + 50) {
        buttonCol = color(165, 160, 185, 255);
        if (mouseIsPressed) {
          this.state = 1;
          this.StartGame();
        }
      }
    }

    background(5);
    push();
    fill(buttonCol);
    strokeWeight(2.5);
    rectMode(CENTER);
    rect(width / 2, height / 2, 400, 100);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(60);
    text("Play", width / 2, height / 2);
    pop();

    push();
    textAlign(CENTER, BOTTOM);
    strokeWeight(2.5);
    stroke(220);
    fill(50);
    textSize(80);
    text("ASTEROIDS", width / 2, topMargin + this.resolution.y / 4);
    pop();
  }

  /**
   * Ends the game
   * @returns {void}
   * @public
   */
  GameOver() {
    this.state = 2;
  }

  /**
   * Draws and handles logic for the game over screen
   * @returns {void}
   * @private
   */
  GameOverScreen() {
    let topMargin = (height - this.resolution.y) / 2;

    background(5);
    push();
    textAlign(CENTER, BOTTOM);
    stroke(220);
    strokeWeight(2.5);
    fill("red");
    textSize(80);
    text("GAME OVER", width / 2, topMargin + this.resolution.y / 3);
    fill(100);
    textSize(40);
    text(`Score: ${this.player.score}`, width / 2, height / 2);
    pop();
    let buttonCol = color(150, 145, 160, 255);
    if (mouseX >= width / 2 - 200 && mouseX <= width / 2 + 200) {
      if (
        mouseY >= topMargin + (this.resolution.y / 3) * 2 - 50 &&
        mouseY <= topMargin + (this.resolution.y / 3) * 2 + 50
      ) {
        buttonCol = color(165, 160, 185, 255);
        if (mouseIsPressed) {
          gameInstance = new Game();
        }
      }
    }
    push();
    rectMode(CENTER);
    fill(buttonCol);
    rect(width / 2, topMargin + (this.resolution.y / 3) * 2, 400, 100);
    textAlign(CENTER, CENTER);
    textSize(60);
    fill(0);
    text("Restart", width / 2, topMargin + (this.resolution.y / 3) * 2);
    pop();
  }

  /**
   * perfoms physics updates for all actors and particles.
   * @returns {void}
   * @private
   */
  UpdatePysics() {
    if (
      !this.actors.some((actor) => {
        return actor instanceof Asteroid || actor instanceof Saucer;
      })
    ) {
      this.level++;
      this.SpawnAsteroids();
    }
    if (this.timeToNextSaucer > 0) {
      this.timeToNextSaucer--;
    } else {
      this.SpawnSaucer();
    }
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
    this.actors = this.actors.concat(this.toSpawn);
    this.toSpawn = [];
  }

  /**
   * Draws the game to the screen
   * @returns {void}
   * @private
   */
  DrawGameplay() {
    push();
    if (this.screenShakeTime > 0) {
      translate(p5.Vector.random2D().mult((this.screenShakeTime / 15) * 2));
      this.screenShakeTime--;
    }
    translate(
      width / 2 - this.resolution.x / 2,
      height / 2 - this.resolution.y / 2,
    );
    //draw the background
    push();
    fill(5);
    rect(0, 0, this.resolution.x, this.resolution.y);
    pop();

    //draw all actors
    this.actors.forEach((actor) => {
      actor.Draw();
    });
    pop();
    this.DrawUI();
  }

  /**
   * Draws the UI to the screen
   * @returns {void}
   * @private
   */
  DrawUI() {
    let topMargin = (height - this.resolution.y) / 2;

    push();
    strokeWeight(2.5);
    stroke(220);
    fill(150);
    textAlign(CENTER, TOP);
    textSize(30);
    text(`Score: ${this.player.score}`, width / 2, topMargin + 20);
    textAlign(LEFT, BOTTOM);
    text(
      `Lives: ${this.player.lives}`,
      width / 2 + this.resolution.x / 2 - 250,
      topMargin + this.resolution.y - 20,
    );
    pop();
  }
}
