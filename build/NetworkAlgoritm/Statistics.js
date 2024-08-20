import MouseListener from '../utilities/MouseListener.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
export default class Statistics {
    showAdvancedStats = false;
    showNetwork = false;
    showGraph = true;
    renderRacingLines = true;
    performanceHistory = [];
    record = Infinity;
    recordHistory = [];
    addedToHistory = false;
    bestGen = 1;
    currentHighestLaps = 0;
    constuctor() {
    }
    processInput() {
        if (MouseListener.buttonPressed(0)) {
            if (MouseListener.mouseCoordinates.x >= window.innerWidth / 8.9 && MouseListener.mouseCoordinates.y >= window.innerHeight / 33 && MouseListener.mouseCoordinates.x <= window.innerWidth / 8.9 + window.innerWidth / 22.5 && MouseListener.mouseCoordinates.y <= window.innerHeight / 33 + window.innerHeight / 22.5) {
                this.renderRacingLines = !this.renderRacingLines;
            }
            if (MouseListener.mouseCoordinates.x >= window.innerWidth / 1.95 && MouseListener.mouseCoordinates.y >= window.innerHeight / 33 && MouseListener.mouseCoordinates.x <= window.innerWidth / 1.95 + window.innerWidth / 22.5 && MouseListener.mouseCoordinates.y <= window.innerHeight / 33 + window.innerHeight / 22.5) {
                this.showGraph = !this.showGraph;
            }
        }
    }
    update(elapsed) {
    }
    renderButtons(canvas) {
        CanvasUtil.fillRectangle(canvas, canvas.width / 10, canvas.height / 75, canvas.width / 1.85, canvas.height / 18, 50, 50, 50, 1, canvas.height / 100);
        CanvasUtil.fillRectangle(canvas, canvas.width / 8.9, canvas.height / 33, canvas.height / 45, canvas.height / 45, 150, 150, 150, 1, canvas.height / 200);
        CanvasUtil.drawRectangle(canvas, canvas.width / 8.9, canvas.height / 33, canvas.height / 45, canvas.height / 45, 30, 30, 30, 1, 1, canvas.height / 200);
        CanvasUtil.writeText(canvas, 'render racing lines', canvas.width / 7.9, canvas.height / 21.5, 'left', 'system-ui', 15, 'white');
        if (this.renderRacingLines) {
            CanvasUtil.fillCircle(canvas, canvas.width / 8.9 + canvas.width / 180, canvas.height / 33 + canvas.height / 90, canvas.height / 130, 0, 0, 0, 1);
        }
        CanvasUtil.fillRectangle(canvas, canvas.width / 4.6, canvas.height / 33, canvas.height / 45, canvas.height / 45, 150, 150, 150, 1, canvas.height / 200);
        CanvasUtil.drawRectangle(canvas, canvas.width / 4.6, canvas.height / 33, canvas.height / 45, canvas.height / 45, 30, 30, 30, 1, 1, canvas.height / 200);
        CanvasUtil.writeText(canvas, 'show advanced stats', canvas.width / 4.3, canvas.height / 21.5, 'left', 'system-ui', 15, 'white');
        if (this.showAdvancedStats) {
            CanvasUtil.fillCircle(canvas, canvas.width / 4.6 + canvas.width / 180, canvas.height / 33 + canvas.height / 90, canvas.height / 130, 0, 0, 0, 1);
        }
        if (this.performanceHistory.length > 0) {
            CanvasUtil.fillRectangle(canvas, canvas.width / 1.95, canvas.height / 33, canvas.height / 45, canvas.height / 45, 150, 150, 150, 1, canvas.height / 200);
            CanvasUtil.drawRectangle(canvas, canvas.width / 1.95, canvas.height / 33, canvas.height / 45, canvas.height / 45, 30, 30, 30, 1, 1, canvas.height / 200);
            CanvasUtil.writeText(canvas, 'render performance graph', canvas.width / 1.9, canvas.height / 21.5, 'left', 'system-ui', 15, 'white');
            if (this.showGraph) {
                CanvasUtil.fillCircle(canvas, canvas.width / 1.95 + canvas.width / 180, canvas.height / 33 + canvas.height / 90, canvas.height / 130, 0, 0, 0, 1);
            }
        }
    }
    renderGraph(canvas) {
        const top = canvas.height / 1.4;
        const height = canvas.height / 5;
        const width = canvas.width / 8;
        const bottom = top + height;
        const left = canvas.width - canvas.width / 7;
        let highest = 0;
        let lowest = 0;
        if (this.performanceHistory.length === 1) {
            [highest, lowest] = [this.performanceHistory[0] * 1.01, this.performanceHistory[0] / 1.01];
        }
        else {
            highest = Math.max(...this.performanceHistory);
            lowest = Math.min(...this.performanceHistory);
        }
        CanvasUtil.fillRectangle(canvas, left, top, width, height, 0, 0, 0, 1, 5);
        const numGridLines = 5;
        for (let i = 0; i < numGridLines; i++) {
            const value = lowest + (i * (highest - lowest)) / (numGridLines - 1);
            const y = bottom - height * 0.1 - height * 0.8 * ((value - lowest) / (highest - lowest));
            CanvasUtil.drawLine(canvas, left + width * 0.05, y, left + width * 0.95, y, 255, 255, 255, 0.2, 1);
            const labelText = `${Math.floor(value / 1000)}.${(`00${Math.floor(value % 1000)}`).slice(-3)} s`;
            CanvasUtil.writeText(canvas, labelText, left - 10, y, 'right', 'system-ui', 10, 'white');
        }
        for (let i = 0; i < this.performanceHistory.length; i++) {
            const time = this.performanceHistory[i];
            const yNormalized = (time - lowest) / (highest - lowest);
            const x = left + width * 0.1 + ((width * 0.8) / this.performanceHistory.length) * i;
            const y = bottom - height * 0.1 - height * 0.8 * yNormalized;
            if (this.performanceHistory[i] > 0) {
                const lastTime = this.performanceHistory[i - 1];
                const lastYNormalized = (lastTime - lowest) / (highest - lowest);
                const lastX = left + width * 0.1 + ((width * 0.8) / this.performanceHistory.length) * (i - 1);
                const lastY = bottom - height * 0.1 - height * 0.8 * lastYNormalized;
                CanvasUtil.drawLine(canvas, lastX, lastY, x, y, 255, 255, 255, 0.5, 1);
            }
            CanvasUtil.fillCircle(canvas, x, y, 3, 255, 255, 255, 1);
            if (this.performanceHistory.length <= 7 || time === highest || time === lowest) {
                const timeText = `${Math.floor(time / 1000)}.${(`00${Math.floor(time % 1000)}`).slice(-3)} s`;
                CanvasUtil.writeText(canvas, timeText, x, y - 10, 'center', 'system-ui', 10, 'white');
            }
        }
    }
    renderNetwork(car, canvas) {
        const xPosition = canvas.width / 50;
        const yPosition = canvas.height / 1.55;
        CanvasUtil.fillRectangle(canvas, xPosition + canvas.width / 30, yPosition, canvas.width / 4.3, canvas.height / 3.5, 0, 0, 0, 0.3, 5);
        if (!car.alive) {
            CanvasUtil.writeText(canvas, 'neural network of best car (died)', xPosition + canvas.width / 30 + canvas.width / 8, yPosition + canvas.height / 3.8, 'center', 'system-ui', 20, 'white');
        }
        else {
            CanvasUtil.writeText(canvas, 'neural network of best car', xPosition + canvas.width / 30 + canvas.width / 8, yPosition + canvas.height / 3.8, 'center', 'system-ui', 20, 'white');
        }
        const radius = canvas.height / 90;
        const { biases } = car;
        car.genome.forEach((network) => {
            const [input, output, weight] = network;
            const startX = xPosition + canvas.width / 14;
            const startY = yPosition + canvas.height / 30 + input * radius * 4;
            const endX = xPosition + canvas.width / 4.5;
            const endY = yPosition + canvas.height / 30 + radius + output * radius * 4;
            const lineWidth = weight * 10;
            const rayLength = car.rayLengths[input];
            const ratio = rayLength / 100;
            const red = Math.floor(255 * (1 - ratio));
            const green = Math.floor(255 * ratio);
            if (!car.alive) {
                CanvasUtil.drawLine(canvas, startX, startY, endX, endY, red / 2, green / 2, 0, 0.8, lineWidth);
            }
            else {
                CanvasUtil.drawLine(canvas, startX, startY, endX, endY, red, green, 0, 0.8, lineWidth);
            }
        });
        for (let input = 0; input < 5; input++) {
            CanvasUtil.fillCircle(canvas, xPosition + canvas.width / 14, yPosition + canvas.height / 30 + input * radius * 4, radius, 255, 255, 255, 0.8);
            CanvasUtil.writeText(canvas, `ray ${input + 1}`, xPosition + canvas.width / 27, yPosition + canvas.height / 20 + input * radius * 4, 'left', 'system-ui', 20, 'white');
        }
        const moves = ['left', 'right', 'gas', 'brake'];
        for (let output = 0; output < 4; output++) {
            CanvasUtil.fillCircle(canvas, xPosition + canvas.width / 4.5, yPosition + canvas.height / 30 + radius + output * radius * 4, radius, 255, 255, 255, 0.8);
            CanvasUtil.writeText(canvas, `${moves[output]}`, xPosition + canvas.width / 4.3, yPosition + canvas.height / 20 + radius + output * radius * 4, 'left', 'system-ui', 20, 'white');
        }
    }
}
//# sourceMappingURL=Statistics.js.map