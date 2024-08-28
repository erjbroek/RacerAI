import MouseListener from './MouseListener.js';
import CanvasUtil from './CanvasUtil.js';
import Statistics from '../NetworkAlgoritm/Statistics.js';
import Slider from './Slider.js';
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
    static sliders = [];
    static loadSliders() {
        UI.sliders.push(new Slider(window.innerWidth * 0.42, window.innerHeight * 0.59, window.innerWidth * 0.127, Statistics.slightMutationRate, 1, 'Small mutation rate', 'The chance in % that a gene mutates, and randomly gets increased or decreased by 12.5%', '%'));
        UI.sliders.push(new Slider(window.innerWidth * 0.42, window.innerHeight * 0.66, window.innerWidth * 0.127, Statistics.bigMutationRate, 0.4, 'Big mutation rate', 'The chance in % that a gene gets completely randomized', '%'));
    }
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
    static renderSettings(canvas, generation, track) {
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
            CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 12 + canvas.height / 70, canvas.width / 26, canvas.height / 13, 0, 0, 0, 0.5, 20);
        }
        else if (UI.hoverSettings) {
            CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 12 + canvas.height / 70, canvas.width / 26, canvas.height / 13, 0, 0, 0, 0.3, 20);
        }
        else {
            CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 12 + canvas.height / 70, canvas.width / 26, canvas.height / 13, 0, 0, 0, 0.2, 20);
        }
        CanvasUtil.fillRectangle(canvas, canvas.width / 1.24, canvas.height / 9, canvas.height / 400, canvas.height / 20, 255, 255, 255, 1, 0, 45);
        CanvasUtil.fillRectangle(canvas, canvas.width / 1.24, canvas.height / 9, canvas.height / 400, canvas.height / 20, 255, 255, 255, 1, 0, 315);
        CanvasUtil.fillRectangle(canvas, canvas.width / 19.4, canvas.height / 9.5, canvas.width / 3.2, canvas.height / 2, 0, 0, 0, 0.3, 10);
        CanvasUtil.writeText(canvas, `Generation ${generation}`, canvas.width * 0.2, canvas.height * 0.152, 'center', 'system-ui', 30, 'white');
        CanvasUtil.writeText(canvas, `laps: ${Statistics.currentHighestLaps} / 5`, canvas.width * 0.2, canvas.height * 0.18, 'center', 'system-ui', 20, 'lightgray');
        CanvasUtil.writeText(canvas, `Gene mutation chance: ${Statistics.slightMutationRate * 100}%`, canvas.width * 0.07, canvas.height * 0.27, 'left', 'system-ui', 17, 'lightgray');
        CanvasUtil.writeText(canvas, `Gene randomizing chance: ${Math.floor(Statistics.bigMutationRate * 1000) / 10}%`, canvas.width * 0.07, canvas.height * 0.3, 'left', 'system-ui', 17, 'lightgray');
        CanvasUtil.writeText(canvas, `% of top cars surviving: ${Math.floor(Statistics.selectionPercentage * 100)}%`, canvas.width * 0.07, canvas.height * 0.33, 'left', 'system-ui', 17, 'lightgray');
        CanvasUtil.writeText(canvas, `Cars alive: ${Statistics.carsAlive}`, canvas.width * 0.23, canvas.height * 0.27, 'left', 'system-ui', 17, 'lightgray');
        CanvasUtil.writeText(canvas, `Species: ${Statistics.species}`, canvas.width * 0.23, canvas.height * 0.3, 'left', 'system-ui', 17, 'lightgray');
        CanvasUtil.writeText(canvas, `Best generation: ${Math.floor(Statistics.bestGen)}`, canvas.width * 0.23, canvas.height * 0.33, 'left', 'system-ui', 17, 'lightgray');
        if (Statistics.record != Infinity) {
            if (Math.floor(Statistics.record % 1000) < 100) {
                CanvasUtil.writeText(canvas, `Record: ${Math.floor(Statistics.record / 1000)}.0${Math.floor(Statistics.record % 1000)} s`, canvas.width * 0.23, canvas.height * 0.36, "left", "system-ui", 17, "lightgray");
            }
            else {
                CanvasUtil.writeText(canvas, `Record: ${Math.floor(Statistics.record / 1000)}.${Math.floor(Statistics.record % 1000)} s`, canvas.width * 0.23, canvas.height * 0.36, "left", "system-ui", 17, "lightgray");
            }
            CanvasUtil.fillRectangle(canvas, canvas.width * 0.2 - canvas.width * 0.08, canvas.height * 0.41, canvas.width * 0.16, canvas.height * 0.154, 0, 0, 0, 0.2, 10);
            CanvasUtil.createNetCar(canvas, Statistics.recordCar, canvas.width * 0.2, canvas.height * 0.485, 3, 90, 1);
            CanvasUtil.writeText(canvas, 'Fastest car from all generations', canvas.width * 0.2, canvas.height * 0.59, 'center', 'system-ui', 20, 'white');
        }
        else {
            CanvasUtil.writeText(canvas, `Track not beaten yet ):`, canvas.width * 0.23, canvas.height * 0.36, "left", "system-ui", 17, "lightgrey");
        }
        const startX = canvas.width * 0.4;
        const startY = canvas.height * 0.108;
        const width = canvas.width * 0.35;
        const height = canvas.height * 0.35;
        CanvasUtil.fillRectangle(canvas, startX, startY, width, height, 255, 255, 255, 0.5, 20, 0);
        track.road.forEach((trackPiece) => {
            const updatedPosX = trackPiece[0] * 0.35 + startX;
            const updatedPosY = trackPiece[1] * 0.35 + startY;
            CanvasUtil.fillCircle(canvas, updatedPosX, updatedPosY, track.radius * 0.35, 0, 0, 0, 1);
        });
        for (let i = 0; i < track.deathPositions.length - 1; i++) {
            CanvasUtil.fillCircle(canvas, startX + track.deathPositions[i][0] * 0.35, startY + track.deathPositions[i][1] * 0.35, track.radius * 0.35, 255, 0, 0, 0.3);
        }
        CanvasUtil.writeText(canvas, 'Heatmap car deaths', startX + width / 2, startY + height / 10, 'center', 'system-ui', 20, 'grey');
        CanvasUtil.fillRectangle(canvas, startX, canvas.height * 0.49, width / 2.1, height * 1.2, 0, 0, 0, 0.3, 10);
        CanvasUtil.writeText(canvas, 'Customize settings', startX + width / 4, canvas.height * 0.535, 'center', 'system-ui', 20, 'white');
        UI.sliders.forEach((slider) => {
            slider.processInput();
            slider.render(canvas);
        });
        CanvasUtil.fillRectangle(canvas, startX + width / 1.9, canvas.height * 0.49, width / 2.1, height * 1.2, 0, 0, 0, 0.3, 10);
        for (let i = 0; i < Statistics.performanceHistory.length - 1; i++) {
        }
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
            CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 5.5, canvas.width / 26, canvas.height / 13, 0, 0, 0, 0.5, 20);
        }
        else if (UI.hoverPauze) {
            CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 5.5, canvas.width / 26, canvas.height / 13, 0, 0, 0, 0.3, 20);
        }
        else {
            CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 5.5, canvas.width / 26, canvas.height / 13, 0, 0, 0, 0.2, 20);
        }
        const dashWidth = canvas.width / 240;
        const dashHeight = canvas.height / 30;
        const dashX = canvas.width / 28 + canvas.width - canvas.width / 5 - canvas.width / 22 + (canvas.width / 26 - dashWidth) / 3;
        const dashY = canvas.height / 5.5 + (canvas.height / 13 - dashHeight) / 2;
        CanvasUtil.fillRectangle(canvas, dashX, dashY, dashWidth, dashHeight, 255, 255, 255, 0.7);
        CanvasUtil.fillRectangle(canvas, dashX + dashWidth + dashWidth, dashY, dashWidth, dashHeight, 255, 255, 255, 0.7);
        if (UI.pauzeGame) {
            CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 5.5, canvas.width / 26, canvas.height / 13, 0, 70, 0, 0.4, 20);
            CanvasUtil.drawRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 5.5, canvas.width / 26, canvas.height / 13, 0, 120, 0, 1, 5, 20);
        }
        if (UI.holdingSettings) {
            CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 12 + canvas.height / 70, canvas.width / 26, canvas.height / 13, 0, 0, 0, 0.5, 20);
        }
        else if (UI.hoverSettings) {
            CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 12 + canvas.height / 70, canvas.width / 26, canvas.height / 13, 0, 0, 0, 0.3, 20);
        }
        else {
            CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 12 + canvas.height / 70, canvas.width / 26, canvas.height / 13, 0, 0, 0, 0.2, 20);
        }
        if (!UI.openSettings) {
            CanvasUtil.drawImage(canvas, this.settings, canvas.width / 25 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 12 + canvas.height / 40, canvas.width / 38, canvas.height / 20, 0, 0.7);
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