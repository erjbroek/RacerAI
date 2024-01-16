import MouseListener from '../ui/MouseListener.js';
import HandleScore from '../ui/handleScore.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import KeyListener from '../utilities/KeyListener.js';
import Scene from './Scene.js';

export default class Finished {
  private scoreHandler: HandleScore;

  private scoreHolder: HTMLImageElement = CanvasUtil.loadNewImage('./assets/scoreDisplay.png');

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
   * @param scoreHandler handles everything that has to do with the stats/ score
   */
  public render(canvas: HTMLCanvasElement, scoreHandler: HandleScore): void {
    scoreHandler.calculateScore();
    CanvasUtil.drawImage(canvas, this.scoreHolder, window.innerWidth / 3, window.innerHeight / 3);
    CanvasUtil.writeTextToCanvas(canvas, `Distance: ${(Math.round(scoreHandler.distance * 10) / 10).toString()} meters`, window.innerWidth / 2.6, window.innerHeight / 2.3, 'left', 'arial', 20, 'black');
    CanvasUtil.writeTextToCanvas(canvas, `Maximum height: ${(Math.round(scoreHandler.maxHeight * 10) / 10).toString()} meters`, window.innerWidth / 2.6, window.innerHeight / 2.1, 'left', 'arial', 20, 'black');
    CanvasUtil.writeTextToCanvas(canvas, `Final score: ${(Math.round(scoreHandler.score * 10) / 10).toString()}`, window.innerWidth / 2.6, window.innerHeight / 1.6, 'left', 'arial', 20, 'black');
  }
}
