import CanvasUtil from '../utilities/CanvasUtil.js';
import Drawable from './Drawable.js';
export default class Coin extends Drawable {
    value;
    constructor(posX, posY) {
        super();
        this.posX = posX;
        this.posY = posY;
        const random = Math.random();
        if (random >= 0) {
            this.image = CanvasUtil.loadNewImage('./assets/bronzeCoin.png');
            this.value = 1;
        }
        this.image.width = window.innerWidth / 30;
        this.image.height = window.innerWidth / 30;
    }
    move(xSpeed, ySpeed) {
        this.posX -= xSpeed;
        this.posY -= ySpeed;
    }
}
//# sourceMappingURL=Coin.js.map