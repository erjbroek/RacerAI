import BackgroundItems from './BackgroundItems.js';
import CanvasUtil from './CanvasUtil.js';

export default class Background extends BackgroundItems {
  public constructor(posX: number, posY: number, route: string) {
    super(posX, posY);
    const random = Math.random();
    if (!route) {
      if (random <= 0.15) {
        this.image = CanvasUtil.loadNewImage('./assets/backMountains.png');
      } else if (random <= 0.4) {
        this.image = CanvasUtil.loadNewImage('./assets/backHills.png');
      } else if (random <= 0.70) {
        this.image = CanvasUtil.loadNewImage('./assets/background.png');
      } else {
        this.image = CanvasUtil.loadNewImage('./assets/backForest.png');
      }
    } else {
      this.image = CanvasUtil.loadNewImage(route);
    }

    this.image.height = 302 * 4;
    this.image.width = 1080 * 4;
    this.posX = posX;
    this.posY = posY;
    this.angle = 0;
  }
}
