import MouseListener from '../utilities/MouseListener.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import RenderUI from './RenderUI.js';
import Scene from './Scene.js';
import NetAlgorithm from '../NetworkAlgoritm/NetAlgoritm.js';
import GeneticAlgorithm from '../GeneticAlgorithm/GeneticAlgorithm.js';
export default class ChooseAlgoritm extends Scene {
    track;
    radius;
    chosenGenetic = false;
    chosenNeural = false;
    hoverGenetic = false;
    hoverNeural = false;
    geneticDescription = 'This algorithm uses a list of <br>moves for the car.The car <br>follows the series of actions <br>like turning or accelerating.<br>The list of moves evolves over <br>time by combining the best <br>moves from the fastest cars. <br>Each generation gets better <br>at navigating the track.<br><br>- This algoritm is better at <br>exploring the track and <br>finding the shortest path than <br>actually racing.';
    neuralDescription = 'This algorithm uses a simple <br>brain (neural network) for the <br>car. The car sends out five <br>rays to see the track. The <br>brain then decides whether <br>turn left, turn right, <br>accelerate, or brake based on <br>what the rays detect. The <br>brain improves over time by <br>learning from the <br>best-performing cars.<br><br>- This algoritm works really <br>well when racing, trying to <br>get the lowest lap times.';
    chosen = false;
    ready = false;
    constructor(track, radius) {
        super();
        this.track = track;
        this.radius = radius;
    }
    processInput(keyListener) {
        if (MouseListener.mouseHover(window.innerWidth / 1.17, window.innerHeight / 1.7, window.innerWidth / 17, window.innerHeight / 10)) {
            if (MouseListener.isButtonDown(0)) {
                this.chosenGenetic = true;
                this.chosenNeural = false;
            }
            this.hoverGenetic = true;
        }
        else {
            this.hoverGenetic = false;
        }
        if (MouseListener.mouseHover(window.innerWidth / 1.085, window.innerHeight / 1.7, window.innerWidth / 17, window.innerHeight / 10)) {
            if (MouseListener.isButtonDown(0)) {
                this.chosenGenetic = false;
                this.chosenNeural = true;
            }
            this.hoverNeural = true;
        }
        else {
            this.hoverNeural = false;
        }
        if (MouseListener.mouseHover(window.innerWidth / 1.155, window.innerHeight / 1.2, window.innerWidth / 10, window.innerHeight / 12)) {
            if (MouseListener.buttonPressed(0)) {
                if (this.chosen) {
                    this.ready = true;
                }
            }
        }
    }
    update(elapsed) {
        if (this.ready) {
            if (this.chosenNeural) {
                return new NetAlgorithm(this.track, this.radius);
            }
            if (this.chosenGenetic) {
                return new GeneticAlgorithm(this.track, this.radius);
            }
        }
        return this;
    }
    render(canvas) {
        canvas.style.cursor = 'auto';
        RenderUI.renderTrack(canvas, this.track.road, this.radius);
        RenderUI.renderUI(canvas);
        if (this.chosenGenetic) {
            CanvasUtil.writeText(canvas, 'Genetic Algoritm', canvas.width / 1.09, canvas.height / 10, 'center', 'system-ui', 30, 'white');
            CanvasUtil.writeText(canvas, this.geneticDescription, canvas.width / 1.17, canvas.height / 7, 'left', 'system-ui', 20, 'white');
            CanvasUtil.writeText(canvas, 'Genetic <br>Algoritm', canvas.width / 1.17 + canvas.width / 34, canvas.height / 1.7 + canvas.height / 20, 'center', 'system-ui', 20, 'lightgreen');
            CanvasUtil.drawRectangle(canvas, canvas.width / 1.17, canvas.height / 1.7, canvas.width / 17, canvas.height / 10, 0, 200, 0, 0.3, 4, canvas.height / 70);
        }
        else {
            CanvasUtil.writeText(canvas, 'Genetic <br>Algoritm', canvas.width / 1.17 + canvas.width / 34, canvas.height / 1.7 + canvas.height / 20, 'center', 'system-ui', 20, 'grey');
            CanvasUtil.drawRectangle(canvas, canvas.width / 1.17, canvas.height / 1.7, canvas.width / 17, canvas.height / 10, 255, 255, 255, 0.3, 4, canvas.height / 70);
        }
        if (this.chosenNeural) {
            CanvasUtil.writeText(canvas, 'Neural Network', canvas.width / 1.09, canvas.height / 10, 'center', 'system-ui', 30, 'white');
            CanvasUtil.writeText(canvas, this.neuralDescription, canvas.width / 1.17, canvas.height / 7, 'left', 'system-ui', 20, 'white');
            CanvasUtil.writeText(canvas, 'Neural <br>network', canvas.width / 1.085 + canvas.width / 34, canvas.height / 1.7 + canvas.height / 20, 'center', 'system-ui', 20, 'lightgreen');
            CanvasUtil.drawRectangle(canvas, canvas.width / 1.085, canvas.height / 1.7, canvas.width / 17, canvas.height / 10, 0, 200, 0, 0.3, 4, canvas.height / 70);
        }
        else {
            CanvasUtil.writeText(canvas, 'Neural <br>network', canvas.width / 1.085 + canvas.width / 34, canvas.height / 1.7 + canvas.height / 20, 'center', 'system-ui', 20, 'grey');
            CanvasUtil.drawRectangle(canvas, canvas.width / 1.085, canvas.height / 1.7, canvas.width / 17, canvas.height / 10, 255, 255, 255, 0.3, 4, canvas.height / 70);
        }
        if (this.hoverGenetic) {
            CanvasUtil.fillRectangle(canvas, canvas.width / 1.17, canvas.height / 1.7, canvas.width / 17, canvas.height / 10, 0, 200, 0, 0.2, canvas.height / 70);
        }
        if (this.hoverNeural) {
            CanvasUtil.fillRectangle(canvas, canvas.width / 1.085, canvas.height / 1.7, canvas.width / 17, canvas.height / 10, 0, 200, 0, 0.2, canvas.height / 70);
        }
        if (this.chosenGenetic || this.chosenNeural) {
            this.chosen = true;
            CanvasUtil.fillRectangle(canvas, canvas.width / 1.155, canvas.height / 1.2, canvas.width / 10, canvas.height / 12, 40, 200, 100, 1, 5);
            CanvasUtil.writeText(canvas, 'Ready', canvas.width / 1.09, canvas.height / 1.13, 'center', 'system-ui', 25, 'white');
        }
        else {
            this.chosen = false;
            CanvasUtil.fillRectangle(canvas, canvas.width / 1.155, canvas.height / 1.2, canvas.width / 10, canvas.height / 12, 40, 200, 100, 0.2, 5);
            CanvasUtil.writeText(canvas, 'First <br>choose algoritm', canvas.width / 1.09, canvas.height / 1.15, 'center', 'system-ui', 25, 'white');
        }
    }
}
//# sourceMappingURL=ChooseAlgoritm.js.map