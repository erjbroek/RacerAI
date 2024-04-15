import CanvasUtil from '../utilities/CanvasUtil.js';
import KeyListener from '../utilities/KeyListener.js';
import MouseListener from '../utilities/MouseListener.js';

export default class Settings {
  public static cog: HTMLImageElement = CanvasUtil.loadNewImage('./assets/cog.png');

  public static save: HTMLImageElement = CanvasUtil.loadNewImage('./assets/floppy.png');

  public static home: HTMLImageElement = CanvasUtil.loadNewImage('./assets/home.png');

  private static animationDuration: number = 1000;

  private static height: number = 0;

  public static goHome: boolean = false;

  public static goSave: boolean = false;

  public static opened: boolean = false;

  private static open: boolean = false;

  private static close: boolean = false;

  /**
   *
   */
  public static processInput() {
    if (MouseListener.circlePressed(0, window.innerWidth * 0.975, window.innerWidth / 40, window.innerHeight / 40)) {
      if (!this.opened) {
        this.open = true;
      } else {
        this.close = true;
      }
    }
  }

  public static update(elapsed: number) {
    let targetHeight: number;
    if (this.open) {
      targetHeight = window.innerHeight / 5;
      if (!this.opened) {
        this.height = this.lerp(this.height, targetHeight, elapsed / this.animationDuration);
        this.animationDuration -= elapsed;
        if (this.height >= targetHeight) {
          this.opened = true;
          this.open = false;
          this.animationDuration = 1000;
          this.height = targetHeight;
        }
      }
    } else if (this.close) {
      targetHeight = 0;
      if (this.opened) {
        this.height = this.lerp(this.height, targetHeight, elapsed / this.animationDuration);
        this.animationDuration -= elapsed;
        if (this.height <= targetHeight) {
          this.opened = false;
          this.close = false;
          this.animationDuration = 1000;
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
    CanvasUtil.fillCircle(canvas, canvas.width * 0.975, canvas.width / 40, canvas.height / 40, 30, 200, 80, 1);
    CanvasUtil.fillRectangle(canvas, canvas.width * 0.975, canvas.width / 40, canvas.width / 20, this.height, 30, 200, 80, 1);
  }
}
