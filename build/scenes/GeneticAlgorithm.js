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
    }
    ;
}
//# sourceMappingURL=GeneticAlgorithm.js.map