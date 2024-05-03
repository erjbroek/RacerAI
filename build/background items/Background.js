import BackgroundItems from './BackgroundItems.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
export default class Background extends BackgroundItems {
    constructor(posX, posY, random = Math.random(), width = 1080 * 4, height = 302 * 4) {
        super();
        if (random <= 0.15) {
            this.image = CanvasUtil.loadNewImage('./assets/backMountains.png');
        }
        else if (random <= 0.4) {
            this.image = CanvasUtil.loadNewImage('./assets/backHills.png');
        }
        else if (random <= 0.7) {
            this.image = CanvasUtil.loadNewImage('./assets/background.png');
        }
        else {
            this.image = CanvasUtil.loadNewImage('./assets/backForest.png');
        }
        this.image.height = height;
        this.image.width = width;
        this.posX = posX;
        this.posY = posY;
        this.angle = 0;
    }
}
//# sourceMappingURL=Background.js.map