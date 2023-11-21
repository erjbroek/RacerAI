import CanvasUtil from './CanvasUtil.js';
import Drawable from './Drawable.js';

export default class Player extends Drawable {
  private xSpeed: number;

  private ySpeed: number;

  public constructor() {
    super();
    this.xSpeed = 0;
    this.ySpeed = 10;
    this.image = CanvasUtil.loadNewImage('./assets/player.png');
    this.image.width = window.innerWidth / 15;
    this.image.height = window.innerHeight / 10;
    this.posX = -10;
    this.posY = window.innerHeight - this.image.height;
  }
}
