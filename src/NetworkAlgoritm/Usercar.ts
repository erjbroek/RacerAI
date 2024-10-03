import KeyListener from '../utilities/KeyListener.js';
import Car from '../Car.js';
import Track from '../Track.js';
import CanvasUtil from '../utilities/CanvasUtil.js';

export default class Usercar extends Car {
  private checkAlive: number = 500;

  public collided: boolean = false;

  public finished: boolean = false;

  public laps: number = 0;

  public crossingFinishLine: boolean = false;

  public startingPoint: number[] = [0, 0];

  // used to render the lines behind the cars
  public locationHistory: number[][] = [];

  public constructor(startPoint: number[], startAngle: number) {
    super();
    this.onFinishLine = false;
    this.width = window.innerHeight / 40;
    this.height = window.innerHeight / 25;
    this.alive = true;
    this.prevPosX = 0;
    this.prevPosY = 0;
    [this.posX, this.posY] = [startPoint[0], startPoint[1]];
    this.startingPoint = startPoint;
    this.rotation = startAngle;
    this.xSpeed = 0;
    this.ySpeed = 0;
  }

  /**
   * updates the car's position, speeds and alive status
   *
   * @param elapsed is the elapsed time that has passed since each frame
   */
  public override update(elapsed: number, track: Track): void {
    this.prevPosX = this.posX;
    this.prevPosY = this.posY;

    // friction
    this.xSpeed *= 0.98;
    this.ySpeed *= 0.98;

    if (KeyListener.isKeyDown('KeyW') || KeyListener.isKeyDown('ArrowUp')) {
      this.accelerate();
    } else if (KeyListener.isKeyDown('KeyS') || KeyListener.isKeyDown('ArrowDown')) {
      this.brake();
    }

    if (KeyListener.isKeyDown('KeyA') || KeyListener.isKeyDown('ArrowLeft')) {
      this.rotateLeft();
    } else if (KeyListener.isKeyDown('KeyD') || KeyListener.isKeyDown('ArrowRight')) {
      this.rotateRight();
    }
    if (track.checkCollisionWithTrack(this)) {
      this.posX += (this.xSpeed / 7) * elapsed;
      this.posY += (this.ySpeed / 7) * elapsed;
    } else {
      this.posX += (this.xSpeed / 14) * elapsed;
      this.posY += (this.ySpeed / 14) * elapsed;
    }
  }

  /**
   * renders the usercar on the screen
   *
   * @param canvas is the sleected canvas to render the car to
   */
  public render(canvas: HTMLCanvasElement): void {
    CanvasUtil.drawCar(canvas, this.posX, this.posY, this.width, this.height, this.rotation, 255, 0, 0, 1, true);
  }

  /**
   * rotates the car left
   */
  public rotateLeft() {
    if (Math.abs(this.xSpeed) + Math.abs(this.ySpeed) >= 0.2) {
      this.rotation -= 5;
      this.updateSpeedWithRotation();
    }
  }

  /**
   * rotates the car right
   */
  public rotateRight() {
    if (Math.abs(this.xSpeed) + Math.abs(this.ySpeed) >= 0.2) {
      this.rotation += 5;
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

    this.xSpeed += deltaX / 17;
    this.ySpeed -= deltaY / 17;
  }

  /**
   *
   */
  public brake() {
    const brakeFactor = 1 - (1 - 0.6) / 20;
    this.xSpeed *= brakeFactor;
    this.ySpeed *= brakeFactor;
  }
}
