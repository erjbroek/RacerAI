import HandleScore from '../ui/handleScore.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import Choose from './Choose.js';
import Scene from './Scene.js';
export default class Shop extends Scene {
    backgroundImage = CanvasUtil.loadNewImage('/assets/introSceneBackground.png');
    back = false;
    constructor() {
        super();
    }
    processInput(keyListener, mouseListener) {
        if (keyListener.keyPressed('Space')) {
            this.back = true;
        }
    }
    update(elapsed) {
        if (this.back) {
            return new Choose();
        }
        return null;
    }
    render(canvas) {
        CanvasUtil.drawImage(canvas, this.backgroundImage, 0, 0, canvas.width, canvas.height, 0);
        CanvasUtil.fillRectangle(canvas, canvas.width / 10, canvas.height / 9, canvas.width / 1.25, canvas.height / 1.25, 255, 255, 255, 0.6);
        CanvasUtil.fillRectangle(canvas, canvas.width / 10 + 30, canvas.height / 3.4 + 30, canvas.width / 2.5 - 30, canvas.height / 5 - 30, 0, 200, 0, 0.6);
        CanvasUtil.fillRectangle(canvas, canvas.width / 2.05 + 30, canvas.height / 3.4 + 30, canvas.width / 2.5 - 30, canvas.height / 5 - 30, 0, 200, 40, 0.6);
        CanvasUtil.fillRectangle(canvas, canvas.width / 10 + 30, canvas.height / 2.05 + 30, canvas.width / 2.5 - 30, canvas.height / 5 - 30, 0, 200, 80, 0.6);
        CanvasUtil.fillRectangle(canvas, canvas.width / 2.05 + 30, canvas.height / 2.05 + 30, canvas.width / 2.5 - 30, canvas.height / 5 - 30, 0, 200, 120, 0.6);
        CanvasUtil.fillRectangle(canvas, canvas.width / 10 + 30, canvas.height / 1.46 + 30, canvas.width / 2.5 - 30, canvas.height / 5 - 30, 0, 200, 160, 0.6);
        CanvasUtil.fillRectangle(canvas, canvas.width / 2.05 + 30, canvas.height / 1.46 + 30, canvas.width / 2.5 - 30, canvas.height / 5 - 30, 0, 200, 200, 0.6);
        CanvasUtil.writeTextToCanvas(canvas, `Duck dollars: ${HandleScore.duckDollars} $`, 20, 20, 'left', 'arial', 20, 'black');
    }
}
//# sourceMappingURL=shop.js.map