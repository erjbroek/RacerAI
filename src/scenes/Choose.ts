import HandleItems from '../ui/HandleItems.js';
import HandleScenery from '../ui/HandleScenery.js';
import HandleScore from '../ui/HandleScore.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import KeyListener from '../utilities/KeyListener.js';
import Scene from './Scene.js';
import SelectAngle from './SelectAngle.js';
import Shop from './shop/Shop.js';

export default class Choose extends Scene {
  private logo: HTMLImageElement;

  private shopImage: HTMLImageElement = CanvasUtil.loadNewImage('./assets/shop.png');

  private continueImage: HTMLImageElement = CanvasUtil.loadNewImage('./assets/startbutton.png');

  private goShop: boolean = false;

  private startRound: boolean = false;

  public constructor() {
    super();
    this.logo = CanvasUtil.loadNewImage('./assets/mainTitle.png');
  }

  /**
   *@param keyListener is the keylistener used for detecting keyboard inputs
   */
  public processInput(keyListener: KeyListener): void {
    if (keyListener.isKeyDown('KeyL')) {
      this.startRound = true;
    } else if (keyListener.isKeyDown('KeyS')) {
      this.goShop = true;
    }
  }

  /**
   * @returns the scene it should go to
   */
  public update(): Scene {
    if (this.startRound) {
      return new SelectAngle();
    }
    if (this.goShop) {
      return new Shop();
    }
    return this;
  }

  /**
   *@param canvas is the selected canvas the items should be rendered to
   */
  public render(canvas: HTMLCanvasElement): void {
    CanvasUtil.fillCanvas(canvas, '#7cc7b9');
    CanvasUtil.drawImage(canvas, this.logo, window.innerWidth / 3.3, 0 + window.innerHeight / 20, window.innerWidth / 2.8, window.innerHeight / 2.8);
    CanvasUtil.drawImage(canvas, this.shopImage, window.innerWidth / 3.5, window.innerHeight / 2, window.innerWidth / 7, window.innerHeight / 10, 0);
    CanvasUtil.drawImage(canvas, this.continueImage, window.innerWidth / 1.9, window.innerHeight / 2, window.innerWidth / 7, window.innerHeight / 10, 0);
    // CanvasUtil.fillRectangle(canvas, window.innerWidth / 3.5, window.innerHeight / 2, window.innerWidth / 7, window.innerHeight / 10, 0, 0, 0);
    // CanvasUtil.fillRectangle(canvas, window.innerWidth / 1.9, window.innerHeight / 2, window.innerWidth / 7, window.innerHeight / 10, 0, 0, 0);
    CanvasUtil.writeText(canvas, `Duck dollars: ${HandleScore.duckDollars}`, window.innerWidth / 1.8, window.innerHeight / 2 + window.innerHeight / 8, 'left', 'arial', 20, 'black');
  }
}
