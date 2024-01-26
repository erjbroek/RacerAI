import MouseListener from '../ui/MouseListener.js';
import HandleScore from '../ui/handleScore.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import KeyListener from '../utilities/KeyListener.js';
import Scene from './Scene.js';
import SelectAngle from './SelectAngle.js';

export default class Choose extends Scene {
  private logo: HTMLImageElement;

  private upgrade: HTMLImageElement;

  private continue: HTMLImageElement;

  private goUpgrade: boolean = false;

  private startRound: boolean = false;

  public constructor() {
    super();
    this.logo = CanvasUtil.loadNewImage('./assets/mainTitle.png');
  }

  /**
   *@param keyListener is the keylistener used for detecting keyboard inputs
   *@param mouseListener is the mouselistener used for detecting mouse inputs
   */
  public processInput(keyListener: KeyListener, mouseListener: MouseListener): void {
    if (keyListener.isKeyDown('Escape')) {
      HandleScore.resetRound();
      this.startRound = true;
    }
  }

  /**
   * @param elapsed is the elapsed time since last frame
   * @returns the scene it should go to
   */
  public update(elapsed: number): Scene {
    if (this.startRound) {
      return new SelectAngle();
    }
    return this;
  }

  /**
   *@param canvas is the selected canvas the items should be rendered to
   */
  public render(canvas: HTMLCanvasElement): void {
    CanvasUtil.fillCanvas(canvas, '#7cc7b9');
    CanvasUtil.drawImage(canvas, this.logo, window.innerWidth / 3.3, 0 + window.innerHeight / 20, window.innerWidth / 2.8, window.innerHeight / 2.8);
    CanvasUtil.fillRectangle(canvas, window.innerWidth / 3.5, window.innerHeight / 2, window.innerWidth / 7, window.innerHeight / 10, 'black');
    CanvasUtil.fillRectangle(canvas, window.innerWidth / 1.9, window.innerHeight / 2, window.innerWidth / 7, window.innerHeight / 10, 'black');
    CanvasUtil.writeTextToCanvas(canvas, `Duck dollars: ${HandleScore.duckDollars}`, window.innerWidth / 1.8, window.innerHeight / 2 + window.innerHeight / 8, 'left', 'arial', 20, 'black')
  }
}
