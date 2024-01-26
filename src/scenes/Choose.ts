import MouseListener from '../ui/MouseListener.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import KeyListener from '../utilities/KeyListener.js';
import Scene from './Scene.js';

export default class Choose extends Scene {
  private background: HTMLImageElement;

  private upgrade: HTMLImageElement;

  private continue: HTMLImageElement;

  public constructor() {
    super();
  }

  /**
   *@param keyListener is the keylistener used for detecting keyboard inputs
   *@param mouseListener is the mouselistener used for detecting mouse inputs
   */
  public processInput(keyListener: KeyListener, mouseListener: MouseListener): void {

  }

  /**
   * @param elapsed is the elapsed time since last frame
   * @returns the scene it should go to
   */
  public update(elapsed: number): Scene {
    return this;
  }

  /**
   *@param canvas is the selected canvas the items should be rendered to
   */
  public render(canvas: HTMLCanvasElement): void {
    CanvasUtil.fillCanvas(canvas, '#7cc7b9');
  }
}
