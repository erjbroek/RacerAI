export default class HandleScore {
  public static height: number = 0;

  public static distance: number = 0;

  public static maxHeight: number = 0;

  public static maxSpeed: number = 0;

  public static bronzeCoins: number = 0;

  public static silverCoins: number = 0;

  public static goldCoins: number = 0;

  public static totalCoins: number = 0;

  public static duckDollars: number = 0;

  public static enemiesHit: number = 0;

  public static score: number = 0;

  /**
   * @param xSpeed is the xSpeed the horizontal distance the player flies each frame
   * @param height is the current height the player is at in pixels / 10
   */
  public static calculateDistances(xSpeed: number, height: number) {
    this.distance += xSpeed / 200;
    this.height = height / 200;
    if (this.height >= this.maxHeight) {
      this.maxHeight = this.height;
    }
  }

  public static reset() {
    this.height = 0;
    this.distance = 0;
    this.maxHeight = 0;
    this.maxSpeed = 0;
    this.bronzeCoins = 0;
    this.silverCoins = 0;
    this.goldCoins = 0;
    this.totalCoins = 0;
    this.enemiesHit = 0;
    this.score = 0;
  }

  /**
   * gets stats from the launch, and calculates a score from those.
   */
  public static calculateScore() {
    // the formula for calculating the score, based on distance and height
    this.score = (this.distance / 2) * ((this.maxHeight / 10) + 1);
  }

  /**
   * @param coinType is the type of coin that is added
   */
  public static addCoin(coinType: number) {
    if (coinType === 1) {
      this.bronzeCoins += 1;
    } else if (coinType === 2) {
      this.silverCoins += 1;
    } else {
      this.goldCoins += 1;
    }
  }
}
