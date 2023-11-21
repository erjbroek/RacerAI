import Scene from './Scene.js';
import KeyListener from './KeyListener.js';
import MouseListener from './MouseListener.js';
import CanvasUtil from './CanvasUtil.js';
import Player from './Player.js';

export default class SelectAngle extends Scene {
  private player: Player;

  private angleReady: boolean = false;

  private launchAngle: number = -70;

  private rotationSpeed: number = 0;

  private launchPower: number = 0;

  private launchSpeed: number = 0;

  public constructor(maxX: number, maxY: number) {
    super(window.innerWidth, window.innerHeight);
    this.player = new Player();
  }

  /**
   * Process user input.
   *
   * @param keyListener KeyListener instance to check key presses
   * @param mouseListener MouseListener instance for mouse input
   */
  public processInput(keyListener: KeyListener, mouseListener: MouseListener): void {
    // Check if the Space key is pressed
    if (keyListener.keyPressed('Space')) {
      // Set angleReady to true when Space is pressed
      this.angleReady = true;
    }
  }

  /**
   * Update the scene based on elapsed time.
   *
   * @param elapsed Elapsed time since the last update
   * @returns New scene or null if no scene change is needed
   */
  public update(elapsed: number): Scene {
    if (!this.angleReady) {
      this.updateRotation();
    } else {
      this.handlePowerSelection();
    }
    return null;
  }

  /**
   * Update rotation parameters for the player.
   */
  private updateRotation(): void {
    if (this.launchAngle >= -70 && this.launchAngle <= -35) {
      this.rotationSpeed += 0.01;
    } else if (this.launchAngle >= -35) {
      this.rotationSpeed -= 0.01;
    }
    this.launchAngle += this.rotationSpeed;
    this.player.setAngle(this.launchAngle);
  }

  /**
   * Handle power selection based on elapsed time.
   */
  private handlePowerSelection(): void {
    if (this.launchPower >= 200) {
      this.launchSpeed *= -1;
      this.launchSpeed -= 0.07;
    } else if (this.launchPower >= 0) {
      this.launchSpeed += 0.07;
    } else {
      this.launchSpeed = 0;
      this.launchPower = 0.01;
    }
    this.launchPower += this.launchSpeed;
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
    const lineEndX = this.player.getPosX() + lineLength
    * Math.cos((this.launchAngle * Math.PI) / 180);
    const lineEndY = this.player.getPosY() + lineLength
    * Math.sin((this.launchAngle * Math.PI) / 180);
    CanvasUtil.drawLine(canvas, this.player.getPosX() + this.player.getWidth() / 2 + 5, this.player.getPosY() + this.player.getHeight() / 2, lineEndX, lineEndY, 'lightgreen');

    if (this.angleReady) {
      CanvasUtil.drawRectangle(canvas, window.innerWidth / 100, window.innerHeight / 1.5, window.innerWidth / 50, this.maxY / 10 - 280, 'red');
      CanvasUtil.fillRectangle(canvas, window.innerWidth / 100, (window.innerHeight / 1.5) - this.launchPower, window.innerWidth / 50, this.launchPower, 'red');
    }
  }
}
