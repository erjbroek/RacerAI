import KeyListener from '../utilities/KeyListener.js';
import MouseListener from '../ui/MouseListener.js';
import Player from '../drawables/Player.js';
import Scene from './Scene.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import HandleBackground from '../ui/handleBackground.js';
import Finished from './Finished.js';

export default class Launch extends Scene {
  private launchAngle: number;

  private handleBackground: HandleBackground;

  private player: Player;

  private xSpeed: number;

  private ySpeed: number;

  private distance: number = 0;

  private maxHeight: number = 0;

  private finishFlight: boolean = false;

  private endScreen: Finished = new Finished(window.innerWidth, window.innerHeight);

  private gravity: number = 0.05;

  public constructor(maxX: number, maxY: number, launchAngle: number, launchPower: number) {
    super(maxX, maxY);
    this.player = new Player();
    this.handleBackground = new HandleBackground();
    this.launchAngle = launchAngle;
    this.xSpeed = (launchPower / 10) * Math.cos((launchAngle * Math.PI) / 180);
    this.ySpeed = (launchPower / 10) * Math.sin((launchAngle * Math.PI) / 180);
  }

  /**
   * handles inputs
   *
   * @param keyListener the keylistener used
   * @param mouseListener the mouselistener used
   */
  public processInput(keyListener: KeyListener, mouseListener: MouseListener): void {

  }

  /**
   * updates scene
   *
   * @param elapsed is the elapsed time since each frame
   * @returns Scene
   */
  public update(elapsed: number): Scene {
    this.applyGravity();
    this.distance += (this.xSpeed / 100);
    this.handleBackground.moveBackground(this.player, this.xSpeed, this.ySpeed);
    this.player.angle = this.launchAngle;
    if (this.xSpeed <= 0.01) {
      this.finishFlight = true;
    }
    return this;
  }

  /**
   * handles player and gravity
   */
  public applyGravity(): void {
    if (this.handleBackground.getTouchingGround()) {
      this.player.posY = window.innerHeight - this.player.image.height;
      this.ySpeed *= -0.5;
      this.xSpeed *= 0.6;
      this.handleBackground.touchGround();
    } else {
      this.ySpeed += this.gravity;
    }
  }

  /**
   * renders elements on the screen
   *
   * @param canvas the canvas items are rendered on
   */
  public render(canvas: HTMLCanvasElement): void {
    CanvasUtil.fillCanvas(canvas, 'Black');
    this.handleBackground.render(canvas);
    this.player.render(canvas);
    CanvasUtil.writeTextToCanvas(canvas, `distance: ${Math.round(this.distance * 10) / 10}m`, 100, 100, 'center', 'arial', 20, 'black');
    if (this.finishFlight) {
      this.endScreen.render(canvas);
    }
  }
}
