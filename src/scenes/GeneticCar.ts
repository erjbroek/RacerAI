import Car from './Car.js';

export default class GeneticCar extends Car {

  public constructor(midPoint: number[]) {
    super();
    this.width = window.innerHeight / 40;
    this.height = window.innerHeight / 25;
    [this.posX, this.posY] = [midPoint[0], midPoint[1]];
  }

  /**
   * updates the car's position
   *
   * @param elapsed is the elapsed time that has passed since each frame
   */
  public override update(elapsed: number): void {

  }

  /**
   * renders the car
   *
   * @param canvas is the selected canvas the car is rendered to
   */
  public override render(canvas: HTMLCanvasElement): void {

  }

}
