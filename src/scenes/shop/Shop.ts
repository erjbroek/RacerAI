import HandleScore from '../../ui/handleScore.js';
import CanvasUtil from '../../utilities/CanvasUtil.js';
import KeyListener from '../../utilities/KeyListener.js';
import MouseListener from '../../utilities/MouseListener.js';
import Choose from '../Choose.js';
import Scene from '../Scene.js';
import SelectAngle from '../SelectAngle.js';
import ShopDecoration from './shopDecoration.js';
import Fuel from './tiles/Fuel.js';
import FuelPower from './tiles/FuelPower.js';
import Luck from './tiles/Luck.js';
import Power from './tiles/Power.js';
import Resistance from './tiles/Resistance.js';
import ShopTile from './tiles/ShopTile.js';

export default class Shop extends Scene {
  private backgroundImage: HTMLImageElement = CanvasUtil.loadNewImage('/assets/introSceneBackground.png');

  private back: boolean = false;

  private fuel: Fuel = new Fuel();

  private fuelPower: FuelPower = new FuelPower();

  private luck: Luck = new Luck();

  private power: Power = new Power();

  private resistance: Resistance = new Resistance();

  private selected: ShopTile = null;

  private shopDecorator: ShopDecoration = new ShopDecoration();

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
    [this.fuel, this.fuelPower, this.luck, this.power, this.resistance].forEach((tile) => {
      tile.blueValue = 0;
      if (mouseListener.getMousePosition().x > tile.posX
      && mouseListener.getMousePosition().y > tile.posY
      && mouseListener.getMousePosition().x < tile.posX + tile.tileSize
      && mouseListener.getMousePosition().y < tile.posY + tile.tileSize) {
        tile.opacity = 0.5;
        if (mouseListener.isButtonDown(0)) {
          this.selected = tile;
        }
      } else {
        tile.opacity = 0.6;
      }
    });
    if (this.selected) {
      this.selected.blueValue = 255;
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
    CanvasUtil.fillRectangle(canvas, canvas.width / 9.5, canvas.height / 3.2, canvas.width / 2.2, canvas.height / 1.57, 200, 255, 255, 0.6);
    CanvasUtil.fillRectangle(canvas, canvas.width / 1.7, canvas.height / 3.2, canvas.width / 3, canvas.height / 1.57, 200, 255, 255, 0.6);
    CanvasUtil.fillRectangle(canvas, 0, canvas.height / 6, canvas.width, canvas.height, 255, 255, 255, 0.3);



    this.fuel.render(canvas);
    this.fuelPower.render(canvas);
    this.luck.render(canvas);
    this.power.render(canvas);
    this.resistance.render(canvas);

    CanvasUtil.writeTextToCanvas(canvas, `Duck dollars: ${HandleScore.duckDollars} $`, 20, 20, 'left', 'arial', 20, 'black');

    if (this.selected) {
      CanvasUtil.fillRectangle(canvas, canvas.width / 1.7, canvas.height / 3.2, canvas.width / 3, canvas.height / 5, 75, 75, 150, 0.2);
      CanvasUtil.writeTextToCanvas(canvas, this.selected.title.toUpperCase(), canvas.width / 1.7 + canvas.width / 3 / 2, canvas.height / 2.6 + 30, 'center', 'Arial', 40, 'white');
    }
  }
}
