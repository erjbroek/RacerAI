import { Game } from './GameLoop.js';
import CanvasUtil from './CanvasUtil.js';
import KeyListener from './KeyListener.js';
import MouseListener from './MouseListener.js';
import DrawTrack from '../scenes/DrawTrack.js';
export default class Racer extends Game {
    canvas;
    keyListener;
    mouseListener;
    currentScene;
    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
        this.keyListener = new KeyListener();
        this.mouseListener = new MouseListener(canvas);
        CanvasUtil.setCanvas(this.canvas);
        this.currentScene = new DrawTrack();
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
//# sourceMappingURL=Racer.js.map