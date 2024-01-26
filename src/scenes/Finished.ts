import MouseListener from '../ui/MouseListener.js';
import HandleScore from '../ui/handleScore.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import KeyListener from '../utilities/KeyListener.js';
import Scene from './Scene.js';

export default class Finished {

  private scoreHolder: HTMLImageElement = CanvasUtil.loadNewImage('./assets/scoreDisplay.png');

  /**
   * @param keyListener is used to check for keyboard inputs
   * @param mouseListener is used to check for mouse movements and inputs
   */
  public processInput(keyListener: KeyListener, mouseListener: MouseListener): void {

  }

  /**
   * Update the scene based on the elapsed time.
   *
   * @returns The updated scene.
   */
  public update() {
    return this;
  }

  /**
   * Render the scene.
   *
   * @param canvas the selected canvas the items are rendered to
   * @param HandleScore handles everything that has to do with the stats/ score
   */
  public render(canvas: HTMLCanvasElement): void {
    HandleScore.calculateScore();
    CanvasUtil.drawImage(canvas, this.scoreHolder, window.innerWidth / 3, window.innerHeight / 3);
    CanvasUtil.writeTextToCanvas(canvas, `Distance: ${(Math.round(HandleScore.distance * 10) / 10).toString()} meter`, window.innerWidth / 2.6, window.innerHeight / 2.3, 'left', 'arial', 20, 'black');
    CanvasUtil.writeTextToCanvas(canvas, `Max height: ${(Math.round(HandleScore.maxHeight * 10) / 10).toString()} meter`, window.innerWidth / 2.6, window.innerHeight / 2.1, 'left', 'arial', 20, 'black');
    CanvasUtil.writeTextToCanvas(canvas, `Final score: ${(Math.round(HandleScore.score * 10) / 10).toString()}`, window.innerWidth / 2.6, window.innerHeight / 1.6, 'left', 'arial', 20, 'black');
    CanvasUtil.writeTextToCanvas(canvas, `Coins: ${(HandleScore.totalCoins).toString()}`, window.innerWidth / 1.7, window.innerHeight / 2.3, 'left', 'arial', 20, 'black');
    CanvasUtil.writeTextToCanvas(canvas, `Bronze Coins: ${(HandleScore.bronzeCoins).toString()}`, window.innerWidth / 1.7, window.innerHeight / 2.1, 'left', 'arial', 15, 'black');
    CanvasUtil.writeTextToCanvas(canvas, `Silver Coins: ${(HandleScore.silverCoins).toString()}`, window.innerWidth / 1.7, window.innerHeight / 1.95, 'left', 'arial', 15, 'black');
    CanvasUtil.writeTextToCanvas(canvas, `Gold Coins: ${(HandleScore.goldCoins).toString()}`, window.innerWidth / 1.7, window.innerHeight / 1.83, 'left', 'arial', 15, 'black');
  }
}
