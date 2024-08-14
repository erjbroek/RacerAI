import CanvasUtil from '../utilities/CanvasUtil.js';
import Car from '../Car.js';

export default class DisplayCar extends Car {
  public genome: number[][];

  public constructor(genome: number[][]) {
    super();
    this.width = window.innerHeight / 40;
    this.height = window.innerHeight / 25;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.genome = genome;
  }

  public update(elapsed: number) {

  }

  public render(canvas: HTMLCanvasElement) {
    CanvasUtil.createNetCar(canvas, this);
  }
}
