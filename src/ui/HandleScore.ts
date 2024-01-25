import Player from "../drawables/Player.js";
import CanvasUtil from "../utilities/CanvasUtil.js";

export default class HandleScore {
  public height: number = 0;

  public distance: number = 0;

  public maxHeight: number = 0;

  public maxSpeed: number = 0;

  public bronzeCoins: number = 0;

  public silverCoins: number = 0;

  public goldCoins: number = 0;

  public totalCoins: number = 0;

  public enemiesHit: number = 0;

  public score: number = 0;

  /**
   * @param xSpeed is the xSpeed the horizontal distance the player flies each frame
   * @param ySpeed is the vertical distance the player flies each frame
   * @param height is the current height the player is at in pixels / 10
   */
  public calculateDistances(xSpeed: number, height: number,) {
    this.distance += xSpeed / 150;
    this.height = height / 150;
    if (this.height >= this.maxHeight) {
      this.maxHeight = this.height;
    }
  }

  /**
   * gets stats from the launch, and calculates a score from those.
   *
   * @param distance the distance the player travelled
   * @param maxHeight the maximum height the player reached
   */
  public calculateScore() {
    // the formula for calculating the score, basede on distance and height
    this.score = (this.distance / 2) * ((this.maxHeight / 10) + 1);
  }

  /**
   * @param canvas the selected canvas the score is rendered to
   */
  public addCoin(coinType: number) {
    if (coinType === 1) {
      this.bronzeCoins += 1;
    } else if (coinType === 2) {
      this.silverCoins += 1;
    } else {
      this.goldCoins += 1;
    }
  }
}
