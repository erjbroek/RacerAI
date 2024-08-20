import MouseListener from './MouseListener.js';
import CanvasUtil from './CanvasUtil.js';
export default class UI {
    static hoverPauze = false;
    static holdingPauze = false;
    static pauzeGame = false;
    static readyClickPauze = false;
    static hoverSettings = false;
    static holdingSettings = false;
    static openSettings = false;
    static readyClickSettings = false;
    static settings = CanvasUtil.loadNewImage('./assets/settings.png');
    static cars;
    static processInput() {
        if (MouseListener.mouseHover(window.innerWidth / 30 + window.innerWidth - window.innerWidth / 5 - window.innerWidth / 22, window.innerHeight / 12 + window.innerHeight / 70, window.innerHeight / 13, window.innerHeight / 13)) {
            UI.hoverSettings = true;
            if (MouseListener.isButtonDown(0)) {
                UI.holdingSettings = true;
                UI.readyClickSettings = true;
            }
            if (UI.readyClickSettings && !MouseListener.isButtonDown(0)) {
                UI.openSettings = !UI.openSettings;
                UI.holdingSettings = false;
                UI.readyClickSettings = false;
            }
        }
        else {
            UI.readyClickSettings = false;
            UI.hoverSettings = false;
        }
        if (MouseListener.mouseHover(window.innerWidth / 30 + window.innerWidth - window.innerWidth / 5 - window.innerWidth / 22, window.innerHeight / 5.5, window.innerHeight / 13, window.innerHeight / 13)) {
            UI.hoverPauze = true;
            if (MouseListener.isButtonDown(0)) {
                UI.holdingPauze = true;
                UI.readyClickPauze = true;
            }
            if (UI.readyClickPauze && !MouseListener.isButtonDown(0)) {
                UI.pauzeGame = !UI.pauzeGame;
                UI.holdingPauze = false;
                UI.readyClickPauze = false;
            }
        }
        else {
            UI.readyClickPauze = false;
            UI.hoverPauze = false;
        }
    }
    static renderSettings(canvas, generation) {
        CanvasUtil.fillRectangleWithGradient(canvas, canvas.width / 30, canvas.height / 12, canvas.width - canvas.width / 5, canvas.height - canvas.height / 7.5, [
            {
                red: 20, green: 10, blue: 0, opacity: 0.65, stop: 1,
            },
            {
                red: 0, green: 10, blue: 20, opacity: 0.65, stop: 0,
            },
        ], 90, 10);
        CanvasUtil.fillRectangle(canvas, canvas.width / 30, canvas.height / 12, canvas.width - canvas.width / 5, canvas.height - canvas.height / 7.5, 255, 255, 255, 0.4, 20);
        CanvasUtil.drawRectangle(canvas, canvas.width / 30, canvas.height / 12, canvas.width - canvas.width / 5, canvas.height - canvas.height / 7.5, 200, 200, 200, 1, 5, 20);
        CanvasUtil.fillRectangle(canvas, canvas.width / 30, canvas.height / 12, canvas.width - canvas.width / 5, canvas.height - canvas.height / 7.5, 0, 0, 0, 0.2, 20);
        if (UI.holdingSettings) {
            CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 12 + canvas.height / 70, canvas.height / 13, canvas.height / 13, 0, 0, 0, 0.5, 20);
        }
        else if (UI.hoverSettings) {
            CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 12 + canvas.height / 70, canvas.height / 13, canvas.height / 13, 0, 0, 0, 0.3, 20);
        }
        else {
            CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 12 + canvas.height / 70, canvas.height / 13, canvas.height / 13, 0, 0, 0, 0.2, 20);
        }
        CanvasUtil.fillRectangle(canvas, canvas.width / 1.24, canvas.height / 9, canvas.height / 400, canvas.height / 20, 255, 255, 255, 1, 0, 45);
        CanvasUtil.fillRectangle(canvas, canvas.width / 1.24, canvas.height / 9, canvas.height / 400, canvas.height / 20, 255, 255, 255, 1, 0, 315);
        CanvasUtil.writeText(canvas, `Generation ${generation}`, canvas.width / 2.4, canvas.height / 6, 'center', 'system-ui', 40, 'white');
    }
    static renderUI(canvas) {
        CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width / 30, canvas.height, 30, 30, 30);
        CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width, canvas.height / 12, 30, 30, 30);
        CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6, 0, canvas.width / 6, canvas.height, 30, 30, 30);
        CanvasUtil.fillRectangle(canvas, 0, canvas.height - canvas.height / 20, canvas.width, canvas.height / 20, 30, 30, 30);
        CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6.5, canvas.height / 20, canvas.width / 5 - canvas.width / 18, canvas.height / 1.111, 255, 255, 255, 0.2, 20);
    }
    static renderButtons(canvas) {
        if (UI.holdingPauze) {
            CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 5.5, canvas.height / 13, canvas.height / 13, 0, 0, 0, 0.5, 20);
        }
        else if (UI.hoverPauze) {
            CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 5.5, canvas.height / 13, canvas.height / 13, 0, 0, 0, 0.3, 20);
        }
        else {
            CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 5.5, canvas.height / 13, canvas.height / 13, 0, 0, 0, 0.2, 20);
        }
        const dashWidth = canvas.height / 130;
        const dashHeight = canvas.height / 30;
        const dashX = canvas.width / 28 + canvas.width - canvas.width / 5 - canvas.width / 22 + (canvas.height / 13 - dashWidth) / 3;
        const dashY = canvas.height / 5.5 + (canvas.height / 13 - dashHeight) / 2;
        CanvasUtil.fillRectangle(canvas, dashX, dashY, dashWidth, dashHeight, 255, 255, 255, 0.7);
        CanvasUtil.fillRectangle(canvas, dashX + dashWidth + dashWidth, dashY, dashWidth, dashHeight, 255, 255, 255, 0.7);
        if (UI.pauzeGame) {
            CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 5.5, canvas.height / 13, canvas.height / 13, 0, 70, 0, 0.4, 20);
            CanvasUtil.drawRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 5.5, canvas.height / 13, canvas.height / 13, 0, 120, 0, 1, 5, 20);
        }
        if (UI.holdingSettings) {
            CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 12 + canvas.height / 70, canvas.height / 13, canvas.height / 13, 0, 0, 0, 0.5, 20);
        }
        else if (UI.hoverSettings) {
            CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 12 + canvas.height / 70, canvas.height / 13, canvas.height / 13, 0, 0, 0, 0.3, 20);
        }
        else {
            CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 12 + canvas.height / 70, canvas.height / 13, canvas.height / 13, 0, 0, 0, 0.2, 20);
        }
        if (!UI.openSettings) {
            CanvasUtil.drawImage(canvas, this.settings, canvas.width / 25 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 12 + canvas.height / 40, canvas.height / 20, canvas.height / 20, 0, 0.7);
        }
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