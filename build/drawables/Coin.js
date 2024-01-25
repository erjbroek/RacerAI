import CanvasUtil from '../utilities/CanvasUtil.js';
import Drawable from './Drawable.js';
export default class Coin extends Drawable {
    value;
    coinType;
    constructor(posX, bottom) {
        super();
        this.posX = posX;
        const random = Math.random();
        if (random <= 0.45) {
            this.image = CanvasUtil.loadNewImage('./assets/bronzeCoin.png');
            this.value = 1;
            this.coinType = 1;
            this.posY = bottom - Math.random() * window.innerHeight;
        }
        else if (random <= 0.7) {
            this.image = CanvasUtil.loadNewImage('./assets/silverCoin.png');
            this.value = 5;
            this.coinType = 2;
            this.posY = bottom - (Math.random() * 2 * window.innerHeight) - window.innerHeight / 2;
        }
        else {
            this.image = CanvasUtil.loadNewImage('./assets/goldCoin.png');
            this.value = 15;
            this.coinType = 3;
            this.posY -= window.innerHeight / 1.1;
            this.posY = bottom - (Math.random() * 9 * window.innerHeight) - window.innerHeight;
        }
        this.image.width = window.innerWidth / 40;
        this.image.height = window.innerWidth / 40;
        this.posY -= this.image.height / window.innerHeight / 60;
    }
    move(xSpeed, ySpeed) {
        this.posX -= xSpeed;
        this.posY -= ySpeed;
    }
}
//# sourceMappingURL=Coin.js.map