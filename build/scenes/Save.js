import Cookies from '../ui/Cookies.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import Scene from './Scene.js';
export default class Save extends Scene {
    background;
    logo;
    slotWidth = window.innerWidth / 4;
    slot1Stats = Cookies.getStatsFromSlot(1);
    slot2Stats = Cookies.getStatsFromSlot(2);
    slot3Stats = Cookies.getStatsFromSlot(3);
    constructor() {
        super();
        this.background = CanvasUtil.loadNewImage('./assets/backMountains.png');
    }
    processInput(keyListener, mouseListener) {
    }
    update(elapsed) {
        return this;
    }
    render(canvas) {
        CanvasUtil.drawImage(canvas, this.background, 0, 0, canvas.width, canvas.height, 0);
        CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 50, 0.3);
        CanvasUtil.fillRectangle(canvas, canvas.width * 0.065 - canvas.width / 20, canvas.height / 6 - canvas.height / 8, canvas.width / 1.03, canvas.height / 1.4 + canvas.height / 5, 50, 100, 150, 0.35, 20);
        CanvasUtil.writeText(canvas, 'Save Slots', canvas.width / 2, canvas.height / 8, 'center', 'arial', 60, 'white');
        CanvasUtil.fillRectangle(canvas, canvas.width * 0.0625, canvas.height / 6, this.slotWidth, canvas.height / 1.4, 50, 90, 100, 0.8, 4);
        CanvasUtil.fillRectangle(canvas, canvas.width * 0.0625 + (this.slotWidth + canvas.width * 0.0624), canvas.height / 6, this.slotWidth, canvas.height / 1.4, 30, 120, 90, 0.8, 4);
        CanvasUtil.fillRectangle(canvas, canvas.width * 0.0625 + (canvas.width * 0.125 + this.slotWidth * 2), canvas.height / 6, this.slotWidth, canvas.height / 1.4, 80, 180, 110, 0.8, 4);
        CanvasUtil.fillRectangle(canvas, canvas.width * 0.0625, canvas.height / 6, this.slotWidth, canvas.height / 4, 0, 0, 0, 0.2, 4);
        CanvasUtil.fillRectangle(canvas, canvas.width * 0.0625 + (this.slotWidth + canvas.width * 0.0624), canvas.height / 6, this.slotWidth, canvas.height / 4, 0, 0, 0, 0.2, 4);
        CanvasUtil.fillRectangle(canvas, canvas.width * 0.0625 + (canvas.width * 0.125 + this.slotWidth * 2), canvas.height / 6, this.slotWidth, canvas.height / 4, 0, 0, 0, 0.2, 4);
        CanvasUtil.fillRectangle(canvas, canvas.width * 0.0625, canvas.height / 1.32, this.slotWidth, canvas.height / 8, 0, 0, 0, 0.2, 4);
        CanvasUtil.fillRectangle(canvas, canvas.width * 0.0625 + (this.slotWidth + canvas.width * 0.0624), canvas.height / 1.32, this.slotWidth, canvas.height / 8, 0, 0, 0, 0.2, 4);
        CanvasUtil.fillRectangle(canvas, canvas.width * 0.0625 + (canvas.width * 0.125 + this.slotWidth * 2), canvas.height / 1.32, this.slotWidth, canvas.height / 8, 0, 0, 0, 0.2, 4);
        CanvasUtil.drawRectangle(canvas, canvas.width * 0.0625, canvas.height / 6, this.slotWidth, canvas.height / 1.4, 10, 40, 50, 0.8, 4, 10);
        CanvasUtil.drawRectangle(canvas, canvas.width * 0.0625 + (this.slotWidth + canvas.width * 0.0624), canvas.height / 6, this.slotWidth, canvas.height / 1.4, 31, 40, 50, 0.8, 4, 10);
        CanvasUtil.drawRectangle(canvas, canvas.width * 0.0625 + (canvas.width * 0.125 + this.slotWidth * 2), canvas.height / 6, this.slotWidth, canvas.height / 1.4, 10, 40, 50, 0.8, 4, 10);
        CanvasUtil.writeText(canvas, 'Slot 1', canvas.width / 5.3, canvas.height / 4, 'center', 'arial', 50, 'white');
        CanvasUtil.writeText(canvas, 'Slot 2', canvas.width / 2, canvas.height / 4, 'center', 'arial', 50, 'white');
        CanvasUtil.writeText(canvas, 'Slot 3', canvas.width / 1.23, canvas.height / 4, 'center', 'arial', 50, 'white');
        CanvasUtil.writeText(canvas, `Time played ${this.slot1Stats.fPlayTime}`, canvas.width / 5.3, canvas.height / 3, 'center', 'arial', 20, 'white');
        CanvasUtil.writeText(canvas, `- Duck dollars: ${this.slot1Stats.duckDollars}`, canvas.width / 7.4, canvas.height / 2, 'center', 'arial', 20, 'white');
        CanvasUtil.writeText(canvas, `Time played ${this.slot2Stats.fPlayTime}`, canvas.width / 2, canvas.height / 3, 'center', 'arial', 20, 'white');
        CanvasUtil.writeText(canvas, `- Duck dollars: ${this.slot2Stats.duckDollars}`, canvas.width / 2.25, canvas.height / 2, 'center', 'arial', 20, 'white');
        CanvasUtil.writeText(canvas, `Time played ${this.slot3Stats.fPlayTime}`, canvas.width / 1.23, canvas.height / 3, 'center', 'arial', 20, 'white');
        CanvasUtil.writeText(canvas, `- Duck dollars: ${this.slot3Stats.duckDollars}`, canvas.width / 1.31, canvas.height / 2, 'center', 'arial', 20, 'white');
    }
}
//# sourceMappingURL=Save.js.map