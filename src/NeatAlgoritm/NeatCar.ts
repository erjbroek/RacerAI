import Car from '../Car.js';
import Track from '../Track.js';
import CanvasUtil from '../utilities/CanvasUtil.js';

export default class NeatCar extends Car {
  public fitness: number = 0;

  private checkAlive: number = 800;

  public position: number = 0;

  public parentPosition: number;

  public distance: number = 0;

  public collided: boolean = false;

  public finished: boolean = false;

  private rayLength: number = 100; // Length of each ray

  private numRays: number = 5; // Number of rays

  private raySpread: number = 180; // Angle spread of rays in degrees

  public rayLengths: number[]; // Array to store lengths of each ray

  public constructor(startPoint: number[], startAngle: number, parentPosition: number = null) {
    super();
    this.width = window.innerHeight / 40;
    this.height = window.innerHeight / 25;
    this.alive = true;
    [this.posX, this.posY] = [startPoint[0], startPoint[1]];
    this.rotation = startAngle;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.parentPosition = parentPosition;
    this.rayLengths = Array(this.numRays).fill(this.rayLength);
  }

  /**
   * Cast rays and get distances to the track boundary
   *
   * @param track
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
      const angle = (i / (this.numRays - 1)) * this.raySpread - (this.raySpread / 2) - 90;
      angles.push(this.rotation + angle);
    }
    return angles;
  }

  /**
   * Cast a single ray and return the distance to the nearest track boundary
   *
   * @param angle
   * @param track
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
   */
  public mutate(): void {}

  /**
   * rotates the car left
   */
  public rotateLeft() {
    if (this.xSpeed !== 0 || this.ySpeed !== 0) {
      this.rotation -= 2.3;
      this.updateSpeedWithRotation();
    }
  }

  /**
   * rotates the car right
   */
  public rotateRight() {
    if (this.xSpeed !== 0 || this.ySpeed !== 0) {
      this.rotation += 2.3;
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

  /**
   *
   * @param canvas is the selected canvas the items are drawn on
   * @param track
   */
  public render(canvas: HTMLCanvasElement, track: Track) {
    this.castRays(track); // Ensure rayLengths are updated
    const rayAngles = this.calculateRayAngles();
    rayAngles.forEach((angle, i) => {
      const distance = this.rayLengths[i];
      const radianAngle = (angle * Math.PI) / 180;
      const endX = this.posX + distance * Math.cos(radianAngle);
      const endY = this.posY + distance * Math.sin(radianAngle);
      CanvasUtil.drawLine(canvas, this.posX, this.posY, endX, endY, 0, 255, 0, 1, 1);
    });
  }
}
