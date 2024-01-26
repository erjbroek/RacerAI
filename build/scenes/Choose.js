import HandleScore from '../ui/handleScore.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import Scene from './Scene.js';
import SelectAngle from './SelectAngle.js';
export default class Choose extends Scene {
    logo;
    upgrade;
    continue;
    goUpgrade = false;
    startRound = false;
    constructor() {
        super();
        this.logo = CanvasUtil.loadNewImage('./assets/mainTitle.png');
    }
    processInput(keyListener, mouseListener) {
        if (keyListener.isKeyDown('Escape')) {
            HandleScore.resetRound();
            this.startRound = true;
        }
    }
    update(elapsed) {
        if (this.startRound) {
            return new SelectAngle();
        }
        return this;
    }
    render(canvas) {
        CanvasUtil.fillCanvas(canvas, '#7cc7b9');
        CanvasUtil.drawImage(canvas, this.logo, window.innerWidth / 3.3, 0 + window.innerHeight / 20, window.innerWidth / 2.8, window.innerHeight / 2.8);
        CanvasUtil.fillRectangle(canvas, window.innerWidth / 3.5, window.innerHeight / 2, window.innerWidth / 7, window.innerHeight / 10, 'black');
        CanvasUtil.fillRectangle(canvas, window.innerWidth / 1.9, window.innerHeight / 2, window.innerWidth / 7, window.innerHeight / 10, 'black');
        CanvasUtil.writeTextToCanvas(canvas, `Duck dollars: ${HandleScore.duckDollars}`, window.innerWidth / 1.8, window.innerHeight / 2 + window.innerHeight / 8, 'left', 'arial', 20, 'black');
    }
}
//# sourceMappingURL=Choose.js.map