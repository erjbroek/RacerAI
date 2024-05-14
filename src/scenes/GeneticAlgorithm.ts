import KeyListener from '../utilities/KeyListener.js';
import MouseListener from '../utilities/MouseListener.js';
import Scene from './Scene.js';

export default class GeneticAlgorithm extends Scene {
  private track: number[][];

  private radius: number;

  private lineStart: number[];

  private lineEnd: number[];

  public constructor(track: number[][], radius: number, lineStart: number[], lineEnd: number[]) {
    super();
    this.track = track;
    this.radius = radius;
    this.lineStart = lineStart;
    this.lineEnd = lineEnd;
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

  };
}
