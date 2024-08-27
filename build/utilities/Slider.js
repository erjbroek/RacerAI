import CanvasUtil from './CanvasUtil.js';
export default class Slider {
    sliderValue = 0;
    posX = 0;
    posY = 0;
    width = 0;
    maxValue = 0;
    title = '';
    description = '';
    constructor(posX, posY, width, maxValue, title, description) {
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.maxValue = maxValue;
        this.title = title;
        this.description = description;
    }
    processInput() {
    }
    render(canvas) {
        CanvasUtil.writeText(canvas, `${this.title}`, this.posX + this.width / 2, this.posY - canvas.height * 0.01, 'center', 'system-ui', 14, 'lightgrey');
        CanvasUtil.fillRectangle(canvas, this.posX, this.posY, this.width, canvas.height * 0.03, 200, 200, 200, 0.5, canvas.height * 0.015);
    }
}
//# sourceMappingURL=Slider.js.map