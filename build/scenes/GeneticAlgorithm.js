import CanvasUtil from "../utilities/CanvasUtil.js";
import Population from './Population.js';
import Scene from "./Scene.js";
export default class GeneticAlgorithm extends Scene {
    track;
    radius;
    population;
    constructor(track, radius) {
        super();
        this.track = track;
        this.radius = radius;
        const startAngle = (Math.atan((this.track.lineStart[1] - this.track.lineEnd[1]) / (this.track.lineStart[0] - this.track.lineEnd[0])) * 180) / Math.PI;
        this.population = new Population(30, this.track.midPoint, startAngle, this.track);
    }
    processInput(keyListener) {
    }
    update(elapsed) {
        this.population.update(elapsed);
        return this;
    }
    render(canvas) {
        canvas.style.cursor = "default";
        this.track.render(canvas);
        this.population.render(canvas);
        CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width / 30, canvas.height, 50, 120, 200);
        CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width, canvas.height / 20, 50, 120, 200);
        CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6, 0, canvas.width / 6, canvas.height, 50, 120, 200);
        CanvasUtil.fillRectangle(canvas, 0, canvas.height - canvas.height / 20, canvas.width, canvas.height / 20, 50, 120, 200);
        CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6.5, canvas.height / 20, canvas.width / 5 - canvas.width / 18, canvas.height / 1.111, 255, 255, 255, 0.2);
    }
}
//# sourceMappingURL=GeneticAlgorithm.js.map