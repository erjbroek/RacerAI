import CanvasUtil from '../utilities/CanvasUtil.js';
import MouseListener from '../utilities/MouseListener.js';
export default class Menu {
    static hamburger = CanvasUtil.loadNewImage('./assets/hamburger.png');
    static save = CanvasUtil.loadNewImage('./assets/floppy.png');
    static home = CanvasUtil.loadNewImage('./assets/home.png');
    static cart = CanvasUtil.loadNewImage('./assets/cart.png');
    static goSave = false;
    static goShop = false;
    static goHome = false;
    static animationDuration = 700;
    static height = window.innerHeight / 15;
    static opened = false;
    static open = false;
    static close = false;
    static processInput() {
        if (MouseListener.circlePressed(0, window.innerWidth * 0.96, window.innerWidth / 30, window.innerHeight / 20)) {
            if (!this.opened) {
                this.open = true;
            }
            else {
                this.close = true;
            }
        }
        if (this.opened) {
            if (MouseListener.circleDown(0, window.innerWidth * 0.96, window.innerHeight / 6.5, window.innerWidth / 50)) {
                this.goSave = true;
            }
            else {
                this.goSave = false;
            }
            if (MouseListener.circleDown(0, window.innerWidth * 0.96, window.innerHeight / 4.18, window.innerWidth / 50)) {
                this.goShop = true;
            }
            else {
                this.goShop = false;
            }
            if (MouseListener.circleDown(0, window.innerWidth * 0.96, window.innerHeight / 3.08, window.innerWidth / 50)) {
                this.goHome = true;
            }
            else {
                this.goHome = false;
            }
        }
        return this;
    }
    static update(elapsed) {
        let targetHeight;
        if (this.open) {
            targetHeight = window.innerHeight / 3.08;
            if (!this.opened) {
                this.height = this.lerp(this.height, targetHeight, elapsed / this.animationDuration);
                this.animationDuration -= elapsed;
                if (this.height >= targetHeight) {
                    this.opened = true;
                    this.open = false;
                    this.animationDuration = 700;
                    this.height = targetHeight;
                }
            }
        }
        else if (this.close) {
            targetHeight = window.innerHeight / 15;
            if (this.opened) {
                this.height = this.lerp(this.height, targetHeight, elapsed / this.animationDuration);
                this.animationDuration -= elapsed;
                if (this.height <= targetHeight) {
                    this.opened = false;
                    this.close = false;
                    this.animationDuration = 700;
                    this.height = targetHeight;
                }
            }
        }
    }
    static lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }
    static renderSettings(canvas) {
        CanvasUtil.fillCircle(canvas, canvas.width * 0.96, canvas.height / 15, canvas.width / 40, 30, 200, 80, 1);
        CanvasUtil.fillRectangle(canvas, canvas.width * 0.935, canvas.height / 15, canvas.width / 20, this.height - window.innerHeight / 16.25, 30, 200, 80, 1, 0);
        CanvasUtil.fillCircle(canvas, canvas.width * 0.96, this.height, canvas.width / 40, 30, 200, 80, 1);
        CanvasUtil.fillCircle(canvas, canvas.width * 0.96, canvas.height / 15, canvas.width / 50, 100, 255, 160, 1);
        CanvasUtil.drawImage(canvas, this.hamburger, canvas.width * 0.949, canvas.height / 21, canvas.width / 45, canvas.height / 26);
        if (this.opened && !this.close) {
            CanvasUtil.fillCircle(canvas, canvas.width * 0.96, canvas.height / 6.5, canvas.width / 50, 0, 0, 0, 0.2);
            CanvasUtil.fillCircle(canvas, canvas.width * 0.96, canvas.height / 4.18, canvas.width / 50, 0, 0, 0, 0.2);
            CanvasUtil.fillCircle(canvas, canvas.width * 0.96, canvas.height / 3.08, canvas.width / 50, 0, 0, 0, 0.2);
            CanvasUtil.drawImage(canvas, this.save, canvas.width * 0.946, canvas.height / 8, canvas.width / 35, canvas.height / 17);
            CanvasUtil.drawImage(canvas, this.cart, canvas.width * 0.937, canvas.height / 5, canvas.width / 22, canvas.height / 12);
            CanvasUtil.drawImage(canvas, this.home, canvas.width * 0.944, canvas.height / 3.4, canvas.width / 30, canvas.height / 17);
        }
    }
}
//# sourceMappingURL=Menu.js.map