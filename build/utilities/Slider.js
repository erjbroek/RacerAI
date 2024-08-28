import CanvasUtil from './CanvasUtil.js';
import MouseListener from './MouseListener.js';
export default class Slider {
    sliderValue = 0;
    posX = 0;
    posY = 0;
    width = 0;
    maxValue = 0;
    title = '';
    description = '';
    holding = false;
    circleRadius = window.innerHeight * 0.01;
    originalValue;
    constructor(posX, posY, width, startValue, maxValue, title, description) {
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.maxValue = maxValue;
        this.title = title;
        this.description = description;
        this.sliderValue = startValue;
        this.originalValue = startValue;
    }
    processInput() {
        if (MouseListener.isButtonDown(0)) {
            if (MouseListener.circleCollision(this.posX + this.circleRadius * 2 + this.sliderValue * this.width / this.maxValue / 1.2, this.posY + window.innerHeight * 0.015, this.circleRadius)) {
                this.holding = true;
            }
            if (this.holding) {
                this.sliderValue = (MouseListener.mouseCoordinates.x - this.posX - this.circleRadius * 2) / this.width * this.maxValue * 1.2;
                if (this.sliderValue < 0) {
                    this.sliderValue = 0;
                }
                if (this.sliderValue > this.maxValue) {
                    this.sliderValue = this.maxValue;
                }
            }
        }
        else {
            this.holding = false;
        }
    }
    render(canvas) {
        CanvasUtil.writeText(canvas, `${this.title}: ${Math.round(this.sliderValue * 100) / 100}`, this.posX + this.width / 2, this.posY - canvas.height * 0.01, 'center', 'system-ui', 14, 'lightgrey');
        CanvasUtil.fillRectangle(canvas, this.posX, this.posY, this.width, canvas.height * 0.03, 200, 200, 200, 0.5, canvas.height * 0.015);
        CanvasUtil.fillCircle(canvas, this.posX + this.circleRadius * 2 + this.sliderValue * this.width / this.maxValue / 1.2, this.posY + canvas.height * 0.015, this.circleRadius, 200, 200, 200, 1);
    }
}
//# sourceMappingURL=Slider.js.map