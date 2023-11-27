import CanvasUtil from './CanvasUtil.js';
import Drawable from './Drawable.js';

export default class Player extends Drawable {
  public constructor() {
    super();
    this.image = CanvasUtil.loadNewImage('./assets/player.png');
    this.image.width = window.innerWidth / 15;
    this.image.height = window.innerWidth / 15;
    this.posX = window.innerWidth / 10 - this.image.width / 2;
    this.posY = window.innerHeight / 1.1 - this.image.height / 2;
  }

  public move(ySpeed: number) {
    this.posY += ySpeed;
  }
}
