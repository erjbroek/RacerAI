import { Game } from '../GameLoop.js';
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
        const context = this.canvas.getContext('2d');
        context.font = '20px System-ui';
        if (KeyListener.isKeyDown('ControlLeft')) {
            context.fillText(`X - ${(MouseListener.mouseCoordinates.x / window.innerWidth).toFixed(3)}`, window.innerWidth / 20, window.innerHeight / 1.02);
            context.fillText(`Y - ${(MouseListener.mouseCoordinates.y / window.innerHeight).toFixed(3)}`, window.innerWidth / 10, window.innerHeight / 1.02);
        }
    }
}
//# sourceMappingURL=Racer.js.map