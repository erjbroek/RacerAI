import CanvasUtil from '../utilities/CanvasUtil.js';
import Drawable from './Drawable.js';

export default class Player extends Drawable {
  public constructor() {
    super();
    this.image = CanvasUtil.loadNewImage('./assets/player.png');

    // setting properties of the image, such as position and width.

    // using window.innerWidth / x, so that the image and it's position are
    // scalable with different resolutions/
    this.image.width = window.innerWidth / 15;
    this.image.height = window.innerWidth / 15;
    this.posX = window.innerWidth / 10 - this.image.width / 2;
    this.posY = window.innerHeight / 1.1 - this.image.height / 2;
  }

  /**
   * moves the player up or down depening on the ySpeed
   *
   * @param ySpeed the chosen ySpeed the player has to move
   */
  public move(ySpeed: number) {
    this.posY += ySpeed;
  }
}
