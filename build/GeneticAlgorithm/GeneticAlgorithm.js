import CanvasUtil from '../utilities/CanvasUtil.js';
import Scene from '../scenes/Scene.js';
import GeneticPopulation from './GeneticPopulation.js';
import MouseListener from '../utilities/MouseListener.js';
import GeneticRace from './GeneticRace.js';
import UI from '../utilities/UI.js';
export default class GeneticAlgorithm extends Scene {
    track;
    radius;
    population;
    startSimulation = false;
    startAngle;
    populationSize = 100;
    selectorPos = [window.innerWidth - window.innerWidth / 7.6, window.innerHeight / 3 + window.innerHeight / 50];
    populationSizePercentage = 1;
    triggered = false;
    startRace = false;
    constructor(track, radius) {
        super();
        this.track = track;
        this.radius = radius;
        const startAngle = (Math.atan((this.track.lineStart[1] - this.track.lineEnd[1]) / (this.track.lineStart[0] - this.track.lineEnd[0])) * 180) / Math.PI;
        this.startAngle = startAngle;
        this.population = new GeneticPopulation(this.populationSize, this.track.midPoint, startAngle, this.track);
    }
    processInput() {
        if (MouseListener.isButtonDown(0)) {
            if (MouseListener.mouseCoordinates.x >= window.innerWidth - window.innerWidth / 7.6 && MouseListener.mouseCoordinates.x <= window.innerWidth - window.innerWidth / 7 + window.innerWidth / 8.8 && MouseListener.mouseCoordinates.y >= window.innerHeight / 3 && MouseListener.mouseCoordinates.y <= window.innerHeight / 3 + window.innerHeight / 25) {
                this.selectorPos[0] = MouseListener.mouseCoordinates.x;
                const max = window.innerWidth / 7;
                const chosen = this.selectorPos[0] - (window.innerWidth - window.innerWidth / 7);
                this.populationSizePercentage = (chosen / max) * 10;
            }
            if (!this.startSimulation) {
                if (MouseListener.mouseHover(window.innerWidth - window.innerWidth / 7.8, window.innerHeight / 2, window.innerWidth / 10, window.innerHeight / 20)) {
                    this.startSimulation = true;
                }
            }
        }
    }
    update(elapsed) {
        this.populationSize = (this.populationSizePercentage ** 2 + 10) ** 1.9;
        if (this.startSimulation) {
            if (!this.triggered) {
                this.triggered = true;
                this.population = new GeneticPopulation(this.populationSize, this.track.midPoint, this.startAngle, this.track);
            }
            this.population.update(elapsed);
        }
        if (this.startRace) {
            return new GeneticRace(this.track, this.population.cars[0], GeneticPopulation.startingPoint, this.population.startingRotation);
        }
        return this;
    }
    render(canvas) {
        canvas.style.cursor = 'default';
        CanvasUtil.fillCanvas(canvas, 'black');
        CanvasUtil.fillRectangle(canvas, canvas.width / 30, canvas.height / 12, canvas.width - canvas.width / 5, canvas.height - canvas.height / 7.5, 255, 255, 255, 1, 20);
        this.track.render(canvas);
        UI.renderUI(canvas);
        if (this.startSimulation) {
            if (!this.population.extinct) {
                this.population.render(canvas);
            }
        }
        if (!this.startSimulation) {
            CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 7, canvas.height / 3, canvas.width / 8, canvas.height / 25, 200, 200, 200, 0.9, canvas.height / 50);
            CanvasUtil.fillCircle(canvas, this.selectorPos[0], this.selectorPos[1], canvas.height / 70, 20, 50, 100, 1);
            CanvasUtil.writeText(canvas, `population size: ${Math.round(this.populationSize)}`, canvas.width / 1.09, canvas.height / 2.4, 'center', 'system-ui', 20, 'white');
            CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 7.8, canvas.height / 2, canvas.width / 10, canvas.height / 20, 20, 190, 80, 1, 10);
            CanvasUtil.writeText(canvas, 'Start simulation', canvas.width - canvas.width / 7.8 + canvas.width / 20, canvas.height / 2 + canvas.height / 35, 'center', 'system-ui', 20, 'white');
        }
    }
}
//# sourceMappingURL=GeneticAlgorithm.js.map