import Cookies from '../../ui/Cookies.js';
import CanvasUtil from '../../utilities/CanvasUtil.js';
import KeyListener from '../../utilities/KeyListener.js';
import MouseListener from '../../utilities/MouseListener.js';
import Choose from '../Choose.js';
import Scene from '../Scene.js';
import ShopDecoration from './shopDecoration.js';
import Fuel from './tiles/Fuel.js';
import FuelPower from './tiles/FuelPower.js';
import Luck from './tiles/Luck.js';
import Power from './tiles/Power.js';
import Resistance from './tiles/Resistance.js';
import ShopTile from './tiles/ShopTile.js';
import CoinMult from './tiles/CoinMult.js';
import HandleStats from '../../ui/HandleStats.js';
import HandleScore from '../../ui/HandleScore.js';

export default class Shop extends Scene {
  private backgroundImage: HTMLImageElement = CanvasUtil.loadNewImage('assets/introSceneBackground.png');

  private back: boolean = false;

  private fuel: Fuel = new Fuel();

  private fuelPower: FuelPower = new FuelPower();

  private luck: Luck = new Luck();

  private power: Power = new Power();

  private resistance: Resistance = new Resistance();

  private coinMultiplier: CoinMult = new CoinMult();

  private selected: ShopTile = null;

  private shopDecorator: ShopDecoration = new ShopDecoration();

  private buyButton: HTMLImageElement = CanvasUtil.loadNewImage('./assets/buy-button.jpg');

  private canLevel: boolean = false;

  public constructor() {
    super();
  }

  /**
   * processes the keyboard and mouse inputs from the player
   *
   * @param keyListener processes inputs from keyboard, like buttons pressed
   * @param mouseListener processes inputs from mouse, like movements and button presses
   */
  public processInput(keyListener: KeyListener, mouseListener: MouseListener): void {
    if (keyListener.keyPressed('Space')) {
      this.back = true;
    }
    HandleStats.airResistance += 0;

    if (keyListener.keyPressed('Digit1')) {
      Cookies.saveStatsToCookies(1);
      console.log('save');
    }

    if (keyListener.keyPressed('Digit2')) {
      Cookies.saveStatsToCookies(2);
      console.log('save');
    }

    if (keyListener.keyPressed('Digit3')) {
      Cookies.saveStatsToCookies(3);
      console.log('save');
    }

    [this.fuel, this.fuelPower, this.luck, this.power, this.resistance, this.coinMultiplier].forEach((tile) => {
      if (MouseListener.mouseHover(tile.posX, tile.posY, tile.tileSize, tile.tileSize)) {
        tile.opacity = 0.5;
        if (MouseListener.isButtonDown(0)) {
          this.selected = tile;
        }
      } else {
        tile.opacity = 0.6;
      }
    });
    if (this.selected) {
      if (MouseListener.areaPressed(window.innerWidth / 1.45 + window.innerWidth / 6.9, window.innerHeight / 1.13, window.innerWidth / 14, window.innerHeight / 22.6)) {
        this.selected.level();
      }
      // if (MouseListener.getMousePosition().x > window.innerWidth / 1.45 + window.innerWidth / 6.9
      // && MouseListener.getMousePosition().y > window.innerHeight / 1.13
      // && MouseListener.getMousePosition().x < window.innerWidth / 1.45 + window.innerWidth / 6.9 + window.innerWidth / 14
      // && MouseListener.getMousePosition().y < window.innerHeight / 1.13 + window.innerHeight / 22.6) {
      //   if (MouseListener.buttonPressed(0)) {
      //     this.selected.level();
      //   }
      // }
    }
  }

  /**
   * @param elapsed is the elapsed time that passes each frame
   * @returns Scene
   */
  public update(elapsed: number): Scene {
    this.shopDecorator.update(elapsed);
    if (this.back) {
      return new Choose();
    } return null;
  }

  /**
   * renders all shop parts to the selected canvas
   *
   * @param canvas is the selected canvas renderedn t0
   */
  public render(canvas: HTMLCanvasElement): void {
    this.shopDecorator.render(canvas);
    CanvasUtil.drawImage(canvas, this.backgroundImage, 0, canvas.height / 6, canvas.width, canvas.height, 0);
    CanvasUtil.fillRectangle(canvas, 0, canvas.height / 6, canvas.width, canvas.height, 255, 255, 255, 0.3);
    CanvasUtil.fillRectangle(canvas, 0, canvas.height / 6 + 3, canvas.width, canvas.height / 40, 200, 255, 255, 0.6);
    CanvasUtil.fillRectangle(canvas, canvas.width / 9.5, canvas.height / 3.2, canvas.width / 2.2, canvas.height / 1.57, 200, 255, 255, 0.6);

    if (this.canLevel) {
      CanvasUtil.fillRectangle(canvas, canvas.width / 1.7, canvas.height / 3.2, canvas.width / 3, canvas.height / 1.57, 200, 50, 50, 0.8);
    } else {
      CanvasUtil.fillRectangle(canvas, canvas.width / 1.7, canvas.height / 3.2, canvas.width / 3, canvas.height / 1.57, 200, 255, 255, 0.6);
    }

    this.fuel.render(canvas);
    this.fuelPower.render(canvas);
    this.luck.render(canvas);
    this.power.render(canvas);
    this.resistance.render(canvas);
    this.coinMultiplier.render(canvas);

    CanvasUtil.writeText(canvas, `${HandleScore.duckDollars} $`, canvas.width / 2.95, canvas.height / 3.7, 'center', 'arial', 40, 'black');

    if (this.selected) {
      CanvasUtil.fillRectangle(canvas, canvas.width / 1.68, canvas.height / 3.08, canvas.width / 3.12, canvas.height / 15, 75, 75, 150, 0.2);
      CanvasUtil.writeText(canvas, this.selected.title.toUpperCase(), canvas.width / 1.7 + canvas.width / 3 / 2, canvas.height / 2.71, 'center', 'Arial', 30, 'white');

      const descriptionLines = this.selected.description.split('<br>');
      descriptionLines.forEach((line, index) => {
        CanvasUtil.writeText(canvas, line, canvas.width / 1.68, canvas.height / 2.4 + (index * 18), 'left', 'Arial', 18, 'black');
      });
      CanvasUtil.writeText(canvas, `price: ${Math.round(this.selected.upgradeCost)} $`, canvas.width / 1.68, canvas.height / 1.75, 'left', 'arial', 20, 'black');

      for (let i = 1; i <= this.selected.maxTier; i++) {
        CanvasUtil.drawRectangle(canvas, canvas.width / 1.8 + (canvas.width / 20) * i, canvas.height / 1.68, canvas.width / 20, canvas.height / 30, 30, 100, 100, 0.8, 3);
      }
      for (let i = 1; i <= this.selected.tier; i++) {
        CanvasUtil.fillRectangle(canvas, canvas.width / 1.8 + (canvas.width / 20) * i, canvas.height / 1.68, canvas.width / 20, canvas.height / 30, 30, 100, (255 / this.selected.maxTier) * i, 0.8);
      }

      CanvasUtil.writeText(canvas, 'NOW', canvas.width / 1.68, canvas.height / 1.5, 'left', 'Arial', 15, 'black');
      if (this.selected === this.luck) {
        CanvasUtil.writeText(canvas, `- Better coin chances:${Math.round(this.luck.luckStats[this.luck.tier][0] * 100)}%`, canvas.width / 1.68, canvas.height / 1.45, 'left', 'Arial', 15, 'black');
        CanvasUtil.writeText(canvas, `- Less bad obstacles: ${Math.round(this.luck.luckStats[this.luck.tier][1] * 100)}%`, canvas.width / 1.68, canvas.height / 1.35, 'left', 'Arial', 15, 'black');
        if (this.selected.tier < this.selected.maxTier) {
          CanvasUtil.writeText(canvas, `- Less bad obstacles: ${Math.round(this.luck.luckStats[this.luck.tier + 1][1] * 100)}%`, canvas.width / 1.32, canvas.height / 1.35, 'left', 'Arial', 15, 'black');
          CanvasUtil.writeText(canvas, `- Better coin chances:${Math.round(this.luck.luckStats[this.luck.tier + 1][0] * 100)}%`, canvas.width / 1.32, canvas.height / 1.45, 'left', 'Arial', 15, 'black');
        }
      } else {
        CanvasUtil.writeText(canvas, 'UPGRADED', canvas.width / 1.32, canvas.height / 1.5, 'left', 'Arial', 15, 'black');
        CanvasUtil.writeText(canvas, `- ${this.selected.title}:${Math.round(this.selected.statTiers[this.selected.tier] * 100) / 100}`, canvas.width / 1.68, canvas.height / 1.45, 'left', 'Arial', 15, 'black');
        if (this.selected.tier < this.selected.maxTier) {
          CanvasUtil.writeText(canvas, `- ${this.selected.title}:${Math.round(this.selected.statTiers[this.selected.tier + 1] * 100) / 100}`, canvas.width / 1.32, canvas.height / 1.45, 'left', 'Arial', 15, 'black');
        }
      }

      CanvasUtil.drawRectangle(canvas, canvas.width / 1.33, canvas.height / 1.56, canvas.width / 1000, canvas.height / 3.5, 75, 75, 150, 0.6);
      CanvasUtil.fillRectangle(canvas, canvas.width / 1.68, canvas.height / 1.7, canvas.width / 3.12, canvas.height / 1000, 75, 75, 150, 0.6);
      CanvasUtil.fillRectangle(canvas, canvas.width / 1.68, canvas.height / 1.575, canvas.width / 3.12, canvas.height / 1000, 75, 75, 150, 0.6);
      CanvasUtil.drawImage(canvas, this.buyButton, canvas.width / 1.45 + canvas.width / 6.9, canvas.height / 1.13, canvas.width / 14, canvas.height / 22.6);
    }
  }
}
