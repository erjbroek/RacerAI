import HandleScore from '../ui/HandleScore.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
export default class Finished {
    opacity = 0.0;
    totalTime = 0;
    transitionTime = 2000;
    processInput(keyListener, mouseListener) {
        if (keyListener.isKeyDown('Space') || keyListener.isKeyDown('Enter') || mouseListener.buttonPressed(0)) {
            return true;
        }
        return false;
    }
    update(elapsed) {
        this.totalTime >= this.transitionTime ? this.totalTime = this.transitionTime : this.totalTime += elapsed;
        this.opacity = (this.totalTime / this.transitionTime);
    }
    endRound(canvas) {
        HandleScore.calculateScore();
        CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width, canvas.height, 100, 80, 150, this.opacity * 0.2);
        CanvasUtil.fillRectangle(canvas, canvas.width / 10, canvas.height / 10, canvas.width - 2 * (canvas.width / 10), canvas.height - 2 * (canvas.height / 10), 50, 50, 100, this.opacity * 0.3);
    }
}
//# sourceMappingURL=Finished.js.map