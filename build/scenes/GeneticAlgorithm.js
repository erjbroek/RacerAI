import CanvasUtil from '../utilities/CanvasUtil.js';
import KeyListener from '../utilities/KeyListener.js';
import GeneticCar from './GeneticCar.js';
import Scene from './Scene.js';
export default class GeneticAlgorithm extends Scene {
    track;
    cars = [];
    radius;
    lineStart;
    lineEnd;
    startAngle;
    midPoint;
    constructor(track, radius, lineStart, lineEnd, midPoint) {
        super();
        this.track = track;
        this.radius = radius;
        this.lineStart = lineStart;
        this.lineEnd = lineEnd;
        this.midPoint = midPoint;
        this.startAngle = Math.atan((this.lineStart[1] - this.lineEnd[1]) / (this.lineStart[0] - this.lineEnd[0])) * 180 / Math.PI;
        this.cars.push(new GeneticCar(this.midPoint, this.startAngle));
    }
    processInput() {
        if (KeyListener.keyPressed('KeyW')) {
            console.log('drive');
            this.cars[0].accelerate();
        }
    }
    update(elapsed) {
        this.cars.forEach((car) => {
            car.update(elapsed);
        });
        return this;
    }
    render(canvas) {
        canvas.style.cursor = "default";
        this.track.forEach((trackPiece) => {
            CanvasUtil.fillCircle(canvas, trackPiece[0], trackPiece[1], this.radius, 0, 0, 0);
        });
        this.cars.forEach((car) => {
            CanvasUtil.drawCar(canvas, car.posX, car.posY, car.width, car.height, car.rotation);
        });
        CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width / 30, canvas.height, 50, 120, 200);
        CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width, canvas.height / 20, 50, 120, 200);
        CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6, 0, canvas.width / 6, canvas.height, 50, 120, 200);
        CanvasUtil.fillRectangle(canvas, 0, canvas.height - canvas.height / 20, canvas.width, canvas.height / 20, 50, 120, 200);
        CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6.5, canvas.height / 20, canvas.width / 5 - canvas.width / 18, canvas.height / 1.111, 255, 255, 255, 0.2);
    }
}
//# sourceMappingURL=GeneticAlgorithm.js.map