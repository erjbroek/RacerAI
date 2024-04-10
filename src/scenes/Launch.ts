import KeyListener from '../utilities/KeyListener.js';
import MouseListener from '../utilities/MouseListener.js';
import Player from '../drawables/Player.js';
import Scene from './Scene.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import HandleScenery from '../ui/HandleScenery.js';
import Finished from './Finished.js';
import HandleScore from '../ui/HandleScore.js';
import Choose from './Choose.js';
import HandleItems from '../ui/HandleItems.js';
import Background from '../background items/Background.js';
import HandleStats from '../ui/HandleStats.js';
import Shop from './shop/Shop.js';
import SelectAngle from './SelectAngle.js';

export default class Launch extends Scene {
  private launchAngle: number;

  private player: Player = new Player();

  private finishFlight: boolean = false;

  private endScreen: Finished = new Finished();

  private endGame: boolean = false;

  private gravity: number = 0.19;

  public constructor(launchAngle: number, launchPower: number) {
    super();
    this.launchAngle = launchAngle;
    this.player.angle = this.launchAngle;
    launchPower *= HandleStats.launchPower;
    HandleScenery.backgrounds.push(new Background(0, window.innerHeight - 302 * 4, 1));
    this.player.xSpeed = (launchPower / 10) * Math.cos((launchAngle * Math.PI) / 180);
    this.player.ySpeed = (launchPower / 10) * Math.sin((launchAngle * Math.PI) / 180);
  }

  /**
   * handles inputs
   *
   * @param keyListener the keylistener used
   * @param mouseListener the mouselistener used
   */
  public processInput(keyListener: KeyListener, mouseListener: MouseListener): void {
    if (!HandleScenery.touchingGround && !(Math.abs(this.player.xSpeed) <= 8 && this.player.touchedGround)) {
      if (this.player.energy > 0) {
        if (keyListener.isKeyDown('KeyA')) {
          this.player.ySpeed -= 0.24 * (this.player.xSpeed / 9);
          this.player.xSpeed += this.player.ySpeed > 0 ? 0.13 : -0.13;
          this.player.energy -= 0.5;
        } else if (keyListener.isKeyDown('KeyD')) {
          this.player.ySpeed += 0.05 * (this.player.xSpeed / 9);
          this.player.xSpeed -= this.player.ySpeed > 0 ? 0.13 : -0.13;
          this.player.energy -= 0.5;
        }
      }
    }
    if (!HandleScenery.touchingGround) {
      if (keyListener.isKeyDown('Space')) {
        this.player.xSpeed = this.player.activateBoost(this.player.xSpeed, this.player.ySpeed)[0];
        this.player.ySpeed = this.player.activateBoost(this.player.xSpeed, this.player.ySpeed)[1];
      }
    }
    if (this.finishFlight) {
      this.endScreen.processInput(keyListener, mouseListener);
      // this.endGame = (keyListener.isKeyDown('Space') || keyListener.isKeyDown('Enter') || MouseListener.buttonPressed(0));
    }
  }

  /**
   * updates scene
   *
   * @param elapsed is the elapsed time each frame
   * @returns Scene
   */
  public update(elapsed: number): Scene {
    HandleScore.totalTime += elapsed;
    if (this.finishFlight) {
      this.endScreen.update(elapsed);
      if (this.endScreen.goShop) {
        return new Shop();
      }
      if (this.endScreen.retry) {
        return new SelectAngle();
      } return null;
    }
    this.applyGravity();
    HandleScenery.addScenery();
    HandleScenery.removeUnusedScenery();
    HandleScenery.moveScenery(this.player, this.player.xSpeed, this.player.ySpeed);
    HandleItems.addItems();
    HandleItems.removeUnusedItems();
    HandleItems.collision(this.player);
    HandleItems.moveItems(this.player, this.player.xSpeed, this.player.ySpeed);
    HandleScore.calculateDistances(
      this.player.xSpeed,
      (window.innerHeight - this.player.posY - this.player.image.height)
      - (window.innerHeight
      - (HandleScenery.backgrounds[0].posY
      + HandleScenery.backgrounds[0].image.height)),
      this.player.ySpeed,
    );
    if (Math.abs(this.player.xSpeed) + Math.abs(this.player.ySpeed) <= 0.1) {
      this.finishFlight = true;
    }
    if (this.endGame) {
      HandleScore.duckDollars += HandleScore.totalCoins;
      return new Choose();
    }
    return this;
  }

  /**
   * handles player and gravity
   */
  public applyGravity(): void {
    if (HandleScenery.touchingGround) {
      this.player.posY = window.innerHeight - this.player.image.height;
      this.player.ySpeed *= -0.5;
      this.player.xSpeed *= 0.6;
      this.player.rotationSpeed = this.player.xSpeed;
      this.player.touchedGround = true;
    } else {
      this.player.ySpeed += this.gravity;
      if (this.player.xSpeed >= 0.03) {
        this.player.xSpeed -= 0.045 * (this.player.xSpeed / 15) * HandleStats.airResistance;
        this.player.ySpeed -= 0.045 * (this.player.ySpeed / 15) * HandleStats.airResistance;
      }
      if (Math.abs(this.player.xSpeed) <= 8 && this.player.touchedGround) {
        this.player.rotate();
      } else {
        this.player.setAngle(this.player.xSpeed, this.player.ySpeed);
        this.player.touchedGround = false;
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
    HandleScenery.render(canvas, this.player);
    this.player.renderPower(canvas);
    CanvasUtil.writeText(canvas, `coins: ${HandleScore.totalCoins}`, window.innerWidth / 50, window.innerHeight / 30, 'left', 'arial', 20, 'black');
    CanvasUtil.writeText(canvas, `xspeed: ${Math.round(this.player.xSpeed)}`, window.innerWidth / 50, window.innerHeight / 20, 'left', 'arial', 20, 'black');
    CanvasUtil.writeText(canvas, `yspeed: ${Math.round(this.player.ySpeed)}`, window.innerWidth / 50, window.innerHeight / 15, 'left', 'arial', 20, 'black');
    CanvasUtil.writeText(canvas, `fuel: ${HandleStats.fuel}`, window.innerWidth / 50, window.innerHeight / 8, 'left', 'arial', 20, 'black');
    CanvasUtil.writeText(canvas, `fuel power: ${HandleStats.fuel}`, window.innerWidth / 50, window.innerHeight / 7, 'left', 'arial', 20, 'black');
    CanvasUtil.writeText(canvas, `luck: ${HandleStats.luck[0]}, ${HandleStats.luck[1]}`, window.innerWidth / 50, window.innerHeight / 6.2, 'left', 'arial', 20, 'black');
    CanvasUtil.writeText(canvas, `power: ${HandleStats.launchPower}`, window.innerWidth / 50, window.innerHeight / 5.5, 'left', 'arial', 20, 'black');
    CanvasUtil.writeText(canvas, `air resistance: ${HandleStats.airResistance}`, window.innerWidth / 50, window.innerHeight / 5, 'left', 'arial', 20, 'black');

    if (this.finishFlight) {
      this.endScreen.endRound(canvas);
    }
  }
}
