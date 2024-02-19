import Drawable from '../drawables/Drawable.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import BackgroundItems from './BackgroundItems.js';

export default class Tree extends BackgroundItems {
  public constructor(posX: number, bottom: number) {
    super();
    const random = Math.random();

    if (random >= 2 / 3) {
      this.image = CanvasUtil.loadNewImage('./assets/tree1.png');
    } else if (random >= 1 / 3) {
      this.image = CanvasUtil.loadNewImage('./assets/tree2.png');
    } else {
      this.image = CanvasUtil.loadNewImage('./assets/tree3.png');
    }

    this.posX = posX;
    this.posY = bottom - this.image.height + window.innerHeight / 10;
  }
}
