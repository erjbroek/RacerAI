import HandleStats from "../ui/HandleStats.js";
import CanvasUtil from "../utilities/CanvasUtil.js";
import Drawable from "./Drawable.js";
export default class Coin extends Drawable {
    value;
    coinType;
    range = 0;
    height = 0;
    constructor(posX, bottom) {
        super();
        this.posX = posX;
        const random = Math.random();
        const spawnChances = Math.random() ** 0.5;
        if (random <= 0.33) {
            this.range = window.innerHeight;
            this.height = 0;
            this.image = CanvasUtil.loadNewImage('./assets/bronzeCoin.png');
            this.value = 2 * HandleStats.coinMult;
            this.coinType = 1;
            this.posY = bottom - (spawnChances * this.range) - this.height;
        }
        else if (random <= 0.66) {
            this.range = 2 * window.innerHeight;
            this.height = window.innerHeight * 0.5;
            this.image = CanvasUtil.loadNewImage('./assets/silverCoin.png');
            this.value = 6 * HandleStats.coinMult;
            this.coinType = 2;
            this.posY = bottom - (spawnChances * this.range) - this.height;
        }
        else {
            this.range = 9 * window.innerHeight;
            this.height = window.innerHeight;
            this.image = CanvasUtil.loadNewImage('./assets/goldCoin.png');
            this.value = 20 * HandleStats.coinMult;
            this.coinType = 3;
            this.posY -= window.innerHeight / 1.1;
            this.posY = bottom - (spawnChances * this.range) - this.height;
        }
        this.image.width = window.innerWidth / 35;
        this.image.height = window.innerWidth / 35;
        this.posY -= this.image.height / window.innerHeight / 45;
    }
    move(xSpeed, ySpeed) {
        this.posX -= xSpeed;
        this.posY -= ySpeed;
    }
}
//# sourceMappingURL=Coin.js.map