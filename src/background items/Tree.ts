import Drawable from '../drawables/Drawable.js';
import CanvasUtil from '../utilities/CanvasUtil.js';

export default class Tree extends Drawable {
  public constructor(posX: number, bottom: number) {
    super();
    const random = Math.random();

    this.posX = posX;
    this.posY = bottom;
    if (random >= 2 / 3) {
      this.image = CanvasUtil.loadNewImage('./assets/tree1.png');
      this.image.width /= 1.5;
      this.image.height /= 1.5;
    } else if (random >= 1 / 3) {
      this.image = CanvasUtil.loadNewImage('./assets/tree2.png');
      this.image.width /= 2;
      this.image.height /= 2;
    } else {
      this.image = CanvasUtil.loadNewImage('./assets/tree3.png');
      this.image.width /= 2.2;
      this.image.height /= 2.2;
    }
  }
}
