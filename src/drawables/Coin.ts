import HandleStats from '../ui/HandleStats.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import Drawable from './Drawable.js';

export default class Coin extends Drawable {
  public value: number;

  public coinType: number;

  public constructor(posX: number, bottom: number) {
    super();
    this.posX = posX;
    const random = Math.random();
    if (random <= 0.45) {
      this.image = CanvasUtil.loadNewImage('./assets/bronzeCoin.png');
      this.value = 3 * HandleStats.coinMult;
      this.coinType = 1;
      this.posY = bottom - Math.random() * window.innerHeight;
    } else if (random <= 0.7) {
      this.image = CanvasUtil.loadNewImage('./assets/silverCoin.png');
      this.value = 10 * HandleStats.coinMult;
      this.coinType = 2;
      this.posY = bottom - (Math.random() * 2 * window.innerHeight) - window.innerHeight / 2;
    } else {
      this.image = CanvasUtil.loadNewImage('./assets/goldCoin.png');
      this.value = 30 * HandleStats.coinMult;
      this.coinType = 3;
      this.posY -= window.innerHeight / 1.1;
      this.posY = bottom - (Math.random() * 9 * window.innerHeight) - window.innerHeight;
    }
    this.image.width = window.innerWidth / 35;
    this.image.height = window.innerWidth / 35;
    this.posY -= this.image.height / window.innerHeight / 45;
  }

  /**
   * @param xSpeed horizontal speed the item will move at
   * @param ySpeed vertical speed the item will move at
   */
  public move(xSpeed: number, ySpeed: number) {
    this.posX -= xSpeed;
    this.posY -= ySpeed;
  }
}
