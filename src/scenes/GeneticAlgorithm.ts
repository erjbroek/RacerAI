import CanvasUtil from "../utilities/CanvasUtil.js";
import KeyListener from "../utilities/KeyListener.js";
import GeneticCar from "./GeneticCar.js";
import Scene from "./Scene.js";

export default class GeneticAlgorithm extends Scene {
  private track: number[][];

  private aliveCars: GeneticCar[] = [];

  private cars: GeneticCar[] = [];

  private radius: number;

  private lineStart: number[];

  private lineEnd: number[];

  private startAngle: number;

  private midPoint: number[];

  private moveDuration: number = 400;

  private moveNumber: number = 0;

  private gridSize: number;

  private grid: Map<string, number[]>;

  public constructor(track: number[][], radius: number, lineStart: number[], lineEnd: number[], midPoint: number[]) {
    super();
    this.track = track;
    this.radius = radius;
    this.lineStart = lineStart;
    this.lineEnd = lineEnd;
    this.midPoint = midPoint;
    this.startAngle = (Math.atan((this.lineStart[1] - this.lineEnd[1]) / (this.lineStart[0] - this.lineEnd[0])) * 180) / Math.PI;
    for (let i = 0; i < 100; i++) {
      this.aliveCars.push(new GeneticCar(this.midPoint, this.startAngle));
    }

    this.gridSize = Math.ceil(window.innerWidth / 10);
    this.grid = new Map();
    this.initializeGrid();
  }

  public override processInput(keyListener: KeyListener): void {

  }

  /**
   * initialises the grid
   */
  private initializeGrid() {
    this.track.forEach((trackPiece, index) => {
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
   */
  private checkCollisionWithTrack(car: GeneticCar) {
    const gridX = Math.floor(car.posX / this.gridSize);
    const gridY = Math.floor(car.posY / this.gridSize);

    let collisionOccured = false;

    const checkCollisionInCell = (cellX: number, cellY: number) => {
      const cellKey = `${cellX},${cellY}`;
      const tracksInCell = this.getTracksInCell(cellKey);

      tracksInCell.forEach((trackIndex) => {
        const [trackX, trackY] = this.track[trackIndex];
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
      car.dead = true;
      this.cars.push(car);
      this.aliveCars.splice(this.aliveCars.indexOf(car), 1);
    } else {
      car.dead = false;
    }
  }

  /**
   * @param elapsed is the elapsed time since the last frame
   * @returns scene
   */
  public override update(elapsed: number): Scene {
    if (this.aliveCars.length > 0) {
      this.moveDuration -= elapsed;
      if (this.moveDuration <= 0) {
        console.log(this.aliveCars)
        this.aliveCars.forEach((car) => {
          car.processMoves(this.moveNumber);
        });
        this.moveNumber += 1;
        this.moveDuration = 400;
      }
      this.aliveCars.forEach((car) => {
        if (!car.dead) {
          car.update(elapsed);
          this.checkCollisionWithTrack(car);
        }
      });
    } else {
      console.log('rip')
    }
    return this;
  }

  /**
   * @param canvas is the selected canvas all items are rendered on
   */
  public override render(canvas: HTMLCanvasElement): void {
    canvas.style.cursor = "default";
    this.track.forEach((trackPiece) => {
      CanvasUtil.fillCircle(canvas, trackPiece[0], trackPiece[1], this.radius, 0, 0, 0);
    });
    this.aliveCars.forEach((car) => {
      CanvasUtil.drawCar(canvas, car.posX, car.posY, car.width, car.height, car.rotation);
    });
    CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width / 30, canvas.height, 50, 120, 200);
    CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width, canvas.height / 20, 50, 120, 200);
    CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6, 0, canvas.width / 6, canvas.height, 50, 120, 200);
    CanvasUtil.fillRectangle(canvas, 0, canvas.height - canvas.height / 20, canvas.width, canvas.height / 20, 50, 120, 200);
    CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6.5, canvas.height / 20, canvas.width / 5 - canvas.width / 18, canvas.height / 1.111, 255, 255, 255, 0.2);
  }
}
