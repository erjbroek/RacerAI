import Car from '../Car.js';
import {
  ACCELERATE, BRAKE, ROTATE_LEFT, ROTATE_RIGHT, ROTATE_SHARP_LEFT, ROTATE_SHARP_RIGHT,
} from '../Actions.js';

export default class GeneticCar extends Car {
  public moves: number[] = [];

  public fitness: number = 0;

  private checkAlive: number = 800;

  public position: number = 0;

  public parentPosition: number;

  public distance: number = 0;

  public collided: boolean = false;

  public finished: boolean = false;

  public constructor(midPoint: number[], startAngle: number, moves: number[], amountMoves: number, parentPosition: number = null) {
    super();
    this.width = window.innerHeight / 40;
    this.height = window.innerHeight / 25;
    this.alive = true;
    [this.posX, this.posY] = [midPoint[0], midPoint[1]];
    this.rotation = startAngle;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.parentPosition = parentPosition;
    if (moves.length === 0) {
      const possibleMoves = [ACCELERATE, BRAKE, ROTATE_LEFT, ROTATE_RIGHT, ROTATE_SHARP_LEFT, ROTATE_SHARP_RIGHT];
      this.moves = this.generateRandomMoves(amountMoves, possibleMoves);
    } else {
      this.moves = moves;
    }
    // console.log(this.moves)
  }

  /**
   * Generates a list of random moves
   *
   * @param amountMoves The number of moves to generate
   * @param possibleMoves The array of possible moves
   * @returns An array of random moves
   */
  public generateRandomMoves(amountMoves: number, possibleMoves: number[]): number[] {
    const moves: number[] = [];
    for (let i = 0; i < amountMoves; i++) {
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      moves.push(randomMove);
    }
    return moves;
  }

  /**
   * @param moveNumber is the index of the moves list that should be triggered
   * @param elapsed
   */
  public processMoves(moveNumber: number, elapsed: number) {
    const move = this.moves[moveNumber];
    if (moveNumber >= this.moves.length - 1) {
      // this.alive = false;
      this.checkAlive -= elapsed;
    }
    if (this.checkAlive <= 0) {
      this.alive = false;
    }
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

  public mutateMoves(moves: number[]): number[] {
    const newMoves = [...moves]; // Clone the array to avoid modifying the original moves
    const mutationCount = Math.ceil(newMoves.length * 0.06); // Mutate 5% of the moves, for example

    for (let i = 0; i < mutationCount; i++) {
      const moveIndex = Math.floor(Math.random() * newMoves.length);
      const currentMutationRate = 0.01 + ((moveIndex / newMoves.length) ** 2); // Base rate with exponential growth
      if (Math.random() < currentMutationRate) {
        newMoves[moveIndex] = this.generateRandomMove(); // Generate a new random move
      }
    }

    return newMoves;
  }

  public generateRandomMove(): number {
    const possibleMoves = [ACCELERATE, BRAKE, ROTATE_LEFT, ROTATE_RIGHT, ROTATE_SHARP_LEFT, ROTATE_SHARP_RIGHT];
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  }

  public addMoves(amount: number) {
    const newMoves = this.generateRandomMoves(amount, [ACCELERATE, BRAKE, ROTATE_LEFT, ROTATE_RIGHT, ROTATE_SHARP_LEFT, ROTATE_SHARP_RIGHT]);
    newMoves.forEach((newMove) => {
      this.moves.push(newMove);
    });
  }

  /**
   * rotates the car left
   */
  public rotateLeft() {
    const deltaRotation = (this.rotation * Math.PI) / 180;
    const deltaX = Math.sin(deltaRotation);
    const deltaY = Math.cos(deltaRotation);

    this.xSpeed += deltaX / 13;
    this.ySpeed -= deltaY / 13;
    if (this.xSpeed !== 0 || this.ySpeed !== 0) {
      this.rotation -= 1.2;
      this.updateSpeedWithRotation();
    }
  }

  /**
   * rotates the car right
   */
  public rotateRight() {
    const deltaRotation = (this.rotation * Math.PI) / 180;
    const deltaX = Math.sin(deltaRotation);
    const deltaY = Math.cos(deltaRotation);

    this.xSpeed += deltaX / 13;
    this.ySpeed -= deltaY / 13;
    if (this.xSpeed !== 0 || this.ySpeed !== 0) {
      this.rotation += 1.2;
      this.updateSpeedWithRotation();
    }
  }

  /**
   * rotates the car left
   */
  public rotateSharpLeft() {
    const deltaRotation = (this.rotation * Math.PI) / 180;
    const deltaX = Math.sin(deltaRotation);
    const deltaY = Math.cos(deltaRotation);

    this.xSpeed += deltaX / 20;
    this.ySpeed -= deltaY / 20;
    if (this.xSpeed !== 0 || this.ySpeed !== 0) {
      this.rotation -= 2;
      this.updateSpeedWithRotation();
    }
  }

  /**
   * rotates the car right
   */
  public rotateSharpRight() {
    const deltaRotation = (this.rotation * Math.PI) / 180;
    const deltaX = Math.sin(deltaRotation);
    const deltaY = Math.cos(deltaRotation);

    this.xSpeed += deltaX / 20;
    this.ySpeed -= deltaY / 20;
    if (this.xSpeed !== 0 || this.ySpeed !== 0) {
      this.rotation += 2;
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

    this.xSpeed += deltaX / 7;
    this.ySpeed -= deltaY / 7;
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
   *
   */
  public updateDistance() {
    const distance = Math.abs(this.xSpeed) + Math.abs(this.ySpeed);
    this.distance += distance;
  }

  /**
   * updates the car's position
   *
   * @param elapsed is the elapsed time that has passed since each frame
   */
  public override update(elapsed: number): void {
    this.xSpeed *= 0.96;
    this.ySpeed *= 0.96;
    if (Math.abs(this.xSpeed) + Math.abs(this.ySpeed) <= 0.01) {
      this.checkAlive -= elapsed;
    }
    if (this.checkAlive <= 0) {
      this.alive = false;
    }
    this.posX += this.xSpeed / 5 * (elapsed);
    this.posY += this.ySpeed / 5 * (elapsed);
  }
}
