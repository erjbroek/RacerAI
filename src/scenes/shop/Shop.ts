import HandleScore from '../../ui/handleScore.js';
import CanvasUtil from '../../utilities/CanvasUtil.js';
import KeyListener from '../../utilities/KeyListener.js';
import MouseListener from '../../utilities/MouseListener.js';
import Choose from '../Choose.js';
import Scene from '../Scene.js';
import SelectAngle from '../SelectAngle.js';
import Fuel from './Fuel.js';
import FuelPower from './FuelPower.js';
import Luck from './Luck.js';
import Power from './Power.js';
import Resistance from './Resistance.js';

export default class Shop extends Scene {
  private backgroundImage: HTMLImageElement = CanvasUtil.loadNewImage('/assets/introSceneBackground.png');

  private back: boolean = false;

  private fuel: Fuel = new Fuel();

  private fuelPower: FuelPower = new FuelPower();

  private luck: Luck = new Luck();

  private power: Power = new Power();

  private resistance: Resistance = new Resistance();

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
      if (mouseListener.getMousePosition().x > tile.posX
      && mouseListener.getMousePosition().y > tile.posY
      && mouseListener.getMousePosition().x < tile.posX + tile.tileSize
      && mouseListener.getMousePosition().y < tile.posY + tile.tileSize) {
        tile.blueValue = 255;
        if (mouseListener.isButtonDown(0)) {
          tile.opacity = 1;
        } else {
          tile.opacity = 0.6;
        }
      } else {
        tile.blueValue = 0;
      }
    });
  }

  /**
   * @param elapsed is the elapsed time that passes each frame
   * @returns Scene
   */
  public update(elapsed: number): Scene {
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
    CanvasUtil.drawImage(canvas, this.backgroundImage, 0, 0, canvas.width, canvas.height, 0);
    CanvasUtil.fillRectangle(canvas, 0, canvas.height / 5, canvas.width, canvas.height, 255, 255, 255, 0.6);

    CanvasUtil.fillRectangle(canvas, canvas.width / 9.5, canvas.height / 3.2, canvas.width / 2.2, canvas.height / 1.57, 200, 200, 200, 0.6);
    this.fuel.render(canvas);
    this.fuelPower.render(canvas);
    this.luck.render(canvas);
    this.power.render(canvas);
    this.resistance.render(canvas);
    CanvasUtil.fillRectangle(canvas, canvas.width / 1.7, canvas.height / 3.2, canvas.width / 3, canvas.height / 1.57, 200, 200, 200, 0.6);

    CanvasUtil.writeTextToCanvas(canvas, `Duck dollars: ${HandleScore.duckDollars} $`, 20, 20, 'left', 'arial', 20, 'black');
  }
}
