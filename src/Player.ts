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
    this.image.width = window.innerWidth / 10;
    this.image.height = window.innerWidth / 10;
    this.posX = window.innerWidth / 30 - this.image.width / 2;
    this.posY = window.innerHeight / 1.4 - this.image.height / 2;
  }
}
