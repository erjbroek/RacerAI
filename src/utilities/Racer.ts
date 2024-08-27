import { Game } from '../GameLoop.js';
import CanvasUtil from './CanvasUtil.js';
import KeyListener from './KeyListener.js';
import Scene from '../scenes/Scene.js';
import MouseListener from './MouseListener.js';
import DrawTrack from '../scenes/DrawTrack.js';

export default class Racer extends Game {
  private canvas: HTMLCanvasElement;

  private keyListener: KeyListener;

  private mouseListener: MouseListener;

  private currentScene: Scene;

  public constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
    this.keyListener = new KeyListener();
    this.mouseListener = new MouseListener(canvas);
    CanvasUtil.setCanvas(this.canvas);

    this.currentScene = new DrawTrack();
  }

  /**
   * Process all input. Called from the GameLoop.
   */
  public processInput(): void {
    this.currentScene.processInput(this.keyListener);
  }

  /**
   * Update game state. Called from the GameLoop
   *
   * @param elapsed time elapsed from the GameLoop
   * @returns true if the game should continue
   */
  public update(elapsed: number): boolean {
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
    const context = this.canvas.getContext('2d');
    context.font = '20px System-ui';
    if (KeyListener.isKeyDown('ControlLeft')) {
      context.fillText(`X - ${(MouseListener.mouseCoordinates.x / window.innerWidth).toFixed(3)}`, window.innerWidth / 20, window.innerHeight / 1.02);
      context.fillText(`Y - ${(MouseListener.mouseCoordinates.y / window.innerHeight).toFixed(3)}`, window.innerWidth / 10, window.innerHeight / 1.02);
    }
    // CanvasUtil.writeText(canvas, `fps: ${}`)
  }
}
