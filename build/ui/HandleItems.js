import Background from '../background items/Background.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import Coin from '../drawables/Coin.js';
export default class HandleItems {
    space;
    backgrounds;
    items;
    touchingGround;
    scoreHandler;
    touchedGround = false;
    constructor(scoreHandler) {
        this.backgrounds = [];
        this.items = [];
        this.scoreHandler = scoreHandler;
        this.backgrounds.push(new Background(0, window.innerHeight - 302 * 4, 1));
        this.space = CanvasUtil.loadNewImage('./assets/space.png');
        this.touchingGround = false;
    }
    moveItems(player, xSpeed, ySpeed) {
        if (player.posY >= window.innerHeight / 2
            || this.backgrounds[0].getPosY() + this.backgrounds[0].getHeight() < window.innerHeight) {
            this.backgrounds.forEach((background) => {
                background.move(xSpeed, 0);
                background.setPosY(window.innerHeight - background.getHeight());
            });
            this.items.forEach((item) => {
                item.move(xSpeed * 1.1, 0);
            });
            player.move(ySpeed);
        }
        else {
            this.backgrounds.forEach((background) => {
                background.move(xSpeed, ySpeed);
            });
            this.items.forEach((item) => {
                item.move(xSpeed * 1.1, ySpeed * 1.1);
            });
        }
        if (player.posY + player.image.height > window.innerHeight) {
            this.touchingGround = true;
        }
        else {
            this.touchingGround = false;
        }
    }
    addItems() {
        if (this.backgrounds.length < 2) {
            if (this.backgrounds[0].getPosX() + this.backgrounds[0].getWidth() <= window.innerWidth) {
                this.backgrounds.push(new Background(this.backgrounds[0].getPosX()
                    + this.backgrounds[0].getWidth(), this.backgrounds[0].getPosY(), Math.random()));
            }
        }
        while (this.items.filter((obj) => obj instanceof Coin).length < 10) {
            this.items.push(new Coin(window.innerWidth + (window.innerWidth + Math.random() * (window.innerWidth * 3)), (this.backgrounds[0].getPosY() + this.backgrounds[0].getHeight())));
        }
    }
    removeUnusedItems() {
        this.items.forEach((item) => {
            if (item.posX <= -1000) {
                this.items.splice(this.items.indexOf(item), 1);
            }
        });
        if (this.backgrounds[0].getPosX() + this.backgrounds[0].getWidth() <= 0) {
            this.backgrounds.splice(0, 1);
        }
    }
    collision(player, elapsed) {
        this.items.forEach((item) => {
            if (CanvasUtil.collidesWith(player, item)) {
                this.items.splice(this.items.indexOf(item), 1);
                if (item instanceof Coin) {
                    this.scoreHandler.totalCoins += item.value;
                    this.scoreHandler.addCoin(item.coinType);
                }
            }
        });
    }
    render(canvas) {
        this.backgrounds.forEach((item) => {
            item.render(canvas);
        });
        CanvasUtil.drawImage(canvas, this.space, 0, this.backgrounds[0].getPosY() - window.innerHeight * 5, window.innerWidth, window.innerHeight * 5, 0);
        this.items.forEach((item) => {
            item.render(canvas);
        });
    }
}
//# sourceMappingURL=HandleItems.js.map