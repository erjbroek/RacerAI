import BackgroundItems from './BackgroundItems.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
export default class Background extends BackgroundItems {
    constructor(posX, posY, random) {
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
        this.image.height = 302 * 4;
        this.image.width = 1080 * 4;
        this.posX = posX;
        this.posY = posY;
        this.angle = 0;
    }
}
//# sourceMappingURL=Background.js.map