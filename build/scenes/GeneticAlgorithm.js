import CanvasUtil from '../utilities/CanvasUtil.js';
import Scene from './Scene.js';
export default class GeneticAlgorithm extends Scene {
    track;
    radius;
    lineStart;
    lineEnd;
    constructor(track, radius, lineStart, lineEnd) {
        super();
        this.track = track;
        this.radius = radius;
        this.lineStart = lineStart;
        this.lineEnd = lineEnd;
    }
    processInput(keyListener) {
    }
    update(elapsed) {
        return this;
    }
    render(canvas) {
        this.track.forEach((trackPiece) => {
            CanvasUtil.fillCircle(canvas, trackPiece[0], trackPiece[1], this.radius, 0, 0, 0);
        });
    }
    ;
}
//# sourceMappingURL=GeneticAlgorithm.js.map