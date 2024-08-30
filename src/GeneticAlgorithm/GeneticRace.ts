import Track from '../Track.js';
import Scene from '../scenes/Scene.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import KeyListener from '../utilities/KeyListener.js';
import GeneticCar from './GeneticCar.js';
import GeneticPopulation from './GeneticPopulation.js';
import Player from './Player.js';

export default class GeneticRace extends Scene {
  private track: Track;

  private champion: GeneticCar;

  private player: Player;

  public moveDuration: number = 200;

  public moveNumber: number = 0;

  public startingPoint: number[];

  public startingAngle: number;

  public constructor(track: Track, champion: GeneticCar, startingPoint: number[], startingAngle: number) {
    super();
    this.track = track;
    this.champion = champion;
    this.startingPoint = startingPoint;
    this.startingAngle = startingAngle;
    this.player = new Player(startingPoint, startingAngle);
    this.champion = new GeneticCar(startingPoint, startingAngle, this.champion.moves, 999);
  }

  /**
   * processes player inputs
   */
  public override processInput(): void {
    if (this.player.alive) {
      if (KeyListener.isKeyDown('KeyW')) {
        this.player.accelerate();
      } else if (KeyListener.isKeyDown('KeyS')) {
        this.player.brake();
      }

      if (KeyListener.isKeyDown('KeyD')) {
        this.player.rotateRight();
      } else if (KeyListener.isKeyDown('KeyA')) {
        this.player.rotateLeft();
      }
    }
  }

  /**
   * updates the gamestate
   *
   * @param elapsed is the elapsed time since the last frame
   * @returns next scene
   */
  public override update(elapsed: number): Scene {
    this.moveDuration -= elapsed;
    this.champion.alive = this.track.checkCollisionWithTrack(this.champion);
    this.player.alive = this.track.checkCollisionWithTrack(this.player);
    if (this.champion.alive) {
      if (this.moveDuration <= 0) {
        this.moveNumber += 1;
        this.moveDuration = 200;
      }
      this.champion.processMoves(this.moveNumber, elapsed);
      this.champion.update(elapsed);
    }
    if (this.player.alive) {
      this.player.update(elapsed);
    }
    if (!this.player.alive && !this.champion.alive) {
      this.moveNumber = 0;
      this.champion = new GeneticCar(this.startingPoint, this.startingAngle, this.champion.moves, null);
      this.player = new Player(this.startingPoint, this.startingAngle);
    }
    return this;
  }

  /**
   *
   * @param canvas is the selected canvas all items are rendered on
   */
  public override render(canvas: HTMLCanvasElement): void {
    this.track.render(canvas);
    CanvasUtil.drawCar(canvas, this.champion.posX, this.champion.posY, this.champion.width, this.champion.height, this.champion.rotation, 255, 0, 0, 1, false);
    // CanvasUtil.fillRectangle(canvas, this.player.posX, this.player.posY, this.player.width, this.player.height, 0, 200, 230, 1, 0)
    CanvasUtil.drawCar(canvas, this.player.posX, this.player.posY, this.player.width, this.player.height, this.player.rotation, 0, 0, 255, 1, true);
    CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width / 30, canvas.height, 50, 120, 200);
    CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width, canvas.height / 20, 50, 120, 200);
    CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6, 0, canvas.width / 6, canvas.height, 50, 120, 200);
    CanvasUtil.fillRectangle(canvas, 0, canvas.height - canvas.height / 20, canvas.width, canvas.height / 20, 50, 120, 200);
    CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6.5, canvas.height / 20, canvas.width / 5 - canvas.width / 18, canvas.height / 1.111, 255, 255, 255, 0.2);
  }
}
