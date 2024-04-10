import MouseListener from '../utilities/MouseListener.js';
import HandleScore from '../ui/HandleScore.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import KeyListener from '../utilities/KeyListener.js';
import HandleStats from '../ui/HandleStats.js';

export default class Finished {
  private opacity: number = 0.0;

  private totalTime: number = 0;

  private transitionTime: number = 1000;

  /**
   * @param keyListener is used to check for keyboard inputs
   * @param mouseListener is used to check for mouse movements and inputs
   * @returns if scene should end
   */
  public processInput(keyListener: KeyListener, mouseListener: MouseListener): boolean {
    if (keyListener.isKeyDown('Space') || keyListener.isKeyDown('Enter') || mouseListener.buttonPressed(0)) {
      return true;
    } return false;
  }

  public update(elapsed: number): void {
    this.totalTime >= this.transitionTime ? this.totalTime = this.transitionTime : this.totalTime += elapsed;
    this.opacity = (this.totalTime / this.transitionTime);
  }

  /**
   * Render the scene.
   *
   * @param canvas the selected canvas the items are rendered to
   */
  public endRound(canvas: HTMLCanvasElement): void {
    // Calculate the score
    HandleScore.calculateScore();
    console.log(HandleScore.fTime);

    // Fill the background with a semi-transparent color
    CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width, canvas.height, 100, 80, 150, this.opacity * 0.2);

    // Render the main square
    CanvasUtil.fillRectangle(canvas, canvas.width / 12, canvas.height / 14, canvas.width - 2 * (canvas.width / 12), canvas.height - 2 * (canvas.height / 20), 49, 50, 100, this.opacity * 0.1);

    CanvasUtil.fillRectangle(canvas, canvas.width / 10, canvas.height / 10, canvas.width / 4, canvas.height - 2 * (canvas.height / 4), 50, 50, 100, this.opacity * 0.25);
    CanvasUtil.fillRectangle(canvas, canvas.width / 10 + canvas.width / 4 + canvas.width / 41, canvas.height / 10, canvas.width / 4, canvas.height - 2 * (canvas.height / 4), 50, 50, 100, this.opacity * 0.25);
    CanvasUtil.fillRectangle(canvas, canvas.width / 10 + (2 * canvas.width + 8 * (canvas.width / 41)) / 4, canvas.height / 10, canvas.width / 4, canvas.height - 2 * (canvas.height / 4), 50, 50, 100, this.opacity * 0.25);
    CanvasUtil.fillRectangle(canvas, canvas.width / 10, canvas.height / 9 + canvas.height - 2 * (canvas.height / 4), canvas.width - 2 * (canvas.width / 10), canvas.height - 2 * (canvas.height / 2.6), 50, 50, 100, this.opacity * 0.25);

    // Render relevant stats and scores
    CanvasUtil.writeText(canvas, 'Distance flown:', canvas.width / 9, canvas.height / 6, 'left', 'Arial', 25, 'white', this.opacity);
    CanvasUtil.writeText(canvas, 'Max height:', canvas.width / 9, canvas.height / 4.8, 'left', 'Arial', 25, 'white', this.opacity);
    CanvasUtil.writeText(canvas, 'Duration', canvas.width / 9, canvas.height / 4, 'left', 'Arial', 25, 'white', this.opacity);
    CanvasUtil.writeText(canvas, `${HandleScore.distance.toFixed(2)} meters`, canvas.width / 3, canvas.height / 6, 'right', 'Arial', 25, 'white', this.opacity);
    CanvasUtil.writeText(canvas, `${HandleScore.maxHeight.toFixed(2)} meters`, canvas.width / 3, canvas.height / 4.8, 'right', 'Arial', 25, 'white', this.opacity);
    CanvasUtil.writeText(canvas, `${HandleScore.fTime}`, canvas.width / 3, canvas.height / 4, 'right', 'Arial', 30, 'white', this.opacity);

    CanvasUtil.writeText(canvas, 'Bronze coins:', canvas.width / 2.6, canvas.height / 6, 'left', 'Arial', 25, 'white', this.opacity);
    CanvasUtil.writeText(canvas, 'Silver coins:', canvas.width / 2.6, canvas.height / 4.8, 'left', 'Arial', 25, 'white', this.opacity);
    CanvasUtil.writeText(canvas, 'Gold coins:', canvas.width / 2.6, canvas.height / 4, 'left', 'Arial', 25, 'white', this.opacity);
    CanvasUtil.writeText(canvas, 'Coin multiplier:', canvas.width / 2.6, canvas.height / 2.2, 'left', 'Arial', 25, 'white', this.opacity);
    CanvasUtil.writeText(canvas, `${HandleScore.bronzeCoins}`, canvas.width / 1.65, canvas.height / 6, 'right', 'Arial', 30, 'white', this.opacity);
    CanvasUtil.writeText(canvas, `${HandleScore.silverCoins}`, canvas.width / 1.65, canvas.height / 4.8, 'right', 'Arial', 30, 'white', this.opacity);
    CanvasUtil.writeText(canvas, `${HandleScore.goldCoins}`, canvas.width / 1.65, canvas.height / 4, 'right', 'Arial', 30, 'white', this.opacity);
    CanvasUtil.writeText(canvas, `x ${HandleStats.coinMult}`, canvas.width / 1.65, canvas.height / 2.2, 'right', 'Arial', 30, 'white', this.opacity);
    CanvasUtil.fillRectangle(canvas, canvas.width / 2.6, canvas.height / 2, canvas.width / 4.5, canvas.height / 600, 20, 20, 30, this.opacity * 0.2);
    CanvasUtil.writeText(canvas, 'Total coins earned:', canvas.width / 2.6, canvas.height / 1.8, 'left', 'Arial', 30, 'white', this.opacity);
    CanvasUtil.writeText(canvas, `${HandleScore.totalCoins}`, canvas.width / 1.65, canvas.height / 1.8, 'right', 'Arial', 30, 'white', this.opacity);

    // Placeholder for button to go to the shop
    CanvasUtil.fillRectangle(canvas, canvas.width / 4, canvas.height - 100, canvas.width / 4, 50, 255, 255, 255, this.opacity * 0.5);
    CanvasUtil.writeText(canvas, 'Go to Shop', canvas.width / 2.5, canvas.height - 65, 'center', 'Arial', 24, 'black');

    // Placeholder for button to retry the round
    CanvasUtil.fillRectangle(canvas, canvas.width / 2 + canvas.width / 4, canvas.height - 100, canvas.width / 4, 50, 255, 255, 255, this.opacity * 0.5);
    CanvasUtil.writeText(canvas, 'Retry', canvas.width / 1.25, canvas.height - 65, 'center', 'Arial', 24, 'black');
  }

}
