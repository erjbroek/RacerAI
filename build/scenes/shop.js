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
        CanvasUtil.fillRectangle(canvas, canvas.width / 10, canvas.height / 10, canvas.width / 1.25, canvas.height / 1.25, 'lightlue', 255, 255, 255, 0.6);
        CanvasUtil.writeTextToCanvas(canvas, `Duck dollars: ${HandleScore.duckDollars} $`, 20, 20, 'left', 'arial', 20, 'black');
    }
}
//# sourceMappingURL=shop.js.map