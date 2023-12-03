import CanvasUtil from '../utilities/CanvasUtil.js';
export default class Finished {
    constructor(maxX, maxY) {
    }
    processInput(keyListener, mouseListener) {
    }
    update(elapsed) {
        return this;
    }
    render(canvas) {
        CanvasUtil.fillRectangle(canvas, window.innerWidth / 3, window.innerHeight / 3, window.innerWidth / 3, window.innerHeight / 3, 'black');
    }
}
//# sourceMappingURL=Finished.js.map