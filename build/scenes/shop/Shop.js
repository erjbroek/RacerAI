import Cookies from '../../ui/Cookies.js';
import CanvasUtil from '../../utilities/CanvasUtil.js';
import Choose from '../Choose.js';
import Scene from '../Scene.js';
import ShopDecoration from './shopDecoration.js';
import Fuel from './tiles/Fuel.js';
import FuelPower from './tiles/FuelPower.js';
import Luck from './tiles/Luck.js';
import Power from './tiles/Power.js';
import Resistance from './tiles/Resistance.js';
import CoinMult from './tiles/CoinMult.js';
import HandleStats from '../../ui/HandleStats.js';
import HandleScore from '../../ui/HandleScore.js';
export default class Shop extends Scene {
    backgroundImage = CanvasUtil.loadNewImage('/assets/introSceneBackground.png');
    back = false;
    fuel = new Fuel();
    fuelPower = new FuelPower();
    luck = new Luck();
    power = new Power();
    resistance = new Resistance();
    coinMultiplier = new CoinMult();
    selected = null;
    shopDecorator = new ShopDecoration();
    buyButton = CanvasUtil.loadNewImage('./assets/buy-button.jpg');
    canLevel = false;
    constructor() {
        super();
    }
    processInput(keyListener, mouseListener) {
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
            if (mouseListener.getMousePosition().x > window.innerWidth / 1.45 + window.innerWidth / 6.9
                && mouseListener.getMousePosition().y > window.innerHeight / 1.13
                && mouseListener.getMousePosition().x < window.innerWidth / 1.45 + window.innerWidth / 6.9 + window.innerWidth / 14
                && mouseListener.getMousePosition().y < window.innerHeight / 1.13 + window.innerHeight / 22.6) {
                if (mouseListener.buttonPressed(0)) {
                    this.selected.level();
                }
            }
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
        CanvasUtil.fillRectangle(canvas, 0, canvas.height / 6, canvas.width, canvas.height, 255, 255, 255, 0.3);
        CanvasUtil.fillRectangle(canvas, 0, canvas.height / 6 + 3, canvas.width, canvas.height / 40, 200, 255, 255, 0.6);
        CanvasUtil.fillRectangle(canvas, canvas.width / 9.5, canvas.height / 3.2, canvas.width / 2.2, canvas.height / 1.57, 200, 255, 255, 0.6);
        if (this.canLevel) {
            CanvasUtil.fillRectangle(canvas, canvas.width / 1.7, canvas.height / 3.2, canvas.width / 3, canvas.height / 1.57, 200, 50, 50, 0.8);
        }
        else {
            CanvasUtil.fillRectangle(canvas, canvas.width / 1.7, canvas.height / 3.2, canvas.width / 3, canvas.height / 1.57, 200, 255, 255, 0.6);
        }
        this.fuel.render(canvas);
        this.fuelPower.render(canvas);
        this.luck.render(canvas);
        this.power.render(canvas);
        this.resistance.render(canvas);
        this.coinMultiplier.render(canvas);
        CanvasUtil.writeTextToCanvas(canvas, `${HandleScore.duckDollars} $`, canvas.width / 2.95, canvas.height / 3.7, 'center', 'arial', 40, 'black');
        if (this.selected) {
            CanvasUtil.fillRectangle(canvas, canvas.width / 1.68, canvas.height / 3.08, canvas.width / 3.12, canvas.height / 15, 75, 75, 150, 0.2);
            CanvasUtil.writeTextToCanvas(canvas, this.selected.title.toUpperCase(), canvas.width / 1.7 + canvas.width / 3 / 2, canvas.height / 2.71, 'center', 'Arial', 30, 'white');
            const descriptionLines = this.selected.description.split('<br>');
            descriptionLines.forEach((line, index) => {
                CanvasUtil.writeText(canvas, line, canvas.width / 1.68, canvas.height / 2.4 + (index * 18), 'left', 'Arial', 18, 'black');
            });
            CanvasUtil.writeTextToCanvas(canvas, `price: ${Math.round(this.selected.upgradeCost)} $`, canvas.width / 1.68, canvas.height / 1.75, 'left', 'arial', 20, 'black');
            for (let i = 1; i <= this.selected.maxTier; i++) {
                CanvasUtil.drawRectangle(canvas, canvas.width / 1.8 + (canvas.width / 20) * i, canvas.height / 1.68, canvas.width / 20, canvas.height / 30, 30, 100, 100, 0.8, 3);
            }
            for (let i = 1; i <= this.selected.tier; i++) {
                CanvasUtil.fillRectangle(canvas, canvas.width / 1.8 + (canvas.width / 20) * i, canvas.height / 1.68, canvas.width / 20, canvas.height / 30, 30, 100, (255 / this.selected.maxTier) * i, 0.8);
            }
            CanvasUtil.writeTextToCanvas(canvas, 'NOW', canvas.width / 1.68, canvas.height / 1.5, 'left', 'Arial', 15, 'black');
            if (this.selected === this.luck) {
                CanvasUtil.writeTextToCanvas(canvas, `- Better coin chances:${Math.round(this.luck.luckStats[this.luck.tier][0] * 100)}%`, canvas.width / 1.68, canvas.height / 1.45, 'left', 'Arial', 15, 'black');
                CanvasUtil.writeTextToCanvas(canvas, `- Less bad obstacles: ${Math.round(this.luck.luckStats[this.luck.tier][1] * 100)}%`, canvas.width / 1.68, canvas.height / 1.35, 'left', 'Arial', 15, 'black');
                if (this.selected.tier < this.selected.maxTier) {
                    CanvasUtil.writeTextToCanvas(canvas, `- Less bad obstacles: ${Math.round(this.luck.luckStats[this.luck.tier + 1][1] * 100)}%`, canvas.width / 1.32, canvas.height / 1.35, 'left', 'Arial', 15, 'black');
                    CanvasUtil.writeTextToCanvas(canvas, `- Better coin chances:${Math.round(this.luck.luckStats[this.luck.tier + 1][0] * 100)}%`, canvas.width / 1.32, canvas.height / 1.45, 'left', 'Arial', 15, 'black');
                }
            }
            else {
                CanvasUtil.writeTextToCanvas(canvas, 'UPGRADED', canvas.width / 1.32, canvas.height / 1.5, 'left', 'Arial', 15, 'black');
                CanvasUtil.writeTextToCanvas(canvas, `- ${this.selected.title}:${Math.round(this.selected.statTiers[this.selected.tier] * 100) / 100}`, canvas.width / 1.68, canvas.height / 1.45, 'left', 'Arial', 15, 'black');
                if (this.selected.tier < this.selected.maxTier) {
                    CanvasUtil.writeTextToCanvas(canvas, `- ${this.selected.title}:${Math.round(this.selected.statTiers[this.selected.tier + 1] * 100) / 100}`, canvas.width / 1.32, canvas.height / 1.45, 'left', 'Arial', 15, 'black');
                }
            }
            CanvasUtil.drawRectangle(canvas, canvas.width / 1.33, canvas.height / 1.56, canvas.width / 1000, canvas.height / 3.5, 75, 75, 150, 0.6);
            CanvasUtil.fillRectangle(canvas, canvas.width / 1.68, canvas.height / 1.7, canvas.width / 3.12, canvas.height / 1000, 75, 75, 150, 0.6);
            CanvasUtil.fillRectangle(canvas, canvas.width / 1.68, canvas.height / 1.575, canvas.width / 3.12, canvas.height / 1000, 75, 75, 150, 0.6);
            CanvasUtil.drawImage(canvas, this.buyButton, canvas.width / 1.45 + canvas.width / 6.9, canvas.height / 1.13, canvas.width / 14, canvas.height / 22.6);
        }
    }
}
//# sourceMappingURL=Shop.js.map