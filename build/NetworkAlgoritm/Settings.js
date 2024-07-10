import CanvasUtil from "../utilities/CanvasUtil.js";
export default class Statistics {
    showAdvancedStats = false;
    showNetwork = false;
    showGraph = true;
    constuctor() {
    }
    processInput() {
    }
    renderSettings(canvas) {
    }
    renderButtons(canvas) {
        CanvasUtil.fillRectangle(canvas, canvas.width / 1.1, canvas.height / 3, canvas.height / 50, canvas.height / 50, 100, 100, 100, 1, canvas.height / 200);
        CanvasUtil.drawRectangle(canvas, canvas.width / 1.1, canvas.height / 3, canvas.height / 50, canvas.height / 50, 30, 30, 30, 1, 1, canvas.height / 200);
    }
    renderGraph(canvas) {
    }
    renderNetwork(car, canvas) {
        const xPosition = canvas.width / 1.73;
        CanvasUtil.fillRectangle(canvas, xPosition + canvas.width / 30, canvas.height / 20, canvas.width / 4.5, canvas.height / 3.5, 0, 0, 0, 0.3, 5);
        CanvasUtil.writeText(canvas, "neural network of best car", xPosition + canvas.width / 30 + canvas.width / 8, canvas.height / 20 + canvas.height / 3.8, "center", "system-ui", 20, "black");
        const radius = canvas.height / 90;
        const biases = car.biases;
        car.genome.forEach((network) => {
            const [input, output, weight] = network;
            const startX = xPosition + canvas.width / 14;
            const startY = canvas.height / 14 + input * radius * 4;
            const endX = xPosition + canvas.width / 4.5;
            const endY = canvas.height / 14 + radius + output * radius * 4;
            const lineWidth = weight * 10;
            const rayLength = car.rayLengths[input];
            const ratio = rayLength / 100;
            const red = Math.floor(255 * (1 - ratio));
            const green = Math.floor(255 * ratio);
            CanvasUtil.drawLine(canvas, startX, startY, endX, endY, red, green, 0, 0.8, lineWidth);
        });
        for (let input = 0; input < 5; input++) {
            CanvasUtil.fillCircle(canvas, xPosition + canvas.width / 14, canvas.height / 14 + input * radius * 4, radius, 255, 255, 255, 0.8);
            CanvasUtil.writeText(canvas, `ray ${input + 1}`, xPosition + canvas.width / 27, canvas.height / 12.5 + input * radius * 4, "left", "system-ui", 20, "white");
        }
        const moves = ['left', 'right', 'gas', 'brake'];
        for (let output = 0; output < 4; output++) {
            CanvasUtil.fillCircle(canvas, xPosition + canvas.width / 4.5, canvas.height / 14 + radius + output * radius * 4, radius, 255, 255, 255, 0.8);
            CanvasUtil.writeText(canvas, `${moves[output]}`, xPosition + canvas.width / 4.3, canvas.height / 12.5 + radius + output * radius * 4, "left", "system-ui", 20, "white");
        }
    }
}
//# sourceMappingURL=Settings.js.map