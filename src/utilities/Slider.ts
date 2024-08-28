import CanvasUtil from './CanvasUtil.js';
import MouseListener from './MouseListener.js';

export default class Slider {
  public sliderValue: number = 0;

  public originalValue: number;
  
  private posX: number = 0;

  private posY: number = 0;

  private width: number = 0;

  private minValue: number = 0;

  private maxValue: number = 0;

  private title: string = '';

  private description: string = '';

  private holding: boolean = false;

  private circleRadius: number = window.innerHeight * 0.01;


  private unit: string;

  public constructor(posX: number, posY: number, width: number, startValue: number, minValue: number, maxValue: number, title: string, description: string, unit: string = '') {
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.title = title;
    this.description = description;
    this.sliderValue = startValue;
    this.originalValue = startValue;
    this.unit = unit;
  }

  /**
   * procceses input for the sliders, and ipdates values accordingly
   */
  public processInput() {
    if (MouseListener.isButtonDown(0)) {
      const circlePositionX = this.posX + this.circleRadius * 2 + ((this.sliderValue - this.minValue) * (this.width / 1.1 - this.circleRadius * 2)) / (this.maxValue - this.minValue);
      if (MouseListener.circleCollision(circlePositionX, this.posY + window.innerHeight * 0.015, this.circleRadius)) {
        this.holding = true;
      }

      if (this.holding) {
        const mousePosition = MouseListener.mouseCoordinates.x - this.posX - this.circleRadius * 2;
        const normalizedPosition = mousePosition / (this.width / 1.1 - this.circleRadius * 2);
        this.sliderValue = this.minValue + normalizedPosition * (this.maxValue - this.minValue);
        if (this.sliderValue < this.minValue) {
          this.sliderValue = this.minValue;
        }
        if (this.sliderValue > this.maxValue) {
          this.sliderValue = this.maxValue;
        }
      }
    } else {
      this.holding = false;
    }
  }

  /**
   *
   * @param canvas the canvas to render the sliders and their parts on
   */
  public renderSlider(canvas: HTMLCanvasElement) {
    if (this.unit === '%') {
      CanvasUtil.writeText(canvas, `${this.title}: ${Math.round(this.sliderValue * 1000) / 10}${this.unit}`, this.posX + this.width / 2, this.posY - canvas.height * 0.008, 'center', 'system-ui', 14, 'lightgrey');
    } else {
      CanvasUtil.writeText(canvas, `${this.title}: ${Math.round(this.sliderValue)}${this.unit}`, this.posX + this.width / 2, this.posY - canvas.height * 0.008, 'center', 'system-ui', 14, 'lightgrey');
    }
    CanvasUtil.fillRectangle(canvas, this.posX, this.posY, this.width, canvas.height * 0.03, 200, 200, 200, 0.5, canvas.height * 0.015);
    CanvasUtil.fillRectangle(canvas, this.posX + this.circleRadius / 4 + ((this.originalValue - this.minValue) * (this.width / 1.1 - this.circleRadius * 2)) / (this.maxValue - this.minValue), this.posY, this.circleRadius * 3.5, canvas.height * 0.03, 0, 200, 0, 0.3);
    CanvasUtil.drawRectangle(canvas, this.posX + 1 + this.circleRadius / 4 + ((this.originalValue - this.minValue) * (this.width / 1.1 - this.circleRadius * 2)) / (this.maxValue - this.minValue), this.posY + 1, this.circleRadius * 3.5 - 2, canvas.height * 0.03 - 2, 0, 255, 30, 0.3, 1);
    CanvasUtil.fillCircle(canvas, this.posX + this.circleRadius * 2 + ((this.sliderValue - this.minValue) * (this.width / 1.1 - this.circleRadius * 2)) / (this.maxValue - this.minValue), this.posY + canvas.height * 0.015, this.circleRadius, 200, 200, 200, 1);
  }
}
