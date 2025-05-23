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
    static readyClick = true;
    static letChampionSurvive = true;
    static loadSliders() {
        UI.sliders.push(new Slider(window.innerWidth * 0.42, window.innerHeight * 0.57, window.innerWidth * 0.127, Statistics.slightMutationRate, 0, 1, 'Small mutation rate', 'The chance in % that a gene <br>mutates, and randomly gets <br>increased or decreased by <br> something between 12.5% <br>and -12.5%.', '%'));
        UI.sliders.push(new Slider(window.innerWidth * 0.42, window.innerHeight * 0.63, window.innerWidth * 0.127, Statistics.bigMutationRate, 0, 1, 'Big mutation rate', 'The chance in % that a gene <br> gets completely randomized.<br>If this is too high, all <br>genes get randomized each <br>generation resulting in no <br>possible progress.', '%'));
        UI.sliders.push(new Slider(window.innerWidth * 0.42, window.innerHeight * 0.69, window.innerWidth * 0.127, Statistics.selectionPercentage, 0.01, 1, 'Selection percentage', 'The percentage of best cars <br>each generation that survive <br>to the next generation.', '%'));
        UI.sliders.push(new Slider(window.innerWidth * 0.42, window.innerHeight * 0.75, window.innerWidth * 0.127, 25, 20, 40, 'Population size', 'The amount of cars that <br>spawn at the beginning of <br>the generation.', ' cars'));
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
                if (!UI.openSettings) {
                    UI.sliders[0].sliderValue = Statistics.slightMutationRate;
                    UI.sliders[1].sliderValue = Statistics.bigMutationRate;
                    UI.sliders[2].sliderValue = Statistics.selectionPercentage;
                    UI.sliders[3].sliderValue = Statistics.size;
                    UI.letChampionSurvive = Statistics.championsSurvive;
                }
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
                red: 20,
                green: 10,
                blue: 0,
                opacity: 0.65,
                stop: 1,
            },
            {
                red: 0,
                green: 10,
                blue: 20,
                opacity: 0.65,
                stop: 0,
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
        CanvasUtil.writeText(canvas, `Gene mutation chance: ${Math.round(Statistics.slightMutationRate * 10000) / 100}%`, canvas.width * 0.07, canvas.height * 0.27, 'left', 'system-ui', 17, 'lightgray');
        CanvasUtil.writeText(canvas, `Gene randomizing chance: ${Math.floor(Statistics.bigMutationRate * 1000) / 10}%`, canvas.width * 0.07, canvas.height * 0.3, 'left', 'system-ui', 17, 'lightgray');
        CanvasUtil.writeText(canvas, `% of top cars surviving: ${Math.floor(Statistics.selectionPercentage * 100)}%`, canvas.width * 0.07, canvas.height * 0.33, 'left', 'system-ui', 17, 'lightgray');
        CanvasUtil.writeText(canvas, `Cars alive: ${Statistics.carsAlive}`, canvas.width * 0.23, canvas.height * 0.27, 'left', 'system-ui', 17, 'lightgray');
        CanvasUtil.writeText(canvas, `Species: ${Statistics.species}`, canvas.width * 0.23, canvas.height * 0.3, 'left', 'system-ui', 17, 'lightgray');
        CanvasUtil.writeText(canvas, `Best generation: ${Math.floor(Statistics.bestGen)}`, canvas.width * 0.23, canvas.height * 0.33, 'left', 'system-ui', 17, 'lightgray');
        if (Statistics.record !== Infinity) {
            if (Math.floor(Statistics.record % 1000) < 100) {
                CanvasUtil.writeText(canvas, `Record: ${Math.floor(Statistics.record / 1000)}.0${Math.floor(Statistics.record % 1000)} s`, canvas.width * 0.23, canvas.height * 0.36, 'left', 'system-ui', 17, 'lightgray');
            }
            else {
                CanvasUtil.writeText(canvas, `Record: ${Math.floor(Statistics.record / 1000)}.${Math.floor(Statistics.record % 1000)} s`, canvas.width * 0.23, canvas.height * 0.36, 'left', 'system-ui', 17, 'lightgray');
            }
            CanvasUtil.fillRectangle(canvas, canvas.width * 0.2 - canvas.width * 0.08, canvas.height * 0.41, canvas.width * 0.16, canvas.height * 0.154, 0, 0, 0, 0.2, 10);
            CanvasUtil.createNetCar(canvas, Statistics.recordCar, canvas.width * 0.2, canvas.height * 0.485, 3, 90, 1);
            CanvasUtil.writeText(canvas, 'Fastest car from all generations', canvas.width * 0.2, canvas.height * 0.59, 'center', 'system-ui', 20, 'white');
        }
        else {
            CanvasUtil.writeText(canvas, 'Track not beaten yet ):', canvas.width * 0.23, canvas.height * 0.36, 'left', 'system-ui', 17, 'lightgrey');
        }
        UI.renderTrackPreview(canvas, track);
        const startX = canvas.width * 0.4;
        const startY = canvas.height * 0.108;
        const width = canvas.width * 0.35;
        const height = canvas.height * 0.35;
        CanvasUtil.fillRectangle(canvas, startX, canvas.height * 0.49, width / 2.1, height * 1.2, 0, 0, 0, 0.3, 10);
        CanvasUtil.writeText(canvas, 'Customize settings', startX + width / 4, canvas.height * 0.535, 'center', 'system-ui', 20, 'white');
        CanvasUtil.drawRectangle(canvas, startX + width / 4 - width / 12, startY + height * 2.13, width / 6, canvas.height * 0.035, 255, 255, 255, 0.4, 3, 10);
        CanvasUtil.writeText(canvas, 'Apply settings', startX + width / 4, startY + height * 2.2, 'center', 'system-ui', 15, 'white');
        if (MouseListener.mouseHover(startX + width / 4 - width / 12, startY + height * 2.13, width / 6, canvas.height * 0.035)) {
            CanvasUtil.fillRectangle(canvas, startX + width / 4 - width / 12, startY + height * 2.13, width / 6, canvas.height * 0.035, 255, 255, 255, 0.1, 10);
            if (MouseListener.isButtonDown(0)) {
                Statistics.slightMutationRate = UI.sliders[0].sliderValue;
                Statistics.bigMutationRate = UI.sliders[1].sliderValue;
                Statistics.selectionPercentage = UI.sliders[2].sliderValue;
                Statistics.size = Math.floor(UI.sliders[3].sliderValue);
                Statistics.championsSurvive = UI.letChampionSurvive;
                this.openSettings = !this.openSettings;
            }
        }
        if (MouseListener.mouseHover(startX + width / 15, window.innerHeight * 0.81, canvas.height / 40, canvas.height / 40)) {
            CanvasUtil.fillRectangle(canvas, startX + width / 15, window.innerHeight * 0.81, canvas.height / 40, canvas.height / 40, 255, 255, 255, 0.4, 5);
            if (MouseListener.isButtonDown(0)) {
                if (this.readyClick) {
                    UI.letChampionSurvive = !UI.letChampionSurvive;
                    this.readyClick = false;
                }
            }
            else {
                this.readyClick = true;
            }
        }
        if (UI.letChampionSurvive) {
            CanvasUtil.fillCircle(canvas, canvas.width * 0.43, canvas.height * 0.81 + canvas.height / 80, 7, 255, 255, 255, 0.7);
        }
        CanvasUtil.drawRectangle(canvas, startX + width / 15, window.innerHeight * 0.81, canvas.height / 40, canvas.height / 40, 255, 255, 255, 0.4, 2, 5);
        CanvasUtil.writeText(canvas, 'Guarantees best car to <br>survive to next generation', startX + width / 24 + canvas.height / 20, window.innerHeight * 0.81 + canvas.height / 80, 'left', 'system-ui', 15, 'white');
        CanvasUtil.fillRectangle(canvas, startX + width / 1.9, canvas.height * 0.49, width / 2.1, height * 1.2, 0, 0, 0, 0.3, 10);
        this.renderGraph(canvas);
        UI.sliders.forEach((slider) => {
            slider.processInput();
            slider.renderSlider(canvas);
        });
    }
    static renderTrackPreview(canvas, track) {
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
    }
    static renderGraph(canvas) {
        const top = canvas.height * 0.58;
        const height = canvas.height * 0.295;
        const width = canvas.width * 0.135;
        const bottom = top + height;
        const left = canvas.width * 0.61;
        CanvasUtil.writeText(canvas, 'Track completion time', left + width / 2.4, canvas.height * 0.535, 'center', 'system-ui', 20, 'white');
        if (Statistics.performanceHistory.length === 0) {
            CanvasUtil.writeText(canvas, '(No data yet)', left + width / 2.4, canvas.height * 0.56, 'center', 'system-ui', 15, 'lightgray');
            [Statistics.highest, Statistics.lowest] = [10000, 0];
        }
        else if (Statistics.performanceHistory.length === 1) {
            [Statistics.highest, Statistics.lowest] = [Statistics.performanceHistory[0][0] * 1.4, 0];
        }
        else {
            Statistics.highest = -Infinity;
            Statistics.lowest = Infinity;
            Statistics.performanceHistory.forEach((entry) => {
                const time = entry[0];
                Statistics.highest = Math.max(time, Statistics.highest);
                Statistics.lowest = Math.min(time, 0);
            });
        }
        CanvasUtil.fillRectangle(canvas, left, top, width, height, 0, 0, 0, 1, 5);
        CanvasUtil.drawLine(canvas, left + width * 0.05, top + height * 0.1, left + width * 0.05, bottom - height * 0.08, 255, 255, 255, 0.5, 1);
        CanvasUtil.drawLine(canvas, left + width * 0.05, bottom - height * 0.08, left + width * 0.95, bottom - height * 0.08, 255, 255, 255, 0.5, 1);
        const numGridLines = 5;
        for (let i = 0; i < numGridLines; i++) {
            const value = Statistics.lowest + (i * (Statistics.highest - Statistics.lowest)) / (numGridLines - 1);
            const y = bottom - height * 0.1 - height * 0.8 * ((value - Statistics.lowest) / (Statistics.highest - Statistics.lowest));
            CanvasUtil.drawLine(canvas, left + width * 0.05, y, left + width * 0.95, y, 255, 255, 255, 0.2, 1);
            const labelText = `${Math.floor(value / 1000)}.${`00${Math.floor(value % 1000)}`.slice(-3)} s`;
            CanvasUtil.writeText(canvas, labelText, left - 10, y, 'right', 'system-ui', 10, 'white');
        }
        for (let i = 0; i < Statistics.performanceHistory.length; i++) {
            const time = Statistics.performanceHistory[i][0];
            const yNormalized = (time - Statistics.lowest) / (Statistics.highest - Statistics.lowest);
            const x = left + width * 0.1 + ((width * 0.8) / Statistics.performanceHistory.length) * i;
            const y = bottom - height * 0.1 - height * 0.8 * yNormalized;
            if (i > 0) {
                const lastTime = Statistics.performanceHistory[i - 1][0];
                const lastYNormalized = (lastTime - Statistics.lowest) / (Statistics.highest - Statistics.lowest);
                const lastX = left + width * 0.1 + ((width * 0.8) / Statistics.performanceHistory.length) * (i - 1);
                const lastY = bottom - height * 0.1 - height * 0.8 * lastYNormalized;
                CanvasUtil.drawLine(canvas, lastX + 10, lastY, x + 10, y, 255, 255, 255, 0.5, 1);
            }
            CanvasUtil.fillCircle(canvas, x + 10, y, 3, 255, 255, 255, 1);
            CanvasUtil.drawLine(canvas, x + 10, bottom - height * 0.06, x + 10, bottom - height * 0.08 - 5, 255, 255, 255, 1, 1);
            if (Statistics.performanceHistory.length <= 7 || time === Statistics.highest || time === Statistics.lowest) {
                const timeText = `${Math.floor(time / 1000)}.${`00${Math.floor(time % 1000)}`.slice(-3)} s`;
                CanvasUtil.writeText(canvas, timeText, x + 10, y - 10, 'center', 'system-ui', 10, 'white');
            }
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