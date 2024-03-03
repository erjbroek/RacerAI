import CanvasUtil from '../utilities/CanvasUtil.js';
import Obstacle from './Obstacle.js';
export default class Mushroom extends Obstacle {
    constructor(posX, bottom) {
        super();
        this.image = CanvasUtil.loadNewImage('./assets/mushroom.png');
        this.image.height /= 6;
        this.image.width /= 6;
        this.posX = posX;
        this.posY = bottom - this.image.height - 50;
        this.speedModifierY = 20;
    }
}
//# sourceMappingURL=Mushroom.js.map