import Scene from './Scene.js';
export default class Launch extends Scene {
    constructor(maxX, maxY) {
        super(maxX, maxY);
        this.maxX = window.innerWidth;
        this.maxY = window.innerHeight;
    }
    processInput(keyListener, mouseListener) {
        console.log(mouseListener.getMousePosition());
    }
    update(elapsed) {
        return null;
    }
    render(canvas) {
    }
}
//# sourceMappingURL=Launch.js.map