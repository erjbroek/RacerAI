import CanvasUtil from '../utilities/CanvasUtil.js';
import BackgroundItems from './BackgroundItems.js';
export default class GrassDark extends BackgroundItems {
    constructor(posX, posY) {
        super();
        this.image = CanvasUtil.loadNewImage('./assets/grassDark.png');
        this.image.width *= 2;
        this.image.height *= 2;
        this.posX = posX;
        this.posY = posY;
    }
}
//# sourceMappingURL=GrassDark.js.map