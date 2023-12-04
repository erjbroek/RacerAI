import Player from '../drawables/Player.js';
import CanvasUtil from '../utilities/CanvasUtil.js';

export default class HandleScore {
  private height: number = 0;

  private distance: number = 0;

  private maxHeight: number = 0;

  private score: number = 0;

  public constructor() {

  }

  public calculateDistances(xSpeed: number, ySpeed: number, height: number) {
    this.distance += xSpeed / 100;
    this.height = height / 100;
    if (this.height >= this.maxHeight) {
      this.maxHeight = this.height;
    }

    console.log(this.distance);
  }

  public getScore(): number {
    return this.distance;
  }

  public update(elapsed: number) {

  }

  public render(canvas: HTMLCanvasElement) {
    CanvasUtil.writeTextToCanvas(canvas, `distance: ${(Math.round(this.distance * 10) / 10).toString()}m`, 100, 100, 'left', 'arial', 20, 'black');
    CanvasUtil.writeTextToCanvas(canvas, `height: ${(Math.round(this.height * 10) / 10).toString()}m`, 100, 150, 'left', 'arial', 20, 'black');
    CanvasUtil.writeTextToCanvas(canvas, `maxheight: ${(Math.round(this.maxHeight * 10) / 10).toString()}m`, 100, 200, 'left', 'arial', 20, 'black');
  }
}
