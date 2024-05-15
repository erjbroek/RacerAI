import Car from "../Car.js";
import { ACCELERATE, BRAKE, ROTATE_LEFT, ROTATE_RIGHT, ROTATE_SHARP_LEFT, ROTATE_SHARP_RIGHT } from "../Actions.js";

export default class GeneticCar extends Car {
  public moves: number[] = [];

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
    const possibleMoves = [ACCELERATE, BRAKE, ROTATE_LEFT, ROTATE_RIGHT, ROTATE_SHARP_LEFT, ROTATE_SHARP_RIGHT];
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
        this.accelerate();
        break;
      case 1:
        this.brake();
        break;
      case 2:
        this.rotateLeft();
        break;
      case 3:
        this.rotateRight();
        break;
      case 4:
        this.rotateSharpLeft();
        break;
      case 5:
        this.rotateSharpRight();
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
      this.rotation -= 0.8;
      this.updateSpeedWithRotation();
    }
  }

  /**
   * rotates the car right
   */
  public rotateRight() {
    if (this.xSpeed !== 0 || this.ySpeed !== 0) {
      this.rotation += 0.8;
      this.updateSpeedWithRotation();
    }
  }

  /**
   * rotates the car left
   */
  public rotateSharpLeft() {
    if (this.xSpeed !== 0 || this.ySpeed !== 0) {
      this.rotation -= 1.5;
      this.updateSpeedWithRotation();
    }
  }

  /**
   * rotates the car right
   */
  public rotateSharpRight() {
    if (this.xSpeed !== 0 || this.ySpeed !== 0) {
      this.rotation += 1.5;
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

    this.xSpeed += deltaX / 30;
    this.ySpeed -= deltaY / 30;
  }

  /**
   *
   */
  public brake() {
    // Reduce the effect by a factor of 50
    const brakeFactor = 1 - (1 - 0.6) / 20;
    this.xSpeed *= brakeFactor;
    this.ySpeed *= brakeFactor;
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
