import Coin from '../drawables/Coin.js';
import Player from '../drawables/Player.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import HandleScenery from './HandleScenery.js';
import HandleScore from './handleScore.js';

export default class HandleItems {
  private static coins: Coin[] = [];

  /**
   * moves all items rendered.
   *
   * @param player the character (mister duck) that you play with
   * @param xSpeed horizontal speed
   * @param ySpeed vertical speed
   */
  public static moveItems(player: Player, xSpeed: number, ySpeed: number) {
    // if the player should move up or down
    if (player.posY >= window.innerHeight / 2
    || HandleScenery.backgrounds[0].getPosY() + HandleScenery.backgrounds[0].getHeight() < window.innerHeight) {
      HandleItems.coins.forEach((coin) => {
        coin.move(xSpeed * 1.25, 0);
      });
      player.move(ySpeed);
    } else {
      HandleItems.coins.forEach((coin) => {
        coin.move(xSpeed * 1.25, ySpeed * 1.25);
      });
    }

    if (player.posY + player.image.height > window.innerHeight) {
      HandleScenery.touchingGround = true;
    } else {
      HandleScenery.touchingGround = false;
    }
  }

  /**
   *
   */
  public static addItems() {
    while (HandleItems.coins.filter((obj) => obj instanceof Coin).length < 15) {
      HandleItems.coins.push(new Coin(
        window.innerWidth + (
          window.innerWidth + Math.random() * (window.innerWidth * 3)),
        (HandleScenery.backgrounds[0].getPosY() + HandleScenery.backgrounds[0].getHeight()) - 70,
      ));
    }
  }

  /**
   *
   */
  public static removeUnusedItems() {
    HandleItems.coins.forEach((coin) => {
      if (coin.posX <= -1000) {
        HandleItems.coins.splice(HandleItems.coins.indexOf(coin), 1);
      }
    });
  }

  /**
   *
   */
  public static collision(player: Player) {
    HandleItems.coins.forEach((coin) => {
      if (CanvasUtil.collidesWith(player, coin)) {
        HandleScore.totalCoins += coin.value;
        HandleScore.addCoin(coin.coinType);
        HandleItems.coins.splice(HandleItems.coins.indexOf(coin), 1);
      }
    });
  }

  /**
   * renders the objects to the canvas
   * @param canvas the selected canvas objects are rendered to
   */
  public static render(canvas: HTMLCanvasElement) {
    HandleItems.coins.forEach((coin) => {
      coin.render(canvas);
    });
  }

  public static reset() {
    HandleItems.coins = [];
  }
}
