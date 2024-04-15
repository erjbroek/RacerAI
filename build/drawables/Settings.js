import CanvasUtil from '../utilities/CanvasUtil.js';
import MouseListener from '../utilities/MouseListener.js';
export default class Settings {
    static cog = CanvasUtil.loadNewImage('./assets/cog.png');
    static save = CanvasUtil.loadNewImage('./assets/floppy.png');
    static home = CanvasUtil.loadNewImage('./assets/home.png');
    static animationDuration = 500;
    static height = 1;
    static goHome = false;
    static goSave = false;
    static opened = false;
    static open = false;
    static close = false;
    static processInput() {
        if (MouseListener.circlePressed(0, window.innerWidth * 0.975, window.innerWidth / 40, window.innerHeight / 40)) {
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
            targetHeight = window.innerHeight / 5;
            if (!this.opened) {
                this.height = this.lerp(this.height, targetHeight, elapsed / this.animationDuration);
                this.animationDuration -= elapsed;
                if (this.height >= targetHeight) {
                    this.opened = true;
                    this.open = false;
                    this.animationDuration = 500;
                }
            }
        }
        else if (this.close) {
            targetHeight = 0;
            if (this.opened) {
                this.height = this.lerp(this.height, targetHeight, elapsed / this.animationDuration);
                this.animationDuration -= elapsed;
                if (this.height <= targetHeight) {
                    this.opened = false;
                    this.close = false;
                    this.animationDuration = 500;
                }
            }
        }
    }
    static lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }
    static renderSettings(canvas) {
        CanvasUtil.fillCircle(canvas, canvas.width * 0.975, canvas.width / 40, canvas.height / 40, 30, 200, 80, 1);
        CanvasUtil.fillRectangle(canvas, canvas.width * 0.975, canvas.width / 40, canvas.width / 20, this.height, 30, 200, 80, 1);
    }
}
//# sourceMappingURL=Settings.js.map