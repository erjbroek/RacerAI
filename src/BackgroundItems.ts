import CanvasUtil from './CanvasUtil.js';
import Drawable from './Drawable.js';

export default abstract class BackgroundItems {
  protected image: HTMLImageElement;

  protected posX: number;

  protected posY: number;

  protected angle: number;

  // private xSpeed: number;

  // private ySpeed: number;

  public constructor(posX: number, posY: number) {
    this.posX = posX;
    this.posY = posY;
    this.angle = 0;
  }

  /**
   * @param xSpeed horizontal speed the item will move at
   * @param ySpeed vertical speed the item will move at
   */
  public move(xSpeed: number, ySpeed: number) {
    this.posX -= xSpeed;
    this.posY -= ySpeed;
  }

  /**
   * @param rotationSpeed speed which the item should rotate at.
   */
  public rotate(rotationSpeed: number) {
    this.angle += rotationSpeed;
  }

  public getPosX() {
    return this.posX;
  }

  public getPosY() {
    return this.posY;
  }

  public setPosY(posY: number) {
    this.posY = posY;
  }

  public getWidth() {
    return this.image.width;
  }

  public getHeight() {
    return this.image.height;
  }

  /**
   *@param canvas the canvas the images are drawn to
   */
  public render(canvas: HTMLCanvasElement) {
    CanvasUtil.drawImage(canvas, this.image, this.posX, this.posY, this.image.width, this.image.height, this.angle)
  }
}
