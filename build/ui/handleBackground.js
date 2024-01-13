import Background from '../background items/Background.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
export default class HandleBackground {
    space;
    backgrounds;
    touchingGround;
    touchedGround = false;
    constructor() {
        this.backgrounds = [];
        this.backgrounds.push(new Background(0, window.innerHeight - 302 * 4, 1));
        this.space = CanvasUtil.loadNewImage('./assets/space.png');
        this.touchingGround = false;
    }
    moveBackground(player, xSpeed, ySpeed) {
        if (player.posY >= window.innerHeight / 2
            || this.backgrounds[0].getPosY() + this.backgrounds[0].getHeight() < window.innerHeight) {
            this.backgrounds.forEach((background) => {
                background.move(xSpeed, 0);
            });
            player.move(ySpeed);
        }
        else {
            this.backgrounds.forEach((background) => {
                background.move(xSpeed, ySpeed);
            });
        }
        if (this.backgrounds.length < 2) {
            if (this.backgrounds[0].getPosX() + this.backgrounds[0].getWidth() <= window.innerWidth) {
                this.backgrounds.push(new Background(this.backgrounds[0].getPosX()
                    + this.backgrounds[0].getWidth(), this.backgrounds[0].getPosY(), Math.random()));
            }
        }
        if (this.backgrounds[0].getPosX() + this.backgrounds[0].getWidth() <= 0) {
            this.backgrounds.splice(0, 1);
        }
        if (player.posY + player.image.height > window.innerHeight) {
            this.touchingGround = true;
        }
        else {
            this.touchingGround = false;
        }
    }
    getPosY() {
        return this.backgrounds[0].getPosY();
    }
    setPosY(height) {
        return this.backgrounds[0].setPosY(height);
    }
    getHeight() {
        return this.backgrounds[0].getHeight();
    }
    isTouchingGround() {
        return this.touchingGround;
    }
    render(canvas) {
        this.backgrounds.forEach((item) => {
            item.render(canvas);
        });
        CanvasUtil.drawImage(canvas, this.space, 0, this.backgrounds[0].getPosY() - window.innerHeight * 5, window.innerWidth, window.innerHeight * 5, 0);
    }
}
//# sourceMappingURL=HandleBackground.js.map