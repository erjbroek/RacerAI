import KeyListener from './KeyListener.js';
import MouseListener from './MouseListener.js';
import Player from './Player.js';
import Scene from './Scene.js';
import Background from './Background.js';
import BackgroundItems from './BackgroundItems.js';
import CanvasUtil from './CanvasUtil.js';

export default class Launch extends Scene {
  private launchAngle: number;

  private backgrounds: BackgroundItems[];

  private space: HTMLImageElement;

  private player: Player;

  private xSpeed: number;

  private ySpeed: number;

  private gravity: number;

  private touchingGround: boolean;

  public constructor(maxX: number, maxY: number, launchAngle: number, launchPower: number) {
    super(maxX, maxY);
    this.player = new Player();
    this.backgrounds = [];
    this.backgrounds.push(new Background(0, window.innerHeight - 302 * 4, './assets/background.png'));
    this.space = CanvasUtil.loadNewImage('./assets/space.png');
    this.launchAngle = launchAngle;
    this.gravity = 0.05;
    this.touchingGround = false;
    this.xSpeed = (launchPower / 10) * Math.cos((launchAngle * Math.PI) / 180);
    this.ySpeed = (launchPower / 10) * Math.sin((launchAngle * Math.PI) / 180);
  }

  /**
   * handles inputs
   * @param keyListener
   * @param mouseListener
   */
  public processInput(keyListener: KeyListener, mouseListener: MouseListener): void {

  }

  /**
   * updates scene
   * @param elapsed is the elapsed time since each frame
   * @returns Scene
   */
  public update(elapsed: number): Scene {
    this.applyGravity();
    this.handleBackground();
    this.player.angle = this.launchAngle;
    return null;
  }

  /**
   *  moves the background and checks if player hits the ground
   */
  public handleBackground() {
    if (this.player.posY >= window.innerHeight / 2 || this.backgrounds[0].getPosY() + this.backgrounds[0].getHeight() < window.innerHeight) {
      this.backgrounds.forEach((background) => {
        background.move(this.xSpeed, 0);
      });
      this.player.move(this.ySpeed);
    } else {
      this.backgrounds.forEach((background) => {
        background.move(this.xSpeed, this.ySpeed);
      });
    }
    if (this.backgrounds.length < 2) {
      if (this.backgrounds[0].getPosX() + this.backgrounds[0].getWidth() <= window.innerWidth) {
        this.backgrounds.push(new Background(this.backgrounds[0].getPosX() + this.backgrounds[0].getWidth(), this.backgrounds[0].getPosY(), ''));
      }
    }
    if (this.backgrounds[0].getPosX() + this.backgrounds[0].getWidth() <= 0) {
      this.backgrounds.splice(0, 1);
    }
    if (this.player.posY + this.player.image.height > window.innerHeight) {
      this.touchingGround = true;
    } else {
      this.touchingGround = false;
    }
  }

  /**
   * handles player and gravity
   */
  public applyGravity(): void {
    if (this.touchingGround) {
      this.player.posY = window.innerHeight - this.player.image.height;
      this.ySpeed *= -0.5;
      this.xSpeed *= 0.6;
      this.backgrounds.forEach((background) => {
        background.setPosY(window.innerHeight - this.backgrounds[0].getHeight());
      });
    } else {
      this.ySpeed += this.gravity;
    }
  }

  /**
   * renders elements on the screen
   * @param canvas the canvas items are rendered on
   */
  public render(canvas: HTMLCanvasElement): void {
    CanvasUtil.fillCanvas(canvas, 'Black');
    this.backgrounds.forEach((item) => {
      item.render(canvas);
    });
    CanvasUtil.drawImage(canvas, this.space, 0, this.backgrounds[0].getPosY() - window.innerHeight * 5, window.innerWidth, window.innerHeight * 5, 0)
    this.player.render(canvas);
  }
}
