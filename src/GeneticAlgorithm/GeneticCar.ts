import Car from '../Car.js';
import {
  ACCELERATE, BRAKE, ROTATE_LEFT, ROTATE_RIGHT,
} from '../Actions.js';

export default class GeneticCar extends Car {
  private moves: number[] = [];

  private fitness: number = 0;

  public constructor(midPoint: number[], startAngle: number, amountMoves: number) {
    super();
    this.width = window.innerHeight / 40;
    this.height = window.innerHeight / 25;
    this.alive = true;
    [this.posX, this.posY] = [midPoint[0], midPoint[1]];
    this.rotation = startAngle;
    this.xSpeed = 0;
    this.ySpeed = 0;
    const possibleMoves = [ACCELERATE, BRAKE, ROTATE_LEFT, ROTATE_RIGHT];
    this.moves = this.generateRandomMoves(amountMoves, possibleMoves);
    // console.log(this.moves)
  }

  /**
   * Generates a list of random moves
   *
   * @param amountMoves The number of moves to generate
   * @param possibleMoves The array of possible moves
   * @returns An array of random moves
   */
  private generateRandomMoves(amountMoves: number, possibleMoves: number[]): number[] {
    const moves: number[] = [];
    for (let i = 0; i < amountMoves; i++) {
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      moves.push(randomMove);
    }
    return moves;
  }

  /**
   * @param moveNumber is the index of the moves list that should be triggered
   */
  public processMoves(moveNumber: number) {
    const move = this.moves[moveNumber];
    switch (move) {
      case 0:
        this.rotateLeft();
        break;
      case 1:
        this.rotateRight();
        break;
      case 2:
        this.accelerate();
        break;
      case 3:
        this.brake();
        break;
      default:
        // console.error('Invalid move:', move);
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
    this.xSpeed *= 0.6;
    this.ySpeed *= 0.6;
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
