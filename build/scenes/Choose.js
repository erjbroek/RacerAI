import HandleItems from '../ui/HandleItems.js';
import HandleScenery from '../ui/HandleScenery.js';
import HandleScore from '../ui/handleScore.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import Scene from './Scene.js';
import SelectAngle from './SelectAngle.js';
import Shop from './shop/Shop.js';
export default class Choose extends Scene {
    logo;
    upgrade;
    continue;
    goShop = false;
    startRound = false;
    constructor() {
        super();
        this.logo = CanvasUtil.loadNewImage('./assets/mainTitle.png');
        HandleScore.reset();
        HandleItems.reset();
        HandleScenery.reset();
    }
    processInput(keyListener, mouseListener) {
        if (keyListener.isKeyDown('KeyL')) {
            this.startRound = true;
        }
        else if (keyListener.isKeyDown('KeyS')) {
            this.goShop = true;
        }
    }
    update(elapsed) {
        if (this.startRound) {
            return new SelectAngle();
        }
        if (this.goShop) {
            return new Shop();
        }
        return this;
    }
    render(canvas) {
        CanvasUtil.fillCanvas(canvas, '#7cc7b9');
        CanvasUtil.drawImage(canvas, this.logo, window.innerWidth / 3.3, 0 + window.innerHeight / 20, window.innerWidth / 2.8, window.innerHeight / 2.8);
        CanvasUtil.fillRectangle(canvas, window.innerWidth / 3.5, window.innerHeight / 2, window.innerWidth / 7, window.innerHeight / 10, 0, 0, 0);
        CanvasUtil.fillRectangle(canvas, window.innerWidth / 1.9, window.innerHeight / 2, window.innerWidth / 7, window.innerHeight / 10, 0, 0, 0);
        CanvasUtil.writeTextToCanvas(canvas, `Duck dollars: ${HandleScore.duckDollars}`, window.innerWidth / 1.8, window.innerHeight / 2 + window.innerHeight / 8, 'left', 'arial', 20, 'black');
    }
}
//# sourceMappingURL=Choose.js.map