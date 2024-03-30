import HandleScore from '../ui/handleScore.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import Choose from './Choose.js';
import Scene from './Scene.js';
export default class Shop extends Scene {
    backgroundImage = CanvasUtil.loadNewImage('/assets/introSceneBackground.png');
    back = false;
    tileSize = window.innerWidth / 7.5;
    tilePosX = window.innerWidth / 10 + 30;
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
        CanvasUtil.fillRectangle(canvas, 0, canvas.height / 5, canvas.width, canvas.height, 255, 255, 255, 0.6);
        CanvasUtil.fillRectangle(canvas, canvas.width / 9.5, canvas.height / 3.2, canvas.width / 2.2, canvas.height / 1.57, 200, 200, 200, 0.6);
        CanvasUtil.fillRectangle(canvas, this.tilePosX, canvas.height / 3.3 + 30, this.tileSize, this.tileSize, 30, 175, 0, 0.6);
        CanvasUtil.fillRectangle(canvas, this.tilePosX, canvas.height / 1.6 + 30, this.tileSize, this.tileSize, 30, 175, 0, 0.6);
        CanvasUtil.fillRectangle(canvas, this.tilePosX + this.tileSize + 30, canvas.height / 3.3 + 30, this.tileSize, this.tileSize, 30, 175, 0, 0.6);
        CanvasUtil.fillRectangle(canvas, this.tilePosX + this.tileSize + 30, canvas.height / 1.6 + 30, this.tileSize, this.tileSize, 30, 175, 0, 0.6);
        CanvasUtil.fillRectangle(canvas, this.tilePosX + (this.tileSize + 30) * 2, canvas.height / 3.3 + 30, this.tileSize, this.tileSize, 30, 175, 0, 0.6);
        CanvasUtil.fillRectangle(canvas, canvas.width / 1.7, canvas.height / 3.2, canvas.width / 3, canvas.height / 1.57, 200, 200, 200, 0.6);
        CanvasUtil.fillRectangle(canvas, canvas.width / 1.7, canvas.height / 3.2, canvas.width / 3, canvas.height / 1.57, 200, 200, 200, 0.6);
        CanvasUtil.writeTextToCanvas(canvas, `Duck dollars: ${HandleScore.duckDollars} $`, 20, 20, 'left', 'arial', 20, 'black');
    }
}
//# sourceMappingURL=shop.js.map