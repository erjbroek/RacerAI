import KeyListener from '../utilities/KeyListener.js';
import MouseListener from '../ui/MouseListener.js';

export default abstract class Scene {
  protected maxX: number;

  protected maxY: number;

  public constructor(maxX: number, maxY: number) {
    this.maxX = maxX;
    this.maxY = maxY;
  }

  public abstract processInput(keyListener: KeyListener, mouseListener: MouseListener): void;
  public abstract update(elapsed: number): Scene;
  public abstract render(canvas: HTMLCanvasElement): void;
}
