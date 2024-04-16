import { Game } from './GameLoop.js';
import CanvasUtil from './CanvasUtil.js';
import KeyListener from './KeyListener.js';
import Scene from '../scenes/Scene.js';
import MouseListener from './MouseListener.js';
import Cookies from '../ui/Cookies.js';
import StartingScene from '../scenes/StartingScene.js';
import Shop from '../scenes/shop/Shop.js';
import Save from '../scenes/Save.js';
import HandleScore from '../ui/HandleScore.js';
import SelectAngle from '../scenes/SelectAngle.js';
import Finished from '../scenes/Finished.js';
import Launch from '../scenes/Launch.js';
import Menu from '../drawables/Menu.js';

export default class Ducker extends Game {
  private canvas: HTMLCanvasElement;

  private keyListener: KeyListener;

  private mouseListener: MouseListener;

  private currentScene: Scene;

  private timer: number = 1000;

  private cookieFound: boolean = false;

  private cookieNotFound: boolean = false;

  private renderFound: boolean = false;

  private renderNotFound: boolean = false;

  private logo: HTMLImageElement = CanvasUtil.loadNewImage('./assets/introSceneBackground.png');

  public constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
    this.keyListener = new KeyListener();
    this.mouseListener = new MouseListener(canvas);

    let count = 0;
    let found: number = 0;
    for (let i = 1; i <= 3; i++) {
      if (Cookies.checkCookieForSlot(i)) {
        count += 1;
        found = i;
      }
    }
    console.log(count);
    console.log(found);
    if (count === 1) {
      this.cookieFound = true;
      Cookies.loadStatsFromCookieSlot(found);
      this.currentScene = new StartingScene();
    } else if (count === 0) {
      this.cookieNotFound = true;
      this.currentScene = new Save();
    } else {
      this.cookieFound = true;
      this.currentScene = new Save();
    }
  }

  /**
   * Process all input. Called from the GameLoop.
   */
  public processInput(): void {
    this.currentScene.processInput(this.keyListener, this.mouseListener);
  }

  /**
   * Update game state. Called from the GameLoop
   *
   * @param elapsed time elapsed from the GameLoop
   * @returns true if the game should continue
   */
  public update(elapsed: number): boolean {
    if (this.cookieFound) {
      if (this.timer >= 0) {
        this.timer -= elapsed;
        this.renderFound = true;
      } else {
        this.renderFound = false;
      }
    }
    if (this.cookieNotFound) {
      if (this.timer >= 0) {
        this.timer -= elapsed;
        this.renderNotFound = true;
      } else {
        this.renderNotFound = false;
      }
    }

    HandleScore.calculatePlayTime(elapsed);
    const nextScene = this.currentScene.update(elapsed);

    if (nextScene !== null) this.currentScene = nextScene;
    return true;
  }

  /**
   * Render all the elements in the screen. Called from GameLoop
   */
  public render(): void {
    CanvasUtil.clearCanvas(this.canvas);
    this.currentScene.render(this.canvas);
    if (this.renderFound) {
      CanvasUtil.drawImage(this.canvas, this.logo, 0, 0, this.canvas.width, this.canvas.height);
      CanvasUtil.fillRectangle(this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, 0, 0.2, 0);
      CanvasUtil.fillRectangle(this.canvas, this.canvas.width / 3, this.canvas.height / 3, this.canvas.width / 3, this.canvas.height / 3, 30, 200, 120, 0.6, 40);
      CanvasUtil.drawRectangle(this.canvas, this.canvas.width / 3 - 10, this.canvas.height / 3 - 10, this.canvas.width / 3 + 20, this.canvas.height / 3 + 20, 0, 0, 0, 1, 10, 50);
      CanvasUtil.writeText(this.canvas, 'save data found', this.canvas.width / 2, this.canvas.height / 2, 'center', 'arial', 35, 'white');
    }
    if (this.renderNotFound) {
      CanvasUtil.drawImage(this.canvas, this.logo, 0, 0, this.canvas.width, this.canvas.height);
      CanvasUtil.fillRectangle(this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, 0, 0.2, 0);
      CanvasUtil.fillRectangle(this.canvas, this.canvas.width / 3, this.canvas.height / 3, this.canvas.width / 3, this.canvas.height / 3, 200, 100, 120, 0.6, 40);
      CanvasUtil.drawRectangle(this.canvas, this.canvas.width / 3 - 10, this.canvas.height / 3 - 10, this.canvas.width / 3 + 20, this.canvas.height / 3 + 20, 0, 0, 0, 1, 10, 50);
      CanvasUtil.writeText(this.canvas, 'No save data found', this.canvas.width / 2, this.canvas.height / 2, 'center', 'arial', 35, 'white');
    }
  }
}
