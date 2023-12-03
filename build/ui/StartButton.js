import CanvasUtil from '../utilities/CanvasUtil.js';
import Drawable from '../drawables/Drawable.js';
export default class StartButton extends Drawable {
    hover;
    readyGame;
    constructor() {
        super();
        this.posX = window.innerWidth / 1.5;
        this.posY = window.innerHeight / 2;
        this.image = CanvasUtil.loadNewImage('./assets/startButton.png');
        this.hover = false;
        this.angle = 0;
        this.readyGame = false;
    }
    processInput(keyListener, mouseListener) {
        if (CanvasUtil.mouseHover(this, mouseListener)) {
            this.image = CanvasUtil.loadNewImage('./assets/startButtonHover.png');
            if (mouseListener.buttonPressed(0)) {
                this.readyGame = true;
            }
        }
        else {
            this.image = CanvasUtil.loadNewImage('./assets/startButton.png');
            this.hover = false;
        }
        this.image.width /= 10;
        this.image.height /= 10;
    }
    getReadyGame() {
        return this.readyGame;
    }
}
//# sourceMappingURL=StartButton.js.map