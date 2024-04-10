import MouseListener from '../utilities/MouseListener.js';
import HandleScore from '../ui/HandleScore.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import KeyListener from '../utilities/KeyListener.js';
import HandleStats from '../ui/HandleStats.js';
import SelectAngle from './SelectAngle.js';
import Shop from './shop/Shop.js';
import Scene from './Scene.js';

export default class Finished {
  private opacity: number = 0.0;

  private totalTime: number = 0;

  private transitionTime: number = 1000;

  private mushroomImage: HTMLImageElement = CanvasUtil.loadNewImage('./assets/mushroom.png');

  private goShop: boolean = false;

  private retry: boolean = false;

  /**
   * @param keyListener is used to check for keyboard inputs
   * @param mouseListener is used to check for mouse movements and inputs
   */
  public processInput(keyListener: KeyListener, mouseListener: MouseListener) {
    if (MouseListener.areaPressed((window.innerWidth / 2 - window.innerWidth / 7.5), window.innerHeight / 1.4, window.innerWidth / 10, window.innerHeight / 20)) {
      console.log("shop")
    }
    if (MouseListener.areaPressed((window.innerWidth / 2 + window.innerWidth / 30), window.innerHeight / 1.4, window.innerWidth / 10, window.innerHeight / 20)) {
      console.log("retry")
    }
  }

  /**
   *@param elapsed is the elapsed time in ms each frame takes
   */
  public update(elapsed: number): Scene {
    if (this.totalTime >= this.transitionTime) {
      this.totalTime = this.transitionTime;
    } else {
      this.totalTime += elapsed;
    }
    this.opacity = (this.totalTime / this.transitionTime);

    if (this.goShop) {
      return new Shop();
    }
    if (this.retry) {
      return new SelectAngle();
    } return null;
  }

  /**
   * Render the scene.
   *
   * @param canvas the selected canvas the items are rendered to
   */
  public endRound(canvas: HTMLCanvasElement): void {
    // Calculate the score
    HandleScore.calculateScore();

    // Fill the background with a semi-transparent color
    CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width, canvas.height, 100, 80, 150, this.opacity * 0.2);

    // Render the main square
    CanvasUtil.fillRectangle(canvas, canvas.width / 12, canvas.height / 14, canvas.width - 2 * (canvas.width / 12), canvas.height - 2 * (canvas.height / 20), 49, 50, 100, this.opacity * 0.1, 20);

    CanvasUtil.fillRectangle(canvas, canvas.width / 10, canvas.height / 10, canvas.width / 4, canvas.height - 2 * (canvas.height / 4), 50, 50, 100, this.opacity * 0.25, 10);
    CanvasUtil.fillRectangle(canvas, canvas.width / 10 + canvas.width / 4 + canvas.width / 41, canvas.height / 10, canvas.width / 4, canvas.height - 2 * (canvas.height / 4), 50, 50, 100, this.opacity * 0.25, 10);
    CanvasUtil.fillRectangle(canvas, canvas.width / 10 + (2 * canvas.width + 8 * (canvas.width / 41)) / 4, canvas.height / 10, canvas.width / 4, canvas.height - 2 * (canvas.height / 4), 50, 50, 100, this.opacity * 0.25, 10);
    CanvasUtil.fillRectangle(canvas, canvas.width / 10, canvas.height / 9 + canvas.height - 2 * (canvas.height / 4), canvas.width - 2 * (canvas.width / 10), canvas.height - 2 * (canvas.height / 2.6), 50, 50, 100, this.opacity * 0.25, 10);

    // Render relevant stats and scores
    CanvasUtil.writeText(canvas, 'Distance flown:', canvas.width / 9, canvas.height / 6, 'left', 'Arial', 25, 'white');
    CanvasUtil.writeText(canvas, 'Max height:', canvas.width / 9, canvas.height / 4.8, 'left', 'Arial', 25, 'white');
    CanvasUtil.writeText(canvas, 'Max speed:', canvas.width / 9, canvas.height / 4, 'left', 'Arial', 25, 'white');
    CanvasUtil.writeText(canvas, 'Duration', canvas.width / 9, canvas.height / 3.45, 'left', 'Arial', 25, 'white');
    CanvasUtil.writeText(canvas, `${HandleScore.distance.toFixed(2)} meters`, canvas.width / 3, canvas.height / 6, 'right', 'Arial', 25, 'white');
    CanvasUtil.writeText(canvas, `${HandleScore.maxHeight.toFixed(2)} meters`, canvas.width / 3, canvas.height / 4.8, 'right', 'Arial', 25, 'white');
    CanvasUtil.writeText(canvas, `${HandleScore.maxSpeed.toFixed(2)} m/s`, canvas.width / 3, canvas.height / 4, 'right', 'Arial', 25, 'white');
    CanvasUtil.writeText(canvas, `${HandleScore.fTime}`, canvas.width / 3, canvas.height / 3.45, 'right', 'Arial', 25, 'white');

    CanvasUtil.writeText(canvas, 'Bronze coins:', canvas.width / 2.6, canvas.height / 6, 'left', 'Arial', 25, 'white');
    CanvasUtil.writeText(canvas, 'Silver coins:', canvas.width / 2.6, canvas.height / 4.8, 'left', 'Arial', 25, 'white');
    CanvasUtil.writeText(canvas, 'Gold coins:', canvas.width / 2.6, canvas.height / 4, 'left', 'Arial', 25, 'white');
    CanvasUtil.writeText(canvas, 'Coin multiplier:', canvas.width / 2.6, canvas.height / 2.1, 'left', 'Arial', 25, 'white');
    CanvasUtil.writeText(canvas, `${HandleScore.bronzeCoins}`, canvas.width / 1.65, canvas.height / 6, 'right', 'Arial', 25, 'white');
    CanvasUtil.writeText(canvas, `${HandleScore.silverCoins}`, canvas.width / 1.65, canvas.height / 4.8, 'right', 'Arial', 25, 'white');
    CanvasUtil.writeText(canvas, `${HandleScore.goldCoins}`, canvas.width / 1.65, canvas.height / 4, 'right', 'Arial', 25, 'white');
    CanvasUtil.writeText(canvas, `x ${HandleStats.coinMult}`, canvas.width / 1.65, canvas.height / 2.1, 'right', 'Arial', 25, 'white');
    CanvasUtil.fillRectangle(canvas, canvas.width / 2.6, canvas.height / 2, canvas.width / 4.5, canvas.height / 600, 20, 20, 30, this.opacity * 0.2);
    CanvasUtil.writeText(canvas, 'Total coins earned:', canvas.width / 2.6, canvas.height / 1.8, 'left', 'Arial', 25, 'white');
    CanvasUtil.writeText(canvas, `${HandleScore.totalCoins}`, canvas.width / 1.65, canvas.height / 1.8, 'right', 'Arial', 25, 'white');

    CanvasUtil.drawImage(canvas, this.mushroomImage, canvas.width / 1.5, canvas.height / 6 - canvas.height / 40, canvas.width / 40, canvas.height / 23);
    CanvasUtil.writeText(canvas, 'Amount hit', canvas.width / 1.45, canvas.height / 6, 'left', 'Arial', 25, 'white');
    CanvasUtil.writeText(canvas, `${HandleScore.hitMushroom}`, canvas.width / 1.135, canvas.height / 6, 'right', 'Arial', 25, 'white');

    CanvasUtil.writeText(canvas, `Total Score: ${HandleScore.score.toFixed(1)}`, canvas.width / 2, canvas.height / 1.5, 'center', 'Arial', 40, 'white');
    CanvasUtil.fillRectangle(canvas, (canvas.width / 2 + canvas.width / 30), canvas.height / 1.4, canvas.width / 10, canvas.height / 20, 255, 255, 255, this.opacity * 0.3, 20);
    CanvasUtil.fillRectangle(canvas, (canvas.width / 2 - canvas.width / 30) - canvas.width / 10, canvas.height / 1.4, canvas.width / 10, canvas.height / 20, 255, 255, 255, this.opacity * 0.3, 20);
    CanvasUtil.fillRectangle(canvas, (canvas.width / 2 - canvas.width / 7.5), canvas.height / 1.4, canvas.width / 10, canvas.height / 20, 255, 255, 255, this.opacity * 0.3, 20);
    CanvasUtil.writeText(canvas, 'Retry', canvas.width / 2 + canvas.width / 12, canvas.height / 1.337, 'center', 'arial', 25, 'white');
    CanvasUtil.writeText(canvas, 'Shop', canvas.width / 2 - canvas.width / 12, canvas.height / 1.337, 'center', 'arial', 25, 'white');

    // CanvasUtil.drawRectangle(canvas, canvas.width / 2, 0, canvas.width / 500, canvas.height, 255, 0, 0, 1);
  }
}
