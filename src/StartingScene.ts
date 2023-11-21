import Scene from './Scene.js';
import KeyListener from './KeyListener.js';
import MouseListener from './MouseListener.js';
import Launch from './Launch.js';
import CanvasUtil from './CanvasUtil.js';

export default class StartingScene extends Scene {
  private logo: HTMLImageElement;

  private startButton: HTMLImageElement;

  private readyGame: boolean;

  private title: HTMLImageElement;

  public constructor(maxX: number, maxY: number) {
    super(maxX, maxY);
    this.logo = CanvasUtil.loadNewImage('./assets/introSceneBackground.png');
    this.title = CanvasUtil.loadNewImage('./assets/mainTitle.png');
    this.startButton = CanvasUtil.loadNewImage('./assets/startButton.png');
    this.readyGame = false;
  }

  /**
   *
   * @param keyListener
   * @param mouseListener
   * @param keyListener
   * @param mouseListener
   */
  public processInput(keyListener: KeyListener, mouseListener: MouseListener): void {
    if(CanvasUtil.mouseHover(window.innerWidth / 1.5, window.innerHeight / 2, this.startButton.width / 10, this.startButton.height / 10, mouseListener.getMousePosition().x, mouseListener.getMousePosition().y)) {
      this.startButton = CanvasUtil.loadNewImage('./assets/startButtonHover.png');
      if (mouseListener.buttonPressed(0)) {
        this.readyGame = true;
      }
    } else {
      this.startButton = CanvasUtil.loadNewImage('assets/startButton.png');
    }
  }

  // eslint-disable-next-line jsdoc/require-returns
  /**
   *
   * @param elapsed
   */
  public update(elapsed: number): Scene {
    if (this.readyGame === true) {
      return new Launch(window.innerWidth, window.innerHeight);
    } return null;
  }

  /**
   *
   * @param canvas
   */
  public render(canvas: HTMLCanvasElement): void {
    CanvasUtil.drawImage(canvas, this.logo, 0, 0, canvas.width, canvas.height, 0);
    // eslint-disable-next-line max-len
    CanvasUtil.drawImage(canvas, this.title, canvas.width / 2, canvas.height / 23, this.title.width / 2.2, this.title.height / 2.2, 0);
    // eslint-disable-next-line max-len
    CanvasUtil.drawImage(canvas, this.startButton, canvas.width / 1.5, canvas.height / 2, this.startButton.width / 10, this.startButton.height / 10, 0);
    CanvasUtil.writeTextToCanvas(canvas, 'Made by: Erik van den Broek', canvas.width / 1.4, canvas.height / 1.6, 'center', 'arial', 15, 'gray');
  }
}
