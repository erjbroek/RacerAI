import { Game } from './GameLoop.js';
import CanvasUtil from './CanvasUtil.js';
import KeyListener from './KeyListener.js';
import MouseListener from './MouseListener.js';
import Cookies from '../ui/Cookies.js';
import StartingScene from '../scenes/StartingScene.js';
import Shop from '../scenes/shop/Shop.js';
import Save from '../scenes/Save.js';
import HandleScore from '../ui/HandleScore.js';
export default class Ducker extends Game {
    canvas;
    keyListener;
    mouseListener;
    currentScene;
    timer = 1000;
    cookieFound = false;
    cookieNotFound = false;
    renderFound = false;
    renderNotFound = false;
    logo = CanvasUtil.loadNewImage('./assets/introSceneBackground.png');
    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
        this.keyListener = new KeyListener();
        this.mouseListener = new MouseListener(canvas);
        let count = 0;
        let found = 0;
        for (let i = 1; i <= 3; i++) {
            if (Cookies.checkCookieForSlot(i)) {
                count += 1;
                found = i;
            }
        }
        if (count === 1) {
            this.cookieFound = true;
            Cookies.loadStatsFromCookieSlot(found);
            this.currentScene = new StartingScene();
        }
        else if (count === 0) {
            this.cookieNotFound = true;
            this.currentScene = new Save();
        }
        else {
            this.cookieFound = true;
            this.currentScene = new Save();
        }
        this.currentScene = new Shop();
    }
    processInput() {
        this.currentScene.processInput(this.keyListener, this.mouseListener);
    }
    update(elapsed) {
        if (this.cookieFound) {
            if (this.timer >= 0) {
                this.timer -= elapsed;
                this.renderFound = true;
            }
            else {
                this.renderFound = false;
            }
        }
        if (this.cookieNotFound) {
            if (this.timer >= 0) {
                this.timer -= elapsed;
                this.renderNotFound = true;
            }
            else {
                this.renderNotFound = false;
            }
        }
        HandleScore.calculatePlayTime(elapsed);
        const nextScene = this.currentScene.update(elapsed);
        if (nextScene !== null)
            this.currentScene = nextScene;
        return true;
    }
    render() {
        CanvasUtil.clearCanvas(this.canvas);
        this.currentScene.render(this.canvas);
        if (this.renderFound) {
            CanvasUtil.drawImage(this.canvas, this.logo, 0, 0, this.canvas.width, this.canvas.height);
            CanvasUtil.fillRectangle(this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, 0, 0.2, 0);
            CanvasUtil.fillRectangle(this.canvas, this.canvas.width / 3, this.canvas.height / 3, this.canvas.width / 3, this.canvas.height / 3, 30, 200, 120, 0.6, 40);
            CanvasUtil.drawRectangle(this.canvas, this.canvas.width / 3 - 10, this.canvas.height / 3 - 10, this.canvas.width / 3 + 20, this.canvas.height / 3 + 20, 0, 0, 0, 1, 10, 50);
            CanvasUtil.writeText(this.canvas, 'save data found', this.canvas.width / 2, this.canvas.height / 2, 'center', 'arial', 35, 'white');
        }
        if (this.renderNotFound) {
            CanvasUtil.drawImage(this.canvas, this.logo, 0, 0, this.canvas.width, this.canvas.height);
            CanvasUtil.fillRectangle(this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, 0, 0.2, 0);
            CanvasUtil.fillRectangle(this.canvas, this.canvas.width / 3, this.canvas.height / 3, this.canvas.width / 3, this.canvas.height / 3, 200, 100, 120, 0.6, 40);
            CanvasUtil.drawRectangle(this.canvas, this.canvas.width / 3 - 10, this.canvas.height / 3 - 10, this.canvas.width / 3 + 20, this.canvas.height / 3 + 20, 0, 0, 0, 1, 10, 50);
            CanvasUtil.writeText(this.canvas, 'No save data found', this.canvas.width / 2, this.canvas.height / 2, 'center', 'arial', 35, 'white');
        }
    }
}
//# sourceMappingURL=Ducker.js.map