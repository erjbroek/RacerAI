import CanvasUtil from '../utilities/CanvasUtil.js';
import BackgroundItems from './BackgroundItems.js';
export default class GrassLight extends BackgroundItems {
    constructor(posX, posY) {
        super();
        this.image = CanvasUtil.loadNewImage('./assets/grassLight.png');
        this.image.width *= 2;
        this.image.height *= 2;
        this.posX = posX;
        this.posY = posY;
    }
}
//# sourceMappingURL=GrassLight.js.map