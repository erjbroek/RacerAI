import Coin from '../drawables/Coin.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
export default class HandleItems {
    coins;
    handleScore;
    constructor(handleScore) {
        this.coins = [];
        this.handleScore = handleScore;
    }
    move(player, xSpeed, ySpeed) {
        if (player.posY >= window.innerHeight / 2) {
            this.coins.forEach((coin) => {
                coin.move(xSpeed, 0);
            });
            player.move(ySpeed);
        }
        else {
            this.coins.forEach((coin) => {
                coin.move(xSpeed, ySpeed);
            });
        }
    }
    update() {
        this.coins.forEach((coin) => {
            if (coin.posX <= -1000) {
                this.coins.splice(this.coins.indexOf(coin), 1);
            }
        });
        if (this.coins.length < 100) {
            this.coins.push(new Coin(window.innerWidth + ((Math.random() * (window.innerWidth / 1.5) - window.innerHeight / 5)) * 2, Math.random() * (window.innerHeight)));
        }
    }
    collision(player) {
        this.coins.forEach((coin) => {
            if (CanvasUtil.collidesWith(player, coin)) {
                this.handleScore.coins += 1;
                this.coins.splice(this.coins.indexOf(coin), 1);
            }
        });
    }
    render(canvas) {
        this.coins.forEach((coin) => {
            coin.render(canvas);
        });
    }
}
//# sourceMappingURL=HandleItems.js.map