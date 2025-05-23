import DrawTrack from '../scenes/DrawTrack.js';
import Car from '../Car.js';
import Track from '../Track.js';
import CanvasUtil from '../utilities/CanvasUtil.js';

export default class NetCar extends Car {
  public fitness: number = 0;

  private checkAlive: number = 500;

  public position: number = 0;

  public parentPosition: number;

  public distance: number = 0;

  public collided: boolean = false;

  public finished: boolean = false;

  private rayLength: number = 150;

  public numRays: number = 5;

  private raySpread: number = 180;

  public rayLengths: number[];

  public genome: number[][] = [];

  public biases: number[] = [];

  public laps: number = 0;

  public crossingFinishLine: boolean = false;

  public leftStartLine: boolean = false;

  public timeSinceLastLap: number = 0;

  public raceDuration: number = 0;

  public startingPoint: number[] = [0, 0];

  // used to render the lines behind the cars
  public locationHistory: number[][] = [];

  public speed: number;

  public constructor(startPoint: number[], startAngle: number, genome: number[][], biases: number[], speed: number) {
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
    this.rayLengths = Array(this.numRays).fill(this.rayLength);
    this.genome = genome;
    this.biases = biases;
    this.speed = speed;
  }

  /**
   * Cast rays and get distances to the track boundary
   *
   * @param track is the track where the rays are cast on
   * @returns Array of distances to the track boundary
   */
  public castRays(track: Track): number[] {
    const rayAngles = this.calculateRayAngles();
    this.rayLengths = rayAngles.map((angle) => this.castRay(angle, track));
    return this.rayLengths;
  }

  /**
   * Calculate angles for each ray based on the car's rotation
   *
   * @returns Array of angles in degrees
   */
  private calculateRayAngles(): number[] {
    const angles = [];
    for (let i = 0; i < this.numRays; i++) {
      const angle = (i / (this.numRays - 1)) * this.raySpread - this.raySpread / 2 - 90;
      angles.push(this.rotation + angle);
    }
    return angles;
  }

  /**
   * Cast a single ray and return the distance to the nearest track boundary
   *
   * @param angle is the angle of the ray
   * @param track is the track where the ray is cast on
   * @returns distance representing ray length travelled before collision
   */
  private castRay(angle: number, track: Track): number {
    const radianAngle = (angle * Math.PI) / 180;
    let rayX = this.posX;
    let rayY = this.posY;

    for (let d = 0; d < this.rayLength; d++) {
      rayX = this.posX + d * Math.cos(radianAngle);
      rayY = this.posY + d * Math.sin(radianAngle);

      const gridX = Math.floor(rayX / track.gridSize);
      const gridY = Math.floor(rayY / track.gridSize);

      let collisionOccured = false;

      for (let offsetX = -1; offsetX <= 1; offsetX++) {
        for (let offsetY = -1; offsetY <= 1; offsetY++) {
          const cellX = gridX + offsetX;
          const cellY = gridY + offsetY;
          const cellKey = `${cellX},${cellY}`;
          const tracksInCell = track.getTracksInCell(cellKey);

          tracksInCell.forEach((trackIndex) => {
            const [trackX, trackY] = track.road[trackIndex];
            const distanceSquared = (rayX - trackX) ** 2 + (rayY - trackY) ** 2;
            const minDistanceSquared = track.radius ** 2;
            if (distanceSquared < minDistanceSquared) {
              collisionOccured = true;
            }
          });
        }
      }

      if (!collisionOccured) {
        return d;
      }
    }

    return this.rayLength;
  }

  /**
   *
   * @param inputs are the distances the player is from the track boundaries
   */
  public feedForward(inputs: number[], isAi: boolean): void {
    const outputLayer = [0, 0, 0, 0];

    // multiplies each input by the weight of the connection and adds it to the output layer
    this.genome.forEach((connection) => {
      const [inputIndex, outputIndex, weight, bias] = connection;
      if (inputIndex < inputs.length && outputIndex < outputLayer.length) {
        outputLayer[outputIndex] += (inputs[inputIndex] / this.rayLength) * weight;
      }
    });

    // adding biases of each output node
    // outputLayer.forEach((value, index) => {
    //   outputLayer[index] += this.biases[index];
    // });

    // activates the output layer
    const activatedOutputLayer = outputLayer.map((neuron) => this.sigmoid(neuron));

    // based on the activated output layer, the car will perform actions
    const turnActions = activatedOutputLayer.slice(0, 2); // steering left or right
    const speedActions = activatedOutputLayer.slice(2, 4); // giving gas or braking


    // Determine if the car should move left or right
    if (turnActions[0] > turnActions[1]) {
      this.rotateLeft(isAi);
    } else if (turnActions[1] > turnActions[0]) {
      this.rotateRight(isAi);
    }

    // Determine speed control action
    if (speedActions[0] > speedActions[1]) {
      this.accelerate(isAi);
    } else if (speedActions[1] > speedActions[0]) {
      this.brake(isAi);
    }
  }

  /**
   *
   * @param x is the input value
   * @returns the sigmoid value of the input
   */
  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  /**
   * updates the car's position, speeds and alive status
   *
   * @param elapsed is the elapsed time that has passed since each frame
   * @param track is the track the car is driving on
   * @param isAi is a boolean that checks if the car is controlled by the AI
   */
  public override update(elapsed: number, track: Track, isAi: boolean): void {
    this.prevPosX = this.posX;
    this.prevPosY = this.posY;
    this.feedForward(this.rayLengths, isAi);
    this.xSpeed *= 0.98;
    this.ySpeed *= 0.98;

    // used to punish cars that havent left the finish line
    const distanceFromStart = Math.sqrt((this.posX - this.startingPoint[0]) ** 2 + (this.posY - this.startingPoint[1]) ** 2);
    if (distanceFromStart > (120 + (track.radius * 0.15 * Number(DrawTrack.racing)))) {
      this.leftStartLine = true;
    }

    if (Math.abs(this.xSpeed) + Math.abs(this.ySpeed) <= 0.55) {
      this.checkAlive -= elapsed;
    }
    if (this.checkAlive <= 0) {
      this.alive = false;
    }

    // if (isAi) {
    //   this.posX += ((this.xSpeed / 10) * this.speed) * elapsed;
    //   this.posY += ((this.ySpeed / 10) * this.speed) * elapsed;
    // } else {
      this.posX += (this.xSpeed / 5) * elapsed;
      this.posY += (this.ySpeed / 5) * elapsed;
    // }
  }

  /**
   * rotates the car left
   */
  public rotateLeft(isAi: boolean) {
    if (Math.abs(this.xSpeed) + Math.abs(this.ySpeed) >= 0.2) {
      if (isAi) {
        this.rotation -= 5 * this.speed;
      } else {
        this.rotation -= 5;
      }
      this.updateSpeedWithRotation();
    }
  }

  /**
   * rotates the car right
   */
  public rotateRight(isAi: boolean) {
    if (Math.abs(this.xSpeed) + Math.abs(this.ySpeed) >= 0.2) {
      if (isAi) {
        this.rotation += 5 * this.speed;
      } else {
        this.rotation += 5;
      }
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
  public accelerate(isAi: boolean) {
    const deltaRotation = (this.rotation * Math.PI) / 180;
    const deltaX = Math.sin(deltaRotation);
    const deltaY = Math.cos(deltaRotation);

    if (isAi) {
      this.xSpeed += (deltaX / 17) * this.speed;
      this.ySpeed -= (deltaY / 17) * this.speed;
    } else {
      this.xSpeed += deltaX / 17;
      this.ySpeed -= deltaY / 17;
    }
  }

  /**
   *
   */
  public brake(isAi: boolean) {
    const brakeFactor = 1 - (1 - 0.6) / 20;
    if (isAi) {
      this.xSpeed *= brakeFactor * this.speed;
      this.ySpeed *= brakeFactor * this.speed;
    } else {
    this.xSpeed *= brakeFactor;
    this.ySpeed *= brakeFactor;
  }
  }

  /**
   *
   */
  public updateDistance() {
    const distance = Math.abs(this.xSpeed) + Math.abs(this.ySpeed);
    this.distance += distance;
  }

  /**
   *
   * @param canvas is the selected canvas the items are drawn on
   * @param track is the track the car is drawn on
   */
  public renderRays(canvas: HTMLCanvasElement, track: Track) {
    this.castRays(track); // Ensure rayLengths are updated
    const rayAngles = this.calculateRayAngles();
    rayAngles.forEach((angle, i) => {
      const distance = this.rayLengths[i];
      const radianAngle = (angle * Math.PI) / 180;
      const endX = this.posX + distance * Math.cos(radianAngle);
      const endY = this.posY + distance * Math.sin(radianAngle);
      CanvasUtil.drawLine(canvas, this.posX, this.posY, endX, endY, 0, 255, 0, 1, 0.4);
    });
  }
}
