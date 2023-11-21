import KeyListener from './KeyListener.js';
import MouseListener from './MouseListener.js';
import Player from './Player.js';
import Scene from './Scene.js';
import StartingScene from './StartingScene.js';

export default class SelectPower extends Scene {
  private player: Player;

  private totalTime: number;

  private powerReady: number;

  private angle: number;

  public constructor(angle: number, maxX: number, maxY: number) {
    super(maxX, maxY);
    this.totalTime = 0;
    this.player = new Player();
    this.angle = angle;
  }

  /**
   *
   * @param keyListener
   * @param mouseListener
   * @param keyListener
   * @param mouseListener
   */
  public processInput(keyListener: KeyListener, mouseListener: MouseListener): void {

  }

  /**
   * @returns scene
   * @param elapsed
   */
  public update(elapsed: number): Scene {
    this.totalTime += elapsed;
    this.player.setAngle(this.angle);
    console.log(this.angle);

    if (this.powerReady) {
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
  }
}
