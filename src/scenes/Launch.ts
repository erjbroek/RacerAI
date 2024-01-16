import KeyListener from '../utilities/KeyListener.js';
import MouseListener from '../ui/MouseListener.js';
import Player from '../drawables/Player.js';
import Scene from './Scene.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import HandleBackground from '../ui/HandleBackground.js';
import Finished from './Finished.js';
import HandleScore from '../ui/handleScore.js';

export default class Launch extends Scene {
  private launchAngle: number;

  private handleBackground: HandleBackground = new HandleBackground();

  private handleScore: HandleScore = new HandleScore();

  private player: Player = new Player();

  private xSpeed: number;

  private ySpeed: number;

  private finishFlight: boolean = false;

  private endScreen: Finished = new Finished();

  private gravity: number = 0.19;

  public constructor(maxX: number, maxY: number, launchAngle: number, launchPower: number) {
    super(maxX, maxY);
    this.launchAngle = launchAngle;
    this.player.angle = this.launchAngle;
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
    if (!this.player.touchedGround) {
      if (this.player.energy > 0) {
        if (keyListener.isKeyDown('KeyA')) {
          this.ySpeed -= 0.24 * (this.xSpeed / 9);
          this.xSpeed += this.ySpeed > 0 ? 0.13 : -0.21;
          this.player.energy -= 1;
        } else if (keyListener.isKeyDown('KeyD')) {
          this.ySpeed += 0.05 * (this.xSpeed / 9);
          this.xSpeed -= this.ySpeed > 0 ? 0.13 : -0.07;
          this.player.energy -= 1;
        }
      }
    }
  }

  /**
   * updates scene
   *
   * @param elapsed is the elapsed time since each frame
   * @returns Scene
   */
  public update(elapsed: number): Scene {
    this.applyGravity();
    this.handleBackground.moveBackground(this.player, this.xSpeed, this.ySpeed);
    this.handleScore.calculateDistances(
      this.xSpeed,
      this.ySpeed,
      (window.innerHeight - this.player.posY - this.player.image.height)
      - (window.innerHeight
      - (this.handleBackground.getPosY() + this.handleBackground.getHeight())),
    );
    if (Math.abs(this.xSpeed) + Math.abs(this.ySpeed) <= 0.01) {
      this.finishFlight = true;
    }
    return this;
  }

  /**
   * handles player and gravity
   */
  public applyGravity(): void {
    if (this.handleBackground.isTouchingGround()) {
      this.player.posY = window.innerHeight - this.player.image.height;
      this.ySpeed *= -0.5;
      this.xSpeed *= 0.6;
      this.player.rotationSpeed = this.xSpeed;
      this.player.touchedGround = true;
    } else {
      this.ySpeed += this.gravity;
      if (this.xSpeed <= 8 && this.player.touchedGround) {
        this.player.rotate();
      } else {
        this.player.setAngle(this.xSpeed, this.ySpeed);
      }
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
    this.handleScore.render(canvas);
    this.player.render(canvas);
    this.player.renderPower(canvas);
    if (this.finishFlight) {
      this.endScreen.render(canvas, this.handleScore);
    }
  }
}
