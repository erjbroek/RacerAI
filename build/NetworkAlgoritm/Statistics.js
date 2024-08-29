import MouseListener from "../utilities/MouseListener.js";
import CanvasUtil from "../utilities/CanvasUtil.js";
import DisplayCar from "./DisplayCar.js";
export default class Statistics {
    showAdvancedStats = false;
    showNetwork = false;
    showGraph = true;
    renderRacingLines = true;
    static performanceHistory = [];
    static record = Infinity;
    recordHistory = [];
    addedToHistory = false;
    static bestGen = 1;
    static currentHighestLaps = 0;
    static carsAlive = 0;
    static species = 0;
    static slightMutationRate = 0.2;
    static bigMutationRate = 0.035;
    static selectionPercentage = 0.5;
    static size = 0;
    static recordCar = new DisplayCar([]);
    static championsSurvive = true;
    static highest = -Infinity;
    static lowest = Infinity;
    constuctor() { }
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
    update(elapsed) { }
    renderButtons(canvas) {
        CanvasUtil.fillRectangle(canvas, canvas.width / 10, canvas.height / 75, canvas.width / 1.85, canvas.height / 18, 50, 50, 50, 1, canvas.height / 100);
        CanvasUtil.fillRectangle(canvas, canvas.width / 8.9, canvas.height / 33, canvas.height / 45, canvas.height / 45, 150, 150, 150, 1, canvas.height / 200);
        CanvasUtil.drawRectangle(canvas, canvas.width / 8.9, canvas.height / 33, canvas.height / 45, canvas.height / 45, 30, 30, 30, 1, 1, canvas.height / 200);
        CanvasUtil.writeText(canvas, "render racing lines", canvas.width / 7.9, canvas.height / 21.5, "left", "system-ui", 15, "white");
        if (this.renderRacingLines) {
            CanvasUtil.fillCircle(canvas, canvas.width / 8.9 + canvas.width / 180, canvas.height / 33 + canvas.height / 90, canvas.height / 130, 0, 0, 0, 1);
        }
        CanvasUtil.fillRectangle(canvas, canvas.width / 4.6, canvas.height / 33, canvas.height / 45, canvas.height / 45, 150, 150, 150, 1, canvas.height / 200);
        CanvasUtil.drawRectangle(canvas, canvas.width / 4.6, canvas.height / 33, canvas.height / 45, canvas.height / 45, 30, 30, 30, 1, 1, canvas.height / 200);
        CanvasUtil.writeText(canvas, "show advanced stats", canvas.width / 4.3, canvas.height / 21.5, "left", "system-ui", 15, "white");
        if (this.showAdvancedStats) {
            CanvasUtil.fillCircle(canvas, canvas.width / 4.6 + canvas.width / 180, canvas.height / 33 + canvas.height / 90, canvas.height / 130, 0, 0, 0, 1);
        }
        if (Statistics.performanceHistory.length > 0) {
            CanvasUtil.fillRectangle(canvas, canvas.width / 1.95, canvas.height / 33, canvas.height / 45, canvas.height / 45, 150, 150, 150, 1, canvas.height / 200);
            CanvasUtil.drawRectangle(canvas, canvas.width / 1.95, canvas.height / 33, canvas.height / 45, canvas.height / 45, 30, 30, 30, 1, 1, canvas.height / 200);
            CanvasUtil.writeText(canvas, "render performance graph", canvas.width / 1.9, canvas.height / 21.5, "left", "system-ui", 15, "white");
            if (this.showGraph) {
                CanvasUtil.fillCircle(canvas, canvas.width / 1.95 + canvas.width / 180, canvas.height / 33 + canvas.height / 90, canvas.height / 130, 0, 0, 0, 1);
            }
        }
    }
    renderNetwork(cars, canvas) {
        const sortedCars = cars
            .filter((car) => car.alive)
            .sort((car1, car2) => {
            if (car1.laps === car2.laps) {
                return car2.distance - car1.distance;
            }
            return car2.laps - car1.laps;
        });
        const xPosition = canvas.width / 50;
        const yPosition = canvas.height / 1.6;
        CanvasUtil.fillRectangle(canvas, xPosition + canvas.width / 30, yPosition, canvas.width / 3.22, canvas.height / 3.5, 0, 0, 0, 0.3, 10);
        if (!sortedCars[0].alive) {
            CanvasUtil.writeText(canvas, "neural network of best car (died)", xPosition + canvas.width / 30 + canvas.width / 8, yPosition + canvas.height / 3.8, "center", "system-ui", 20, "white");
        }
        else {
            CanvasUtil.writeText(canvas, "neural network of best car", xPosition + canvas.width / 30 + canvas.width / 8, yPosition + canvas.height / 3.8, "center", "system-ui", 20, "white");
        }
        const radius = canvas.height / 90;
        const { biases } = sortedCars[0];
        sortedCars[0].genome.forEach((network) => {
            const [input, output, weight] = network;
            const startX = xPosition + canvas.width / 12;
            const startY = yPosition + canvas.height / 30 + input * radius * 4;
            const endX = xPosition + canvas.width / 3.5;
            const endY = yPosition + canvas.height / 30 + radius + output * radius * 4;
            const lineWidth = weight * 10;
            const rayLength = sortedCars[0].rayLengths[input];
            const ratio = rayLength / 100;
            const red = Math.floor(255 * (1 - ratio));
            const green = Math.floor(255 * ratio);
            if (!sortedCars[0].alive) {
                CanvasUtil.drawLine(canvas, startX, startY, endX, endY, red / 2, green / 2, 0, 0.8, lineWidth);
            }
            else {
                CanvasUtil.drawLine(canvas, startX, startY, endX, endY, red, green, 0, 0.8, lineWidth);
            }
        });
        for (let input = 0; input < 5; input++) {
            CanvasUtil.fillCircle(canvas, xPosition + canvas.width / 12, yPosition + canvas.height / 30 + input * radius * 4, radius, 255, 255, 255, 0.8);
            CanvasUtil.writeText(canvas, `ray ${input + 1}`, xPosition + canvas.width / 22, yPosition + canvas.height / 25 + input * radius * 4, "left", "system-ui", 20, "white");
        }
        const moves = ["left", "right", "gas", "brake"];
        for (let output = 0; output < 4; output++) {
            CanvasUtil.fillCircle(canvas, xPosition + canvas.width / 3.5, yPosition + canvas.height / 30 + radius + output * radius * 4, radius, 255, 255, 255, 0.8);
            CanvasUtil.writeText(canvas, `${moves[output]}`, xPosition + canvas.width / 3.35, yPosition + canvas.height / 23 + radius + output * radius * 4, "left", "system-ui", 20, "white");
        }
    }
}
//# sourceMappingURL=Statistics.js.map