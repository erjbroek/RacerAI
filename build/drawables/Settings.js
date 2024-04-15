import CanvasUtil from '../utilities/CanvasUtil.js';
import MouseListener from '../utilities/MouseListener.js';
export default class Settings {
    static hamburger = CanvasUtil.loadNewImage('./assets/hamburger.png');
    static save = CanvasUtil.loadNewImage('./assets/floppy.png');
    static home = CanvasUtil.loadNewImage('./assets/home.png');
    static animationDuration = 700;
    static height = window.innerHeight / 16.25;
    static goHome = false;
    static goSave = false;
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
    }
    static update(elapsed) {
        let targetHeight;
        if (this.open) {
            targetHeight = window.innerHeight / 4;
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
            targetHeight = window.innerHeight / 16.25;
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
        CanvasUtil.fillCircle(canvas, canvas.width * 0.96, canvas.height / 16.25, canvas.width / 60, 100, 255, 160, 1);
    }
}
//# sourceMappingURL=Settings.js.map