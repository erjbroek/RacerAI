import MouseListener from './MouseListener.js';
import CanvasUtil from './CanvasUtil.js';
export default class UI {
    static hoverPauze = false;
    static holdingPauze = false;
    static pauzeGame = false;
    static readyClick = false;
    static cars;
    static processInput() {
        if (MouseListener.mouseHover(window.innerWidth / 30 + window.innerWidth - window.innerWidth / 5 - window.innerWidth / 22, window.innerHeight / 12 + window.innerHeight / 70, window.innerHeight / 13, window.innerHeight / 13)) {
            UI.hoverPauze = true;
            if (MouseListener.isButtonDown(0)) {
                UI.holdingPauze = true;
                UI.readyClick = true;
            }
            if (UI.readyClick && !MouseListener.isButtonDown(0)) {
                UI.pauzeGame = !UI.pauzeGame;
                UI.holdingPauze = false;
                UI.readyClick = false;
            }
        }
        else {
            UI.readyClick = false;
            UI.hoverPauze = false;
        }
    }
    static renderUI(canvas) {
        CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width / 30, canvas.height, 30, 30, 30);
        CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width, canvas.height / 12, 30, 30, 30);
        CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6, 0, canvas.width / 6, canvas.height, 30, 30, 30);
        CanvasUtil.fillRectangle(canvas, 0, canvas.height - canvas.height / 20, canvas.width, canvas.height / 20, 30, 30, 30);
        CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6.5, canvas.height / 20, canvas.width / 5 - canvas.width / 18, canvas.height / 1.111, 255, 255, 255, 0.2, 20);
    }
    static renderPauze(canvas) {
        if (UI.holdingPauze) {
            CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 12 + canvas.height / 70, canvas.height / 13, canvas.height / 13, 0, 0, 0, 0.5, 20);
        }
        else if (UI.hoverPauze) {
            CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 12 + canvas.height / 70, canvas.height / 13, canvas.height / 13, 0, 0, 0, 0.3, 20);
        }
        else {
            CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 12 + canvas.height / 70, canvas.height / 13, canvas.height / 13, 0, 0, 0, 0.2, 20);
        }
        if (UI.pauzeGame) {
            CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 12 + canvas.height / 70, canvas.height / 13, canvas.height / 13, 0, 70, 0, 0.4, 20);
            CanvasUtil.drawRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 12 + canvas.height / 70, canvas.height / 13, canvas.height / 13, 0, 120, 0, 1, 5, 20);
        }
        const dashWidth = canvas.height / 130;
        const dashHeight = canvas.height / 30;
        const dashX = canvas.width / 28 + canvas.width - canvas.width / 5 - canvas.width / 22 + (canvas.height / 13 - dashWidth) / 3;
        const dashY = canvas.height / 12 + canvas.height / 70 + (canvas.height / 13 - dashHeight) / 2;
        CanvasUtil.fillRectangle(canvas, dashX, dashY, dashWidth, dashHeight, 255, 255, 255, 0.7);
        CanvasUtil.fillRectangle(canvas, dashX + dashWidth + dashWidth, dashY, dashWidth, dashHeight, 255, 255, 255, 0.7);
    }
    static renderTrack(canvas, track, radius) {
        CanvasUtil.fillCanvas(canvas, 'black');
        CanvasUtil.fillRectangle(canvas, canvas.width / 30, canvas.height / 12, canvas.width - canvas.width / 5, canvas.height - canvas.height / 7.5, 255, 255, 255, 1, 20);
        track.forEach((trackPiece) => {
            CanvasUtil.fillCircle(canvas, trackPiece[0], trackPiece[1], radius, 20 / (trackPiece[2] + 0.1), 0, 0);
        });
    }
}
//# sourceMappingURL=UI.js.map