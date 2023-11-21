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

  private chosenAngle: boolean;

  private launchPower: number;

  private launchSpeed: number;

  public constructor(maxX: number, maxY: number) {
    super(maxX, maxY);
    this.maxX = window.innerWidth;
    this.maxY = window.innerHeight;
    this.angleReady = false;
    this.launchAngle = -70;
    this.totalTime = 0;
    this.rotationSpeed = 0;
    this.launchPower = 0;
    this.launchSpeed = 0;
    this.chosenAngle = false;
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
    this.totalTime += elapsed;
    // Rotate the player if angle is not ready
    if (!this.angleReady) {
      this.updateRotation();
    } else if (!this.chosenAngle) {
      this.totalTime = 0;
      this.chosenAngle = true;
    } else {
      this.handlePowerSelection();
    }

    return null;
  }

  /**
   * Update rotation parameters for the player.
   */
  private updateRotation(): void {
    if (this.totalTime < 1500) {
      this.rotationSpeed += 0.01; // Rotate down
    } else if (this.totalTime >= 1500 && this.totalTime < 4500) {
      this.rotationSpeed -= 0.01; // Rotate up
    } else if (this.totalTime >= 4500 && this.totalTime < 6000) {
      this.rotationSpeed += 0.01;
    } else {
      // Reset rotation parameters
      this.rotationSpeed = 0;
      this.totalTime = 0;
      this.launchAngle = -70;
    }
    this.launchAngle += this.rotationSpeed;
    this.player.setAngle(this.launchAngle);
  }

  /**
   * Handle power selection based on elapsed time.
   */
  private handlePowerSelection(): void {
    // if (this.totalTime < 1500) {
    //   this.launchSpeed += 0.01;
    // } else if (this.totalTime >= 1500 && this.totalTime < 4500) {
    //   console.log('"2"');
    // } else if (this.totalTime >= 4500 && this.totalTime < 6000) {
    //   console.log('"3"');
    // } else {
    //   // Reset parameters or perform additional logic as needed
    //   this.totalTime = 0;
    // }
    if (this.launchPower >= 100) {
      this.launchSpeed -= 0.02;
    } else {
      this.launchSpeed += 0.02;
    }
    this.launchPower += this.launchSpeed;
    console.log(this.launchPower);
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
    CanvasUtil.drawCircle(canvas, 0, canvas.height, canvas.height / 5, "lightgreen");
    const lineLength = 200;
    const lineEndX = this.player.getPosX() + lineLength * Math.cos((this.launchAngle * Math.PI) / 180);
    const lineEndY = this.player.getPosY() + lineLength * Math.sin((this.launchAngle * Math.PI) / 180);
    CanvasUtil.drawLine(canvas, this.player.getPosX() + this.player.getWidth() / 2 + 5, this.player.getPosY() + this.player.getHeight() / 2, lineEndX, lineEndY, "lightgreen");
    if (this.angleReady) {
      CanvasUtil.drawRectangle(canvas, window.innerWidth / 100, window.innerHeight / 1.5, window.innerWidth / 50, this.maxY / 10, 'red');
      CanvasUtil.fillRectangle(canvas, window.innerWidth / 100, (window.innerHeight / 1.5) - this.launchPower, window.innerWidth / 50, this.launchPower, 'red');
    }
  }
}
