import CanvasUtil from '../utilities/CanvasUtil.js';
import GeneticCar from './GeneticCar.js';
import Track from '../Track.js';

export default class GeneticPopulation {
  public cars: GeneticCar[] = [];

  public generation: number = 1;

  public size: number;

  public highScore: number = 0;

  public moveNumber: number = 0;

  public amountMoves: number = 10;

  public extinct: boolean = false;

  public moveDuration: number = 400;

  public track: Track;

  public constructor(size: number, startingLine: number[], startingAngle: number, track: Track) {
    this.size = size;
    this.track = track;
    for (let i = 0; i < size; i++) {
      this.cars.push(new GeneticCar(startingLine, startingAngle, this.amountMoves));
    }
    this.track.road.forEach((road) => {
      road[2] = 1;
    });
  }

  /**
   *
   * @param elapsed is the elapsed time since each last frame
   */
  public update(elapsed: number): void {
    if (!this.extinct) {
      this.moveDuration -= elapsed;
      if (this.moveDuration <= 0) {
        this.moveNumber += 1;
        this.moveDuration = 200;
      }
      this.cars.forEach((car) => {
        if (car.alive) {
          car.processMoves(this.moveNumber);
          car.update(elapsed);
          car.alive = this.track.checkCollisionWithTrack(car);
        }
      });
    } else {
      console.log('rip');
    }
  }

  /**
   *
   * @param canvas is the selected canvas the items are drawn on
   */
  public render(canvas: HTMLCanvasElement) {
    this.cars.forEach((car) => {
      CanvasUtil.drawCar(canvas, car.posX, car.posY, car.width, car.height, car.rotation);
    });
  }
}
