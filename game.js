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
    /** The high level state of the game
     * 0 = title screen
     * 1 = gameplay
     * @type {number}
     * @private
     */
    this.state = 0;
  }
}
