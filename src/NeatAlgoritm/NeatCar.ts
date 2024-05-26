import Car from '../Car.js';
import Track from '../Track.js';

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

  private raySpread: number = 90; // Angle spread of rays in degrees

  public constructor(midPoint: number[], startAngle: number, parentPosition: number = null) {
    super();
    this.width = window.innerHeight / 40;
    this.height = window.innerHeight / 25;
    this.alive = true;
    [this.posX, this.posY] = [midPoint[0], midPoint[1]];
    this.rotation = startAngle;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.parentPosition = parentPosition;
  }

  /**
   * Cast rays and get distances to the track boundary
   *
   * @param track
   */
  public castRays(track: Track): number[] {
    const rayAngles = this.calculateRayAngles();
    const distances = rayAngles.map((angle) => this.castRay(angle, track));
    return distances;
  }

  /**
   * Calculate angles for each ray based on the car's rotation
   */
  private calculateRayAngles(): number[] {
    const angles = [];
    for (let i = 0; i < this.numRays; i++) {
      const angle = (i / (this.numRays - 1)) * this.raySpread - (this.raySpread / 2);
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
    const rayX = this.posX + this.rayLength * Math.cos(radianAngle);
    const rayY = this.posY + this.rayLength * Math.sin(radianAngle);

    let closestDistance = this.rayLength;

    // Check for intersection with track points
    track.road.forEach(([trackX, trackY]) => {
      const distance = this.getRayIntersectionDistance(
        this.posX,
        this.posY,
        rayX,
        rayY,
        trackX,
        trackY,
        track.radius,
      );
      if (distance < closestDistance) {
        closestDistance = distance;
      }
    });

    return closestDistance;
  }

  /**
   * Calculate the distance from the ray's start to the intersection point with a track point
   *
   * @param rayStartX
   * @param rayStartY
   * @param rayEndX
   * @param rayEndY
   * @param trackX
   * @param trackY
   * @param radius
   * @returns ray length
   */
  private getRayIntersectionDistance(rayStartX: number, rayStartY: number, rayEndX: number, rayEndY: number, trackX: number, trackY: number, radius: number): number {
    const dx = rayEndX - rayStartX;
    const dy = rayEndY - rayStartY;

    const fx = rayStartX - trackX;
    const fy = rayStartY - trackY;

    const a = dx * dx + dy * dy;
    const b = 2 * (fx * dx + fy * dy);
    const c = (fx * fx + fy * fy) - radius * radius;

    const discriminant = b * b - 4 * a * c;

    if (discriminant >= 0) {
      const discriminantSqrt = Math.sqrt(discriminant);

      const t1 = (-b - discriminantSqrt) / (2 * a);
      const t2 = (-b + discriminantSqrt) / (2 * a);

      if (t1 >= 0 && t1 <= 1) {
        return t1 * Math.sqrt(dx * dx + dy * dy);
      }
      if (t2 >= 0 && t2 <= 1) {
        return t2 * Math.sqrt(dx * dx + dy * dy);
      }
    }

    return this.rayLength;
  }

  /**
   *
   */
  public mutate(): void {

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
