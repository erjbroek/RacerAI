import CanvasUtil from './utilities/CanvasUtil.js';
import GeneticCar from './GeneticAlgorithm/GeneticCar.js';
import MouseListener from './utilities/MouseListener.js';

export default class Track {
  public road: number[][];

  public radius: number;

  public lineStart: number[] = [];

  public lineEnd: number[] = [];

  public midPoint: number[] = [];

  public gridSize: number;

  public grid: Map<string, number[]>;

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

  private getTracksInCell(cellKey: string): number[] {
    return this.grid.get(cellKey) || [];
  }

  /**
   * @param car is the selected car that will be used to check collision with track
   * @returns boolean if car is alive or not (if player isn't on the road, he dies)
   */
  public checkCollisionWithTrack(car: GeneticCar): boolean {
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
      return false;
    } return true;
  }

  /**
   * checks if player finished the track
   *
   * @param car is the selected car that the collision is checked for
   * @returns boolean
   */
  public checkCrossingFinishLine(car: GeneticCar): boolean {
    const [x1, y1] = this.lineStart;
    const [x2, y2] = this.lineEnd;
    const [carX, carY] = [car.posX, car.posY];

    // Check if the car's position is within the bounds of the finish line segment
    const isBetweenStartAndEnd = (carX >= Math.min(x1, x2) && carX <= Math.max(x1, x2) &&
                                  carY >= Math.min(y1, y2) && carY <= Math.max(y1, y2));

    // If the car is between the start and end points, consider it crossing the finish line
    if (isBetweenStartAndEnd) {
        console.log('yay')
        return true;
    }
    return false; // Car has not crossed the finish line yet
}

  /**
   *
   * @param canvas is the selected canvas all the items are rendered on
   */
  public render(canvas: HTMLCanvasElement) {
    this.road.forEach((trackPiece) => {
      CanvasUtil.fillCircle(canvas, trackPiece[0], trackPiece[1], this.radius, 20 / (trackPiece[2] + 0.1), 0, 0, 1);
    });
    CanvasUtil.drawLine(canvas, this.lineStart[0], this.lineStart[1], this.lineEnd[0], this.lineEnd[1], 0, 255, 0, 1, 4);
  }
}
