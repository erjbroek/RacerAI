import KeyListener from './KeyListener.js';
import MouseListener from './MouseListener.js';

export default abstract class Scene {
  protected maxX: number;

  protected maxY: number;

  public constructor(maxX: number, maxY: number) {
    this.maxX = maxX;
    this.maxY = maxY;
  }

  public abstract processInput(keyListener: KeyListener, mouseListener: MouseListener): void;
  public abstract update(elapsed: number): Scene;
  // public collidesWith(object1: HTMLImageElement, object2: HTMLImageElement): boolean
  public abstract render(canvas: HTMLCanvasElement): void;
}
