import Scene from './Scene.js';
import KeyListener from './KeyListener.js';
import MouseListener from './MouseListener.js';
import StartingScene from './StartingScene.js';
import CanvasUtil from './CanvasUtil.js';
import Player from './Player.js';
import Obstacle from './Obstacle.js';
import SelectPower from './SelectPower.js';

export default class SelectAngle extends Scene {
  private player: Player;

  private angleReady: boolean;

  private launchAngle: number;

  private totalTime: number;

  private rotationSpeed: number;

  public constructor(maxX: number, maxY: number) {
    super(maxX, maxY);
    this.maxX = window.innerWidth;
    this.maxY = window.innerHeight;
    this.angleReady = false;
    this.launchAngle = -70;
    this.totalTime = 0;
    this.rotationSpeed = 0;
    this.player = new Player();
  }

  /**
   *
   * @param keyListener
   * @param mouseListener
   * @param keyListener
   * @param mouseListener
   */
  public processInput(keyListener: KeyListener, mouseListener: MouseListener): void {
    if (keyListener.keyPressed('Space')) {
      this.angleReady = true;
    }
  }

  /**
   * @returns scene
   * @param elapsed
   */
  public update(elapsed: number): Scene {
    this.totalTime += elapsed;
    if (!this.angleReady) {
      if (this.totalTime < 1500) {
        this.rotationSpeed += 0.01; // Rotate down
      } else if (this.totalTime >= 1500 && this.totalTime < 4500) {
        this.rotationSpeed -= 0.01; // Rotate up
      } else if (this.totalTime >= 4500 && this.totalTime < 6000) {
        this.rotationSpeed += 0.01;
      } else {
        this.rotationSpeed = 0;
        this.totalTime = 0;
        this.launchAngle = -70;
      }

      this.launchAngle += this.rotationSpeed;
      this.player.setAngle(this.launchAngle);
    }

    if (this.angleReady) {
      return new SelectPower(this.launchAngle, this.maxX, this.maxY);
    } return null;
  }

  // // eslint-disable-next-line @typescript-eslint/no-dupe-class-members
  // public setAngle(objectX: number, objectY: number, mouseListener: MouseListener): number {
  //   const mouseX = mouseListener.getMousePosition().x;
  //   const mouseY = mouseListener.getMousePosition().y;
  //   let angle = (-1 * (Math.atan2(objectY - mouseY, mouseX - objectX) * (180 / Math.PI))) - 10;
  //   return angle;
  // }

  /**
   *
   * @param canvas
   */
  public render(canvas: HTMLCanvasElement): void {
    this.player.render(canvas);
    CanvasUtil.drawCircle(canvas, 0, canvas.height, canvas.height / 5, 'lightgreen');
    const lineLength = 200;
    const lineEndX = this.player.getPosX() + lineLength * Math.cos((this.launchAngle * Math.PI) / 180);
    const lineEndY = this.player.getPosY() + lineLength * Math.sin((this.launchAngle * Math.PI) / 180);
    CanvasUtil.drawLine(
      canvas,
      this.player.getPosX() + this.player.getWidth() / 2 + 5,
      this.player.getPosY() + this.player.getHeight() / 2,
      lineEndX,
      lineEndY,
      'lightgreen',
    );
  }
}
