import BackgroundItems from './BackgroundItems.js';
import CanvasUtil from '../utilities/CanvasUtil.js';

export default class Background extends BackgroundItems {
  public constructor(posX: number, posY: number, random: number = Math.random(), width: number = 1080 * 4, height: number = 302 * 4) {
    super();
    if (random <= 0.15) {
      this.image = CanvasUtil.loadNewImage('./assets/backMountains.png');
    } else if (random <= 0.4) {
      this.image = CanvasUtil.loadNewImage('./assets/backHills.png');
    } else if (random <= 0.7) {
      this.image = CanvasUtil.loadNewImage('./assets/background.png');
    } else {
      this.image = CanvasUtil.loadNewImage('./assets/backForest.png');
    }
    // check launch en selectAngle
    this.image.height = height;
    this.image.width = width;
    this.posX = posX;
    this.posY = posY;
    this.angle = 0;
  }
}
