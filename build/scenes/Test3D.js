import { Game } from '../GameLoop.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import TestScene from './TestScene.js';
export default class Test3D extends Game {
    canvas;
    keyListener;
    mouseListener;
    currentScene;
    constructor() {
        super();
        this.currentScene = new TestScene();
    }
    processInput() {
        this.currentScene.processInput(this.keyListener);
    }
    update(elapsed) {
        const nextScene = this.currentScene.update(elapsed);
        if (nextScene !== null)
            this.currentScene = nextScene;
        return true;
    }
    render() {
        CanvasUtil.clearCanvas(this.canvas);
        this.currentScene.render(this.canvas);
    }
}
//# sourceMappingURL=Test3D.js.map