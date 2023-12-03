import CanvasUtil from '../utilities/CanvasUtil.js';

export default abstract class Drawable {
  public image: HTMLImageElement;

  public posX: number;

  public posY: number;

  public angle: number;

  public constructor() {
    this.posX = 0;
    this.posY = 0;
    this.angle = 0;
  }

  /**
   *
   *
   * @param canvas the selected canvas drawn to
   */
  public render(canvas: HTMLCanvasElement): void {
    CanvasUtil.drawImage(
      canvas,
      this.image,
      this.posX,
      this.posY,
      this.image.width,
      this.image.height,
      this.angle,
    );
  }
}
