import Car from './Car.js';

const ROTATE_LEFT = 0;
const ROTATE_RIGHT = 1;
const ACCELERATE = 2;
const BRAKE = 3;

export default class GeneticCar extends Car {
  private moves: number[] = [];

  public constructor(midPoint: number[], startAngle: number) {
    super();
    this.width = window.innerHeight / 40;
    this.height = window.innerHeight / 25;
    [this.posX, this.posY] = [midPoint[0], midPoint[1]];
    this.rotation = startAngle;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.moves = [ACCELERATE, ACCELERATE, ROTATE_LEFT, ROTATE_LEFT, ROTATE_RIGHT, BRAKE];
  }

  /**
   * @param moveNumber is the index of the moves list that should be triggered
   */
  public processMoves(moveNumber: number) {
    const move = this.moves[moveNumber];
    switch (move) {
      case ROTATE_LEFT:
        this.rotateLeft();
        break;
      case ROTATE_RIGHT:
        this.rotateRight();
        break;
      case ACCELERATE:
        this.accelerate();
        break;
      case BRAKE:
        this.brake();
        break;
      default:
        console.error('Invalid move:', move);
        break;
    }
  }

  /**
   * rotates the car left
   */
  public rotateLeft() {
    if (this.xSpeed !== 0 || this.ySpeed !== 0) {
      this.rotation -= 20;
      this.updateSpeedWithRotation();
    }
  }

  /**
   * rotates the car right
   */
  public rotateRight() {
    if (this.xSpeed !== 0 || this.ySpeed !== 0) {
      this.rotation += 20;
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

    this.xSpeed += deltaX;
    this.ySpeed -= deltaY;
  }

  /**
   *
   */
  public brake() {
    if (this.xSpeed !== 0 || this.ySpeed !== 0) {
      const deltaRotation = (this.rotation * Math.PI) / 180;
      const deltaX = Math.sin(deltaRotation) * 1.1;
      const deltaY = Math.cos(deltaRotation) * 1.1;

      this.xSpeed -= deltaX;
      this.ySpeed += deltaY;
    }
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
}
