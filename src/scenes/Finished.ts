import MouseListener from '../ui/MouseListener.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import KeyListener from '../utilities/KeyListener.js';
import Scene from './Scene.js';

export default class Finished {
  /**
   * @param keyListener is used to check for keyboard inputs
   * @param mouseListener is used to check for mouse movements and inputs
   */
  public processInput(keyListener: KeyListener, mouseListener: MouseListener): void {

  }

  /**
   * Update the scene based on the elapsed time.
   * @param elapsed - The elapsed time in milliseconds.
   * @returns The updated scene.
   */
  public update(elapsed: number) {
    return this;
  }

  /**
   * Render the scene.
   *
   * @param canvas the selected canvas the items are rendered to
   */
  public render(canvas: HTMLCanvasElement): void {
    CanvasUtil.fillRectangle(canvas, window.innerWidth / 3, window.innerHeight / 3, window.innerWidth / 3, window.innerHeight / 3, 'black');
  }
}
