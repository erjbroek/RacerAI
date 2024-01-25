import CanvasUtil from '../utilities/CanvasUtil.js';
export default class Finished {
    scoreHolder = CanvasUtil.loadNewImage('./assets/scoreDisplay.png');
    processInput(keyListener, mouseListener) {
    }
    update() {
        return this;
    }
    render(canvas, scoreHandler) {
        scoreHandler.calculateScore();
        CanvasUtil.drawImage(canvas, this.scoreHolder, window.innerWidth / 3, window.innerHeight / 3);
        CanvasUtil.writeTextToCanvas(canvas, `Distance: ${(Math.round(scoreHandler.distance * 10) / 10).toString()} meter`, window.innerWidth / 2.6, window.innerHeight / 2.3, 'left', 'arial', 20, 'black');
        CanvasUtil.writeTextToCanvas(canvas, `Max height: ${(Math.round(scoreHandler.maxHeight * 10) / 10).toString()} meter`, window.innerWidth / 2.6, window.innerHeight / 2.1, 'left', 'arial', 20, 'black');
        CanvasUtil.writeTextToCanvas(canvas, `Final score: ${(Math.round(scoreHandler.score * 10) / 10).toString()}`, window.innerWidth / 2.6, window.innerHeight / 1.6, 'left', 'arial', 20, 'black');
        CanvasUtil.writeTextToCanvas(canvas, `Coins: ${(scoreHandler.totalCoins).toString()}`, window.innerWidth / 1.7, window.innerHeight / 2.3, 'left', 'arial', 20, 'black');
        CanvasUtil.writeTextToCanvas(canvas, `Bronze Coins: ${(scoreHandler.bronzeCoins).toString()}`, window.innerWidth / 1.7, window.innerHeight / 2.1, 'left', 'arial', 15, 'black');
        CanvasUtil.writeTextToCanvas(canvas, `Silver Coins: ${(scoreHandler.silverCoins).toString()}`, window.innerWidth / 1.7, window.innerHeight / 1.95, 'left', 'arial', 15, 'black');
        CanvasUtil.writeTextToCanvas(canvas, `Gold Coins: ${(scoreHandler.goldCoins).toString()}`, window.innerWidth / 1.7, window.innerHeight / 1.83, 'left', 'arial', 15, 'black');
    }
}
//# sourceMappingURL=Finished.js.map