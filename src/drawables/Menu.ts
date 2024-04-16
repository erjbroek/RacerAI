import Save from '../scenes/Save.js';
import SelectAngle from '../scenes/SelectAngle.js';
import StartingScene from '../scenes/StartingScene.js';
import Shop from '../scenes/shop/Shop.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import KeyListener from '../utilities/KeyListener.js';
import MouseListener from '../utilities/MouseListener.js';

export default class Menu {
  public static hamburger: HTMLImageElement = CanvasUtil.loadNewImage('./assets/hamburger.png');

  public static save: HTMLImageElement = CanvasUtil.loadNewImage('./assets/floppy.png');

  public static home: HTMLImageElement = CanvasUtil.loadNewImage('./assets/home.png');

  public static cart: HTMLImageElement = CanvasUtil.loadNewImage('./assets/cart.png');

  public static goSave: boolean = false;

  public static goShop: boolean = false;

  public static goHome: boolean = false;

  private static animationDuration: number = 700;

  private static height: number = window.innerHeight / 15;

  public static opened: boolean = false;

  private static open: boolean = false;

  private static close: boolean = false;

  /**
   * processes player imput
   */
  public static processInput() {
    if (MouseListener.isButtonDown(0)) {
      if (MouseListener.circleCollision(window.innerWidth * 0.96, window.innerWidth / 30, window.innerHeight / 20)) {
        if (!this.opened) {
          this.open = true;
        } else {
          this.close = true;
        }
      } else {
        this.close = true;
      }
    }


    if (this.opened) {
      if (MouseListener.circleDown(0, window.innerWidth * 0.96, window.innerHeight / 6.5, window.innerWidth / 50)) {
        this.goSave = true;
      } else {
        this.goSave = false;
      }
      if (MouseListener.circleDown(0, window.innerWidth * 0.96, window.innerHeight / 4.18, window.innerWidth / 50)) {
        this.goShop = true;
      } else {
        this.goShop = false;
      }
      if (MouseListener.circleDown(0, window.innerWidth * 0.96, window.innerHeight / 3.08, window.innerWidth / 50)) {
        this.goHome = true;
      } else {
        this.goHome = false;
      }
    } return this;
  }

  /**
   * @param elapsed is the elapsed time each frame
   */
  public static update(elapsed: number) {
    let targetHeight: number;
    if (this.open) {
      targetHeight = window.innerHeight / 3.08;
      if (!this.opened) {
        this.height = this.lerp(this.height, targetHeight, elapsed / this.animationDuration);
        this.animationDuration -= elapsed;
        if (this.height >= targetHeight) {
          this.opened = true;
          this.open = false;
          this.animationDuration = 700;
          this.height = targetHeight;
        }
      }
    } else if (this.close) {
      targetHeight = window.innerHeight / 15;
      if (this.opened) {
        this.height = this.lerp(this.height, targetHeight, elapsed / this.animationDuration);
        this.animationDuration -= elapsed;
        if (this.height <= targetHeight) {
          this.opened = false;
          this.close = false;
          this.animationDuration = 700;
          this.height = targetHeight;
        }
      }
    }
  }

  /**
   * Performs linear interpolation between two values.
   *
   * @param start - The start value.
   * @param end - The end value.
   * @param t - The interpolation factor, should be in the range [0, 1].
   * @returns The interpolated value.
   */
  private static lerp(start: number, end: number, t: number): number {
    return start * (1 - t) + end * t;
  }

  /**
   *
   */
  public static renderSettings(canvas: HTMLCanvasElement) {
    CanvasUtil.fillCircle(canvas, canvas.width * 0.96, canvas.height / 15, canvas.width / 40, 30, 200, 80, 1);
    CanvasUtil.fillRectangle(canvas, canvas.width * 0.935, canvas.height / 15, canvas.width / 20, this.height - window.innerHeight / 16.25, 30, 200, 80, 1, 0);
    CanvasUtil.fillCircle(canvas, canvas.width * 0.96, this.height, canvas.width / 40, 30, 200, 80, 1);
    CanvasUtil.fillCircle(canvas, canvas.width * 0.96, canvas.height / 15, canvas.width / 50, 100, 255, 160, 1);
    CanvasUtil.drawImage(canvas, this.hamburger, canvas.width * 0.949, canvas.height / 21, canvas.width / 45, canvas.height / 26);
    if (this.opened && !this.close) {
      CanvasUtil.fillCircle(canvas, canvas.width * 0.96, canvas.height / 6.5, canvas.width / 50, 0, 0, 0, 0.2);
      CanvasUtil.fillCircle(canvas, canvas.width * 0.96, canvas.height / 4.18, canvas.width / 50, 0, 0, 0, 0.2);
      CanvasUtil.fillCircle(canvas, canvas.width * 0.96, canvas.height / 3.08, canvas.width / 50, 0, 0, 0, 0.2);
      CanvasUtil.drawImage(canvas, this.save, canvas.width * 0.946, canvas.height / 8, canvas.width / 35, canvas.height / 17);
      CanvasUtil.drawImage(canvas, this.cart, canvas.width * 0.937, canvas.height / 5, canvas.width / 22, canvas.height / 12);
      CanvasUtil.drawImage(canvas, this.home, canvas.width * 0.944, canvas.height / 3.4, canvas.width / 30, canvas.height / 17);
    }
  }
}
