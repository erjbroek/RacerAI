import Coin from '../drawables/Coin.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import HandleScenery from './HandleScenery.js';
import HandleScore from './handleScore.js';
export default class HandleItems {
    static coins = [];
    static moveItems(player, xSpeed, ySpeed) {
        if (player.posY >= window.innerHeight / 2
            || HandleScenery.backgrounds[0].getPosY() + HandleScenery.backgrounds[0].getHeight() < window.innerHeight) {
            HandleItems.coins.forEach((coin) => {
                coin.move(xSpeed * 1.25, 0);
            });
            player.move(ySpeed);
        }
        else {
            HandleItems.coins.forEach((coin) => {
                coin.move(xSpeed * 1.25, ySpeed * 1.25);
            });
        }
        if (player.posY + player.image.height > window.innerHeight) {
            HandleScenery.touchingGround = true;
        }
        else {
            HandleScenery.touchingGround = false;
        }
    }
    static addItems() {
        while (HandleItems.coins.filter((obj) => obj instanceof Coin).length < 15) {
            HandleItems.coins.push(new Coin(window.innerWidth + (window.innerWidth + Math.random() * (window.innerWidth * 3)), (HandleScenery.backgrounds[0].getPosY() + HandleScenery.backgrounds[0].getHeight()) - 70));
        }
    }
    static removeUnusedItems() {
        HandleItems.coins.forEach((coin) => {
            if (coin.posX <= -1000) {
                HandleItems.coins.splice(HandleItems.coins.indexOf(coin), 1);
            }
        });
    }
    static collision(player) {
        HandleItems.coins.forEach((coin) => {
            if (CanvasUtil.collidesWith(player, coin)) {
                HandleScore.totalCoins += coin.value;
                HandleScore.addCoin(coin.coinType);
                HandleItems.coins.splice(HandleItems.coins.indexOf(coin), 1);
            }
        });
    }
    static render(canvas) {
        HandleItems.coins.forEach((coin) => {
            coin.render(canvas);
        });
    }
    static reset() {
        HandleItems.coins = [];
    }
}
//# sourceMappingURL=HandleItems.js.map