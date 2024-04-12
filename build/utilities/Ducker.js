import { Game } from './GameLoop.js';
import CanvasUtil from './CanvasUtil.js';
import KeyListener from './KeyListener.js';
import MouseListener from './MouseListener.js';
import Cookies from '../ui/Cookies.js';
import Save from '../scenes/Save.js';
import HandleScore from '../ui/HandleScore.js';
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
        Cookies.loadStatsFromCookieSlot(1);
        this.currentScene = new Save();
    }
    processInput() {
        this.currentScene.processInput(this.keyListener, this.mouseListener);
    }
    update(elapsed) {
        HandleScore.calculatePlayTime(elapsed);
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