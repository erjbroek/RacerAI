import CanvasUtil from '../utilities/CanvasUtil.js';
import Scene from './Scene.js';
export default class GeneticAlgorithm extends Scene {
    track;
    player;
    radius;
    lineStart;
    lineEnd;
    midPoint;
    constructor(track, radius, lineStart, lineEnd, midPoint) {
        super();
        this.track = track;
        this.radius = radius;
        this.lineStart = lineStart;
        this.lineEnd = lineEnd;
        this.midPoint = midPoint;
    }
    processInput(keyListener) {
    }
    update(elapsed) {
        return this;
    }
    render(canvas) {
        canvas.style.cursor = "default";
        this.track.forEach((trackPiece) => {
            CanvasUtil.fillCircle(canvas, trackPiece[0], trackPiece[1], this.radius, 0, 0, 0);
        });
        CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width / 30, canvas.height, 50, 120, 200);
        CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width, canvas.height / 20, 50, 120, 200);
        CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6, 0, canvas.width / 6, canvas.height, 50, 120, 200);
        CanvasUtil.fillRectangle(canvas, 0, canvas.height - canvas.height / 20, canvas.width, canvas.height / 20, 50, 120, 200);
        CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6.5, canvas.height / 20, canvas.width / 5 - canvas.width / 18, canvas.height / 1.111, 255, 255, 255, 0.2);
    }
}
//# sourceMappingURL=GeneticAlgorithm.js.map