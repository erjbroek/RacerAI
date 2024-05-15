import CanvasUtil from "../utilities/CanvasUtil.js";
import KeyListener from "../utilities/KeyListener.js";
import GeneticCar from "./GeneticCar.js";
import Population from './Population.js';
import Scene from "./Scene.js";
import Track from './Track.js';

export default class GeneticAlgorithm extends Scene {
  private track: Track;

  private radius: number;

  private population: Population;

  public constructor(track: Track, radius: number) {
    super();
    this.track = track;
    this.radius = radius;
    const startAngle = (Math.atan((this.track.lineStart[1] - this.track.lineEnd[1]) / (this.track.lineStart[0] - this.track.lineEnd[0])) * 180) / Math.PI;
    this.population = new Population(30, this.track.midPoint, startAngle, this.track);
  }

  public override processInput(keyListener: KeyListener): void {

  }

  /**
   * @param elapsed is the elapsed time since the last frame
   * @returns scene
   */
  public override update(elapsed: number): Scene {
    this.population.update(elapsed);
    return this;
  }

  /**
   * @param canvas is the selected canvas all items are rendered on
   */
  public override render(canvas: HTMLCanvasElement): void {
    canvas.style.cursor = "default";
    this.track.render(canvas);
    this.population.render(canvas);
    CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width / 30, canvas.height, 50, 120, 200);
    CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width, canvas.height / 20, 50, 120, 200);
    CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6, 0, canvas.width / 6, canvas.height, 50, 120, 200);
    CanvasUtil.fillRectangle(canvas, 0, canvas.height - canvas.height / 20, canvas.width, canvas.height / 20, 50, 120, 200);
    CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6.5, canvas.height / 20, canvas.width / 5 - canvas.width / 18, canvas.height / 1.111, 255, 255, 255, 0.2);
  }
}
