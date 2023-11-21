import Scene from './Scene.js';
import KeyListener from './KeyListener.js';
import MouseListener from './MouseListener.js';
import StartingScene from './StartingScene.js';
import CanvasUtil from './CanvasUtil.js';
import Player from './Player.js';
import Obstacle from './Obstacle.js';

export default class Launch extends Scene {
  private player: Player;

  private obstacles: Obstacle[];

  private distance: number;

  private angleReady: boolean;

  private launchAngle: number;

  private powerReady: boolean;

  private launchPower: number;

  private mouselistener: MouseListener;

  private totalTime: number;

  private rotationSpeed: number;

  public constructor(maxX: number, maxY: number) {
    super(maxX, maxY);
    this.maxX = window.innerWidth;
    this.maxY = window.innerHeight;
    this.angleReady = false;
    this.powerReady = false;
    this.launchAngle = -90;
    this.launchPower = 0;
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
    // this.player.setAngle(this.setAngle(this.player.getPosX(), this.player.getPosY(), mouseListener));
  }

  /**
   *
   * @param elapsed
   */
  public update(elapsed: number): Scene {
    this.totalTime += elapsed;

    if (this.totalTime < 1500) {
      this.rotationSpeed += 0.01; // Rotate down
    } else if (this.totalTime >= 1500 && this.totalTime < 4500) {
      this.rotationSpeed -= 0.01; // Rotate up
    } else if (this.totalTime >= 4500 && this.totalTime < 6000) {
      this.rotationSpeed += 0.01;
    } else {
      this.rotationSpeed = 0;
      this.totalTime = 0;
      this.launchAngle = -90;
    }

    this.launchAngle += this.rotationSpeed;
    console.log(this.launchAngle);
    this.player.setAngle(this.launchAngle);

    if (this.angleReady) {
      return new StartingScene(window.innerWidth, window.innerHeight);
    }

    return null;
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
  }
}
