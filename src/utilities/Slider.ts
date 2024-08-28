import CanvasUtil from './CanvasUtil.js';
import MouseListener from './MouseListener.js';

export default class Slider {
  public sliderValue: number = 0;

  private posX: number = 0;

  private posY: number = 0;

  private width: number = 0;

  private maxValue: number = 0;

  private title: string = '';

  private description: string = '';

  private holding: boolean = false;

  private circleRadius: number = window.innerHeight * 0.01;

  private originalValue: number;

  public constructor(posX: number, posY: number, width: number, startValue: number, maxValue: number, title: string, description: string) {
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.maxValue = maxValue;
    this.title = title;
    this.description = description;
    this.sliderValue = startValue;
    this.originalValue = startValue;
  }

  public processInput() {
    if (MouseListener.isButtonDown(0)) {
      if (MouseListener.circleCollision(this.posX + this.circleRadius * 2 + this.sliderValue * this.width / this.maxValue / 1.2, this.posY + window.innerHeight * 0.015, this.circleRadius)) {
        this.holding = true;
      }
      if (this.holding) {
        this.sliderValue = (MouseListener.mouseCoordinates.x - this.posX - this.circleRadius * 2) / this.width * this.maxValue * 1.2;
        if (this.sliderValue < 0) {
          this.sliderValue = 0;
        }
        if (this.sliderValue > this.maxValue) {
          this.sliderValue = this.maxValue;
        }
      }
    } else {
      this.holding = false;
    }
  }

  public render(canvas: HTMLCanvasElement) {
    CanvasUtil.writeText(canvas, `${this.title}: ${Math.round(this.sliderValue * 100) / 100}`, this.posX + this.width / 2, this.posY - canvas.height * 0.01, 'center', 'system-ui', 14, 'lightgrey');
    CanvasUtil.fillRectangle(canvas, this.posX, this.posY, this.width, canvas.height * 0.03, 200, 200, 200, 0.5, canvas.height * 0.015);
    // CanvasUtil.fillRectangle(canvas, this.posX + this.originalValue / this.maxValue * this.width - , )
    CanvasUtil.fillCircle(canvas, this.posX + this.circleRadius * 2 + this.sliderValue * this.width / this.maxValue / 1.2, this.posY + canvas.height * 0.015, this.circleRadius, 200, 200, 200, 1);
}
}
