import CanvasUtil from '../utilities/CanvasUtil.js';
import Drawable from './Drawable.js';

export default class Player extends Drawable {
  public rotationSpeed: number = 0;

  public touchedGround: boolean = false;

  public totalEnergy: number;

  public energy: number;

  public constructor() {
    super();
    this.image = CanvasUtil.loadNewImage('./assets/player.png');
    this.totalEnergy = 150;
    this.energy = 150;

    // setting properties of the image, such as position and width.

    // using window.innerWidth / x, so that the image and it's position are
    this.image.width = window.innerWidth / 15;
    this.image.height = window.innerWidth / 15;
    this.posX = window.innerWidth / 10 - this.image.width / 2;
    this.posY = window.innerHeight / 1.1 - this.image.height / 2.05;
  }

  /**
   * moves the player up or down depening on the ySpeed
   *
   * @param ySpeed the chosen ySpeed the player has to move
   */
  public move(ySpeed: number) {
    this.posY += ySpeed;
  }

  /**
   * rotates the player
   */
  public rotate() {
    this.angle += this.rotationSpeed;
  }

  /**
   * rotates the player based on the xSpeed and ySpeed;
   * @param xSpeed is the horizontal speed of the player
   * @param ySpeed is the vertical speed of the player
   */
  public setAngle(xSpeed: number, ySpeed: number) {
    let angle = Math.atan2(xSpeed, ySpeed) * (180 / Math.PI);
    angle *= -1;
    angle += 90;

    this.angle = angle;
  }

  /**
   * @param canvas the selected canvas to render to
   */
  public renderPower(canvas: HTMLCanvasElement) {
    if (this.energy > 0) {
      CanvasUtil.drawRectangle(canvas, this.posX, this.posY - canvas.width / 50, this.image.width + 2 * (this.posX - canvas.width / 15), canvas.height / 100, 'red');
      CanvasUtil.fillRectangle(canvas, this.posX, this.posY - canvas.width / 50, (this.image.width + 2 * (this.posX - canvas.width / 15)) * (this.energy / this.totalEnergy), canvas.height / 100, 'red');
    }
  }
}
