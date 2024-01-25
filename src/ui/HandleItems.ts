import Coin from '../drawables/Coin.js';
import Player from '../drawables/Player.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import HandleScore from './handleScore.js';

export default class HandleItems {
  private coins: Coin[];

  private handleScore: HandleScore;

  public constructor(handleScore: HandleScore) {
    this.coins = [];
    this.handleScore = handleScore;
  }

  /**
   * moves all items, such as coins or enemies.
   *
   * @param player is the player that us used to check how to render te items (based on player posY)
   * @param xSpeed is the horizontal speed the items should move at
   * @param ySpeed is the vertical speed the items should move at
   */
  public move(player: Player, xSpeed: number, ySpeed: number) {
    if (player.posY >= window.innerHeight / 2) {
      this.coins.forEach((coin) => {
        coin.move(xSpeed, 0);
      });
      player.move(ySpeed);
    } else {
      this.coins.forEach((coin) => {
        coin.move(xSpeed, ySpeed);
      });
    }
  }

  /**
   * if the coins position falls out of the screen, it is removed.
   * if there are too few coins between 2 given positions, a new one is added.
   */
  public update() {
    this.coins.forEach((coin) => {
      if (coin.posX <= -1000) {
        this.coins.splice(this.coins.indexOf(coin), 1);
      }
    });
    if (this.coins.length < 100) {
      this.coins.push(new Coin(
        window.innerWidth + (
          (Math.random() * (window.innerWidth / 1.5) - window.innerHeight / 5)
        ) * 2,
        Math.random() * (window.innerHeight),
      ));
    }
  }

  /**
   *
   */
  public collision(player: Player) {
    this.coins.forEach((coin) => {
      if (CanvasUtil.collidesWith(player, coin)) {
        this.handleScore.coins += 1;
        this.coins.splice(this.coins.indexOf(coin), 1);
      }
    });
  }

  /**
   * renders the objects to the canvas
   * @param canvas the selected canvas objects are rendered to
   */
  public render(canvas: HTMLCanvasElement) {
    this.coins.forEach((coin) => {
      coin.render(canvas);
    });
  }
}
