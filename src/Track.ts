import CanvasUtil from './utilities/CanvasUtil.js';
import GeneticCar from './GeneticAlgorithm/GeneticCar.js';
import MouseListener from './utilities/MouseListener.js';
import Car from './Car.js';
import NetCar from './NetworkAlgoritm/NetCar.js';
import NetPopulation from './NetworkAlgoritm/NetPopulation.js';
import DrawTrack from './scenes/DrawTrack.js';
import Usercar from './NetworkAlgoritm/Usercar.js';

export default class Track {
  public road: number[][];

  public deathPositions: number[][] = [];

  public radius: number;

  public lineStart: number[] = [];

  public lineEnd: number[] = [];

  public midPoint: number[] = [];

  public gridSize: number;

  public grid: Map<string, number[]>;

  public finishLineWidth: number = 7;

  public red: number = 0;

  public constructor(track: number[][], radius: number) {
    this.road = track;
    this.radius = radius;

    this.road.forEach((trackPiece) => {
      trackPiece[2] = 0;
      const found: number[] = [];
      this.road.forEach((track2) => {
        if (Math.sqrt((trackPiece[0] - track2[0]) ** 2 + (trackPiece[1] - track2[1]) ** 2) <= this.radius * 1.5 && trackPiece !== track2) {
          found.push(this.road.indexOf(track2));
        }
      });

      if (found.length <= 4) {
        trackPiece[2] = 1;
        if (this.road.indexOf(trackPiece) <= this.road.length - 2) {
          this.road[this.road.indexOf(trackPiece) + 1][2] = 1;
        }
      }
    });

    this.gridSize = Math.ceil(window.innerWidth / 10);
    this.grid = new Map();
    this.initializeGrid();
  }

  /**
   * initialises the grid
   */
  private initializeGrid() {
    this.road.forEach((trackPiece, index) => {
      const [x, y] = trackPiece;
      const cellKey = this.getCellKey(x, y);
      if (!this.grid.has(cellKey)) {
        this.grid.set(cellKey, []);
      }
      this.grid.get(cellKey)?.push(index);
    });
  }

  /**
   *
   * @param x is the x position of the item
   * @param y is the y position of the item
   * @returns the gridkey as string
   */
  private getCellKey(x: number, y: number): string {
    const gridX = Math.floor(x / this.gridSize);
    const gridY = Math.floor(y / this.gridSize);
    return `${gridX},${gridY}`;
  }

  public getTracksInCell(cellKey: string): number[] {
    return this.grid.get(cellKey) || [];
  }

  /**
   * @param car is the selected car that will be used to check collision with track
   * @returns boolean if car is alive or not (if player isn't on the road, he dies)
   */
  public checkCollisionWithTrack(car: any): boolean {
    const gridX = Math.floor(car.posX / this.gridSize);
    const gridY = Math.floor(car.posY / this.gridSize);

    let collisionOccured = false;

    const checkCollisionInCell = (cellX: number, cellY: number) => {
      const cellKey = `${cellX},${cellY}`;
      const tracksInCell = this.getTracksInCell(cellKey);

      tracksInCell.forEach((trackIndex) => {
        const [trackX, trackY] = this.road[trackIndex];
        const distanceSquared = (car.posX - trackX) ** 2 + (car.posY - trackY) ** 2;
        const minDistanceSquared = this.radius ** 2;
        if (distanceSquared < minDistanceSquared) {
          collisionOccured = true;
        }
      });
    };

    for (let offsetX = -1; offsetX <= 1; offsetX++) {
      for (let offsetY = -1; offsetY <= 1; offsetY++) {
        const cellX = gridX + offsetX;
        const cellY = gridY + offsetY;
        checkCollisionInCell(cellX, cellY);
      }
    }

    if (!collisionOccured) {
      car.collided = true;
      // only adds positions of car to array if car isn't in there already
      if (!this.deathPositions.some(([x, y]) => x === car.posX && y === car.posY)) {
        this.deathPositions.push([car.posX, car.posY]);
      }
      return false;
    }
    return true;
  }

  /**
   * checks if player collides with the finish
   *
   * @param car is the selected car that the collision is checked for
   * @returns boolean
   */
  public checkCrossingFinishLine(car: NetCar | GeneticCar | Usercar): boolean {
    const [x1, y1] = this.lineStart;
    const [x2, y2] = this.lineEnd;

    // Previous and current position of the car
    const [prevCarX, prevCarY] = [car.prevPosX, car.prevPosY];
    const [carX, carY] = [car.posX, car.posY];

    // Check if the car crosses the line segment
    if (this.doLineSegmentsIntersect(x1, y1, x2, y2, prevCarX, prevCarY, carX, carY)) {
      this.red = 255;
      return true;
    }

    this.red = 0;
    return false; // Car has not crossed the finish line yet
  }

  /**
   * Check if two line segments intersect (line 1 being the finish, and line 2 being the line between the cars current and previous position)
   *
   * @param x1 x1 - start point of the first line segment
   * @param x2 x2 - end point of the first line segment
   * @param x3 x3 - start point of the second line segment
   * @param x4 x4 - end point of the second line segment
   * @param y1 y1 - start point of the first line segment
   * @param y2 y2 - end point of the first line segment
   * @param y3 y3 - start point of the second line segment
   * @param y4 y4 - start point of the second line segment
   * @returns boolean
   */
  private doLineSegmentsIntersect(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): boolean {
    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (denom === 0) return false; // Lines are parallel

    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

    return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
  }

  /**
   *
   * @param canvas is the selected canvas all the items are rendered on
   */
  public render(canvas: HTMLCanvasElement) {
    this.road.forEach((trackPiece) => {
      CanvasUtil.fillCircle(canvas, trackPiece[0], trackPiece[1], this.radius, 20 / (trackPiece[2] + 0.1), 0, 0, 1)
    });
    CanvasUtil.drawFinishLine(canvas, this.lineStart[0], this.lineStart[1], this.lineEnd[0], this.lineEnd[1], 15);
  }
}
