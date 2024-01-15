import CanvasUtil from '../utilities/CanvasUtil.js';
export default class Finished {
    scoreHandler;
    scoreHolder = CanvasUtil.loadNewImage('./assets/scoreDisplay.png');
    processInput(keyListener, mouseListener) {
    }
    update(elapsed) {
        return this;
    }
    render(canvas, scoreHandler) {
        scoreHandler.calculateScore();
        CanvasUtil.drawImage(canvas, this.scoreHolder, window.innerWidth / 3, window.innerHeight / 3);
        CanvasUtil.writeTextToCanvas(canvas, `Distance: ${(Math.round(scoreHandler.distance * 10) / 10).toString()} meters`, window.innerWidth / 2.6, window.innerHeight / 2.8, 'left', 'arial', 20, 'black');
        CanvasUtil.writeTextToCanvas(canvas, `Maximum height: ${(Math.round(scoreHandler.maxHeight * 10) / 10).toString()} meters`, window.innerWidth / 2.6, window.innerHeight / 2.6, 'left', 'arial', 20, 'black');
        CanvasUtil.writeTextToCanvas(canvas, `Final score: ${(Math.round(scoreHandler.score * 10) / 10).toString()}`, window.innerWidth / 2.6, window.innerHeight / 2.4, 'left', 'arial', 20, 'black');
    }
}
//# sourceMappingURL=Finished.js.map