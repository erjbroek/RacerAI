import { Game } from './GameLoop.js';
import CanvasUtil from './CanvasUtil.js';
import KeyListener from './KeyListener.js';
import MouseListener from '../ui/MouseListener.js';
import StartingScene from '../scenes/StartingScene.js';
export default class Ducker extends Game {
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
        this.currentScene = new StartingScene(this.canvas.height, this.canvas.width);
    }
    processInput() {
        this.currentScene.processInput(this.keyListener, this.mouseListener);
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
//# sourceMappingURL=Ducker.js.map