import KeyListener from '../utilities/KeyListener.js';
import MouseListener from '../ui/MouseListener.js';

export default abstract class Scene {


  public abstract processInput(keyListener: KeyListener, mouseListener: MouseListener): void;
  public abstract update(elapsed: number): Scene;
  public abstract render(canvas: HTMLCanvasElement): void;
}
