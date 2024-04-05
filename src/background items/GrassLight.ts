import CanvasUtil from '../utilities/CanvasUtil.js';
import BackgroundItems from './BackgroundItems.js';

export default class GrassLight extends BackgroundItems {
  public constructor(posX: number, posY: number) {
    super();
    this.image = CanvasUtil.loadNewImage('./assets/grassLight.png');
    this.image.width *= 2;
    this.image.height *= 2;
    this.posX = posX;
    this.posY = posY;
  }
}
