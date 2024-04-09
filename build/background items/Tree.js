import CanvasUtil from '../utilities/CanvasUtil.js';
import BackgroundItems from './BackgroundItems.js';
export default class Tree extends BackgroundItems {
    constructor(posX, bottom) {
        super();
        const random = Math.random();
        if (random >= 2 / 3) {
            this.image = CanvasUtil.loadNewImage('./assets/tree1.png');
            this.image.width *= 1.1;
            this.image.height *= 1.1;
        }
        else if (random >= 1 / 3) {
            this.image = CanvasUtil.loadNewImage('./assets/tree2.png');
            this.image.width *= 1.4;
            this.image.height *= 1.4;
        }
        else {
            this.image = CanvasUtil.loadNewImage('./assets/tree3.png');
            this.image.width *= 1.2;
            this.image.height *= 1.5;
        }
        this.posX = posX;
        this.posY = bottom - this.image.height + window.innerHeight / 10;
    }
}
//# sourceMappingURL=Tree.js.map