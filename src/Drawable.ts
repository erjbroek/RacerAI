import CanvasUtil from './CanvasUtil.js';

export default abstract class Drawable {
  protected image: HTMLImageElement;

  protected posX: number;

  protected posY: number;

  protected angle: number;

  public constructor() {
    this.image = CanvasUtil.loadNewImage('./assets/hoe_wood.png');
    this.posX = 750;
    this.posY = 400;
  }

  public getPosX(): number {
    return this.posX;
  }

  public setPosX(posX: number): void {
    this.posX = posX;
  }

  public getPosY(): number {
    return this.posY;
  }

  public setPosY(posY: number): void {
    this.posY = posY;
  }

  public getWidth(): number {
    return this.image.width;
  }

  public getHeight(): number {
    return this.image.height;
  }

  public getAngle(): number {
    return this.angle;
  }

  public setAngle(angle: number) {
    this.angle = angle;
  }

  /**
   *
   *
   */
  public render(canvas: HTMLCanvasElement): void {
    // eslint-disable-next-line max-len
    CanvasUtil.drawImage(canvas, this.image, this.getPosX(), this.getPosY(), this.image.width, this.image.height, this.angle);
  }
}
