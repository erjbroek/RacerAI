import CanvasUtil from '../utilities/CanvasUtil.js';
import Scene from './Scene.js';
export default class Choose extends Scene {
    background;
    upgrade;
    continue;
    constructor() {
        super();
    }
    processInput(keyListener, mouseListener) {
    }
    update(elapsed) {
        return this;
    }
    render(canvas) {
        CanvasUtil.fillCanvas(canvas, '#7cc7b9');
    }
}
//# sourceMappingURL=Choose.js.map