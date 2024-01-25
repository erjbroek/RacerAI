import CanvasUtil from '../utilities/CanvasUtil.js';
import Drawable from './Drawable.js';

export default class Coin extends Drawable {
  public value: number;

  public constructor(posX: number, posY: number) {
    super();
    this.posX = posX;
    this.posY = posY;
    const random = Math.random();
    if (random >= 0) {
      this.image = CanvasUtil.loadNewImage('./assets/bronzeCoin.png');
      this.value = 1;
    }
    this.image.width = window.innerWidth / 40;
    this.image.height = window.innerWidth / 40;
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
