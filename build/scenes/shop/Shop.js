import HandleScore from '../../ui/handleScore.js';
import CanvasUtil from '../../utilities/CanvasUtil.js';
import Choose from '../Choose.js';
import Scene from '../Scene.js';
import Fuel from '../Fuel.js';
import FuelPower from './FuelPower.js';
import Luck from './Luck.js';
import Power from './Power.js';
import Resistance from './Resistance.js';
export default class Shop extends Scene {
    backgroundImage = CanvasUtil.loadNewImage('/assets/introSceneBackground.png');
    back = false;
    fuel = new Fuel();
    fuelPower = new FuelPower();
    luck = new Luck();
    power = new Power();
    resistance = new Resistance();
    selected = null;
    constructor() {
        super();
    }
    processInput(keyListener, mouseListener) {
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
            }
            else {
                tile.opacity = 0.6;
            }
        });
        if (this.selected) {
            this.selected.blueValue = 255;
        }
    }
    update(elapsed) {
        if (this.back) {
            return new Choose();
        }
        return null;
    }
    render(canvas) {
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
        if (this.selected) {
            CanvasUtil.fillRectangle(canvas, canvas.width / 1.7, canvas.height / 3.2, canvas.width / 3, canvas.height / 5, 0, 0, 0, 0.1);
        }
    }
}
//# sourceMappingURL=Shop.js.map