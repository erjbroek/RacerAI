import HandleScore from '../../ui/handleScore.js';
import CanvasUtil from '../../utilities/CanvasUtil.js';
import Choose from '../Choose.js';
import Scene from '../Scene.js';
import ShopDecoration from './shopDecoration.js';
import Fuel from './tiles/Fuel.js';
import FuelPower from './tiles/FuelPower.js';
import Luck from './tiles/Luck.js';
import Power from './tiles/Power.js';
import Resistance from './tiles/Resistance.js';
export default class Shop extends Scene {
    backgroundImage = CanvasUtil.loadNewImage('/assets/introSceneBackground.png');
    back = false;
    fuel = new Fuel();
    fuelPower = new FuelPower();
    luck = new Luck();
    power = new Power();
    resistance = new Resistance();
    selected = null;
    shopDecorator = new ShopDecoration();
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
        this.shopDecorator.update(elapsed);
        if (this.back) {
            return new Choose();
        }
        return null;
    }
    render(canvas) {
        this.shopDecorator.render(canvas);
        CanvasUtil.drawImage(canvas, this.backgroundImage, 0, canvas.height / 6, canvas.width, canvas.height, 0);
        CanvasUtil.fillRectangle(canvas, 0, canvas.height / 6 + 3, canvas.width, canvas.height / 40, 200, 255, 255, 0.6);
        CanvasUtil.fillRectangle(canvas, canvas.width / 9.5, canvas.height / 3.2, canvas.width / 2.2, canvas.height / 1.57, 200, 255, 255, 0.6);
        CanvasUtil.fillRectangle(canvas, canvas.width / 1.7, canvas.height / 3.2, canvas.width / 3, canvas.height / 1.57, 200, 255, 255, 0.6);
        CanvasUtil.fillRectangle(canvas, 0, canvas.height / 6, canvas.width, canvas.height, 255, 255, 255, 0.3);
        this.fuel.render(canvas);
        this.fuelPower.render(canvas);
        this.luck.render(canvas);
        this.power.render(canvas);
        this.resistance.render(canvas);
        CanvasUtil.writeTextToCanvas(canvas, `${HandleScore.duckDollars} $`, canvas.width / 2.95, canvas.height / 3.7, 'center', 'arial', 40, 'black');
        if (this.selected) {
            CanvasUtil.fillRectangle(canvas, canvas.width / 1.7, canvas.height / 3.2, canvas.width / 3, canvas.height / 5, 75, 75, 150, 0.2);
            CanvasUtil.writeTextToCanvas(canvas, this.selected.title.toUpperCase(), canvas.width / 1.7 + canvas.width / 3 / 2, canvas.height / 2.6 + 30, 'center', 'Arial', 40, 'white');
        }
    }
}
//# sourceMappingURL=Shop.js.map