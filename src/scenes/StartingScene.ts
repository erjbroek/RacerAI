import Scene from './Scene.js';
import KeyListener from '../utilities/KeyListener.js';
import MouseListener from '../utilities/MouseListener.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import SelectAngle from './SelectAngle.js';
import StartButton from '../background items/StartButton.js';

export default class StartingScene extends Scene {
  private logo: HTMLImageElement;

  private startButton: StartButton;

  private title: HTMLImageElement;

  public constructor() {
    super();
    this.logo = CanvasUtil.loadNewImage('./assets/introSceneBackground.png');
    this.title = CanvasUtil.loadNewImage('./assets/mainTitle.png');
    this.startButton = new StartButton();
  }

  /**
   *  processes player input
   *
   * @param keyListener the keylistener used
   * @param mouseListener the mouselistener used
   */
  public processInput(keyListener: KeyListener, mouseListener: MouseListener): void {
    this.startButton.processInput(keyListener, mouseListener);
  }

  /**
   * @returns scene
   */
  public update(): Scene {
    if (this.startButton.getReadyGame()) {
      return new SelectAngle();
    } return null;
  }

  /**
   *
   * @param canvas the selected canvas images are rendered to
   */
  public render(canvas: HTMLCanvasElement): void {
    CanvasUtil.drawImage(canvas, this.logo, 0, 0, canvas.width, canvas.height, 0);
    CanvasUtil.drawImage(
      canvas,
      this.title,
      canvas.width / 2,
      canvas.height / 23,
      this.title.width / 2.2,
      this.title.height / 2.2,
      0,
    );
    this.startButton.render(canvas);
    CanvasUtil.writeTextToCanvas(canvas, 'Made by: Erik van den Broek', canvas.width / 1.4, canvas.height / 1.6, 'center', 'arial', 15, 'gray');
  }
}
