import CanvasUtil from '../utilities/CanvasUtil.js';
import KeyListener from '../utilities/KeyListener.js';
import MouseListener from '../utilities/MouseListener.js';
import Scene from './Scene.js';

export default class GeneticAlgorithm extends Scene {
  private track: number[][];

  private player: number[][];

  private radius: number;

  private lineStart: number[];

  private lineEnd: number[];

  private midPoint: number[];

  public constructor(track: number[][], radius: number, lineStart: number[], lineEnd: number[], midPoint: number[]) {
    super();
    this.track = track;
    this.radius = radius;
    this.lineStart = lineStart;
    this.lineEnd = lineEnd;
    this.midPoint = midPoint;
  }

  /**
   * processes
   */
  public override processInput(keyListener: KeyListener): void {

  }

  /**
   *
   */
  public override update(elapsed: number): Scene {
    return this;
  }

  /**
   *
   */
  public override render(canvas: HTMLCanvasElement): void {
    canvas.style.cursor = "default";
    this.track.forEach((trackPiece) => {
      CanvasUtil.fillCircle(canvas, trackPiece[0], trackPiece[1], this.radius, 0, 0, 0);
    });
    CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width / 30, canvas.height, 50, 120, 200);
    CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width, canvas.height / 20, 50, 120, 200);
    CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6, 0, canvas.width / 6, canvas.height, 50, 120, 200);
    CanvasUtil.fillRectangle(canvas, 0, canvas.height - canvas.height / 20, canvas.width, canvas.height / 20, 50, 120, 200);
    CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6.5, canvas.height / 20, canvas.width / 5 - canvas.width / 18, canvas.height / 1.111, 255, 255, 255, 0.2);
  }
}
