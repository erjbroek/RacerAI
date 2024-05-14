import Car from './Car.js';

export default class GeneticCar extends Car {
  public constructor(midPoint: number[], startAngle: number) {
    super();
    this.width = window.innerHeight / 40;
    this.height = window.innerHeight / 25;
    [this.posX, this.posY] = [midPoint[0], midPoint[1]];
    this.rotation = startAngle;
    this.xSpeed = 0;
    this.ySpeed = 0;
  }

  public rotateLeft() {
    // Allow rotation only if the car is moving (speed is non-zero)
    if (this.xSpeed !== 0 || this.ySpeed !== 0) {
      this.rotation -= 1;
    }
  }

  public rotateRight() {
    // Allow rotation only if the car is moving (speed is non-zero)
    if (this.xSpeed !== 0 || this.ySpeed !== 0) {
      this.rotation += 1;
    }
  }

  /**
   *
   */
  public accelerate() {
    const deltaRotation = (this.rotation * Math.PI) / 180;
    const deltaX = Math.sin(deltaRotation);
    const deltaY = Math.cos(deltaRotation);

    this.xSpeed += deltaX;
    this.ySpeed -= deltaY;
  }

  /**
   *
   */
  public brake() {
    this.xSpeed *= 0.9;
    this.ySpeed *= 0.9;
  }

  /**
   * updates the car's position
   *
   * @param elapsed is the elapsed time that has passed since each frame
   */
  public override update(elapsed: number): void {
    this.posX += this.xSpeed;
    this.posY += this.ySpeed;
  }

  /**
   * renders the car
   *
   * @param canvas is the selected canvas the car is rendered to
   */
  public override render(canvas: HTMLCanvasElement): void {

  }
}
