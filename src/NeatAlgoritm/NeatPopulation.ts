import Track from '../Track.js';
import NeatCar from './NeatCar.js';

export default class NeatPopulation {
  public cars: NeatCar[] = [];

  private generation: number = 1;

  private size: number;

  private highScore: number = 0;

  public extinct: boolean = false;

  private track: Track;

  public constructor(size: number) {
    this.size = size;
  }
}
