import CanvasUtil from './CanvasUtil.js';

export default class Slider {
  public sliderValue: number = 0;

  private posX: number = 0;

  private posY: number = 0;

  private width: number = 0;

  private maxValue: number = 0;

  private title: string = '';

  private description: string = '';

  public constructor(posX: number, posY: number, width: number, maxValue: number, title: string, description: string) {
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.maxValue = maxValue;
    this.title = title;
    this.description = description;
  }

  public processInput() {

  }

  public render(canvas: HTMLCanvasElement) {
    CanvasUtil.writeText(canvas, `${this.title}`, this.posX + this.width / 2, this.posY - canvas.height * 0.01, 'center', 'system-ui', 14, 'lightgrey');
    CanvasUtil.fillRectangle(canvas, this.posX, this.posY, this.width, canvas.height * 0.03, 200, 200, 200, 0.5, canvas.height * 0.015);
  }
}
