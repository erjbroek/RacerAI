import Car from '../Car.js';

export default class Player extends Car {
  public fitness: number = 0;

  public collided: boolean = false;

  public finished: boolean = false;

  public constructor(midPoint: number[], startAngle: number) {
    super();
    this.width = window.innerHeight / 40;
    this.height = window.innerHeight / 25;
    this.alive = true;
    [this.posX, this.posY] = [midPoint[0], midPoint[1]];
    this.rotation = startAngle;
    this.xSpeed = 0;
    this.ySpeed = 0;
  }

  /**
   * rotates the car left
   */
  public rotateLeft() {
    if (this.xSpeed !== 0 || this.ySpeed !== 0) {
      this.rotation -= 2.1;
      this.updateSpeedWithRotation();
    }
  }

  /**
   * rotates the car right
   */
  public rotateRight() {
    if (this.xSpeed !== 0 || this.ySpeed !== 0) {
      this.rotation += 2.1;
      this.updateSpeedWithRotation();
    }
  }

  /**
   * after rotating, this updates the x and y speed of the car
   */
  private updateSpeedWithRotation() {
    const radians = ((this.rotation - 90) * Math.PI) / 180;

    const speedMagnitude = Math.sqrt(this.xSpeed * this.xSpeed + this.ySpeed * this.ySpeed);

    this.xSpeed = speedMagnitude * Math.cos(radians);
    this.ySpeed = speedMagnitude * Math.sin(radians);
  }

  /**
   *
   */
  public accelerate() {
    const deltaRotation = (this.rotation * Math.PI) / 180;
    const deltaX = Math.sin(deltaRotation);
    const deltaY = Math.cos(deltaRotation);

    if (this.xSpeed >= -5 && this.xSpeed <= 5) {
      this.xSpeed += deltaX / 7;
    }
    if (this.ySpeed >= -5 && this.ySpeed <= 5) {
      this.ySpeed -= deltaY / 7;
    }
  }

  /**
   *
   */
  public brake() {
    // Reduce the effect by a factor of 50
    const brakeFactor = 1 - (1 - 0.6) / 13;
    this.xSpeed *= brakeFactor;
    this.ySpeed *= brakeFactor;
  }

  /**
   * updates the car's position
   *
   * @param elapsed is the elapsed time that has passed since each frame
   */
  public override update(elapsed: number): void {
    this.xSpeed *= 0.99;
    this.ySpeed *= 0.99;
    this.posX += this.xSpeed;
    this.posY += this.ySpeed;
  }
}
