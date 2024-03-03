import HandleScore from '../ui/handleScore.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import KeyListener from '../utilities/KeyListener.js';
import MouseListener from '../utilities/MouseListener.js';
import Choose from './Choose.js';
import Scene from './Scene.js';
import SelectAngle from './SelectAngle.js';

export default class Shop extends Scene {

  private backgroundImage: HTMLImageElement = CanvasUtil.loadNewImage('/assets/introSceneBackground.png');

  private back: boolean = false;

  public constructor() {
    super();
  }

  /**
   * processes the keyboard and mouse inputs from the player
   *
   * @param keyListener processes inputs from keyboard, like buttons pressed
   * @param mouseListener processes inputs from mouse, like movements and button presses
   */
  public processInput(keyListener: KeyListener, mouseListener: MouseListener): void {
    if (keyListener.keyPressed('Space')) {
      this.back = true;
    }
  }

  /**
   * @param elapsed is the elapsed time that passes each frame
   * @returns Scene
   */
  public update(elapsed: number): Scene {
    if (this.back) {
      return new Choose();
    } return null;
  }

  public render(canvas: HTMLCanvasElement): void {
    CanvasUtil.drawImage(canvas, this.backgroundImage, 0, 0, canvas.width, canvas.height, 0);
    CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width / 10, canvas.height / 10, 'lightlue');
    CanvasUtil.writeTextToCanvas(canvas, `Duck dollars: ${HandleScore.duckDollars} $`, 20, 20, 'left', 'arial', 20, 'white');
  }
}
