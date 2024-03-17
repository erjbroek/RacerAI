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

  private tileSize: number = window.innerWidth / 7.5;

  private tilePosX: number = window.innerWidth / 10 + 30;

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
    CanvasUtil.fillRectangle(canvas, 0, canvas.height / 5, canvas.width, canvas.height, 255, 255, 255, 0.6);
    CanvasUtil.fillRectangle(canvas, canvas.width / 9.5, canvas.height / 3.2, canvas.width / 2.2, canvas.height / 1.57, 200, 200, 200, 0.6);
    CanvasUtil.fillRectangle(canvas, canvas.width / 1.7, canvas.height / 3.2, canvas.width / 3, canvas.height / 1.57, 200, 200, 200, 0.6);

    CanvasUtil.fillRectangle(canvas, this.tilePosX, canvas.height / 3.3 + 30, this.tileSize, this.tileSize, 30, 175, 0, 0.6);
    CanvasUtil.fillRectangle(canvas, this.tilePosX, canvas.height / 1.6 + 30, this.tileSize, this.tileSize, 30, 175, 0, 0.6);
    CanvasUtil.fillRectangle(canvas, this.tilePosX + this.tileSize + 30, canvas.height / 3.3 + 30, this.tileSize, this.tileSize, 30, 175, 0, 0.6);
    CanvasUtil.fillRectangle(canvas, this.tilePosX + this.tileSize + 30, canvas.height / 1.6 + 30, this.tileSize, this.tileSize, 30, 175, 0, 0.6);
    CanvasUtil.fillRectangle(canvas, this.tilePosX + (this.tileSize + 30) * 2, canvas.height / 3.3 + 30, this.tileSize, this.tileSize, 30, 175, 0, 0.6);

    // CanvasUtil.fillRectangle(canvas, canvas.width / 13 + 30, canvas.height / 2.05 + 30, canvas.width / 2.6 - 30, canvas.height / 5 - 30, 0, 200, 80, 0.6);
    // CanvasUtil.fillRectangle(canvas, canvas.width / 13 + 30, canvas.height / 1.46 + 30, canvas.width / 2.6 - 30, canvas.height / 5 - 30, 0, 200, 160, 0.6);

    CanvasUtil.writeTextToCanvas(canvas, `Duck dollars: ${HandleScore.duckDollars} $`, 20, 20, 'left', 'arial', 20, 'black');
  }
}
