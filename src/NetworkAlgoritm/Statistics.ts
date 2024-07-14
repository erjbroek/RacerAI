import MouseListener from '../utilities/MouseListener.js';
import CanvasUtil from "../utilities/CanvasUtil.js";
import NetCar from "./NetCar.js";
import NetPopulation from './NetPopulation.js';

export default class Statistics {
  public showAdvancedStats: boolean = false;

  public showNetwork: boolean = false;

  public showGraph: boolean = true;

  public renderRacingLines: boolean = true;

  public performanceHistory: number[] = [];

  public record: number = Infinity;

  public recordHistory: number[][] = [];

  public addedToHistory: boolean = false;

  public bestGen: number = 1;

  public currentHighestLaps: number = 0;

  public constuctor() {
  }

  public processInput() {
    if (MouseListener.buttonPressed(0)) {
      if (MouseListener.mouseCoordinates.x >= window.innerWidth / 9 && MouseListener.mouseCoordinates.y >= window.innerHeight / 33 && MouseListener.mouseCoordinates.x <= window.innerWidth / 9 + window.innerWidth / 22.5 && MouseListener.mouseCoordinates.y <= window.innerHeight / 33 + window.innerHeight / 22.5) {
        this.showNetwork = !this.showNetwork;
      }
      if (MouseListener.mouseCoordinates.x >= window.innerWidth / 4.2 && MouseListener.mouseCoordinates.y >= window.innerHeight / 33 && MouseListener.mouseCoordinates.x <= window.innerWidth / 4.2 + window.innerWidth / 22.5 && MouseListener.mouseCoordinates.y <= window.innerHeight / 33 + window.innerHeight / 22.5) {
        this.showGraph = !this.showGraph;
      }
      if (MouseListener.mouseCoordinates.x >= window.innerWidth / 2.6 && MouseListener.mouseCoordinates.y >= window.innerHeight / 33 && MouseListener.mouseCoordinates.x <= window.innerWidth / 2.6 + window.innerWidth / 22.5 && MouseListener.mouseCoordinates.y <= window.innerHeight / 33 + window.innerHeight / 22.5) {
        this.showAdvancedStats = !this.showAdvancedStats;
      }
      if (MouseListener.mouseCoordinates.x >= window.innerWidth / 1.95 && MouseListener.mouseCoordinates.y >= window.innerHeight / 33 && MouseListener.mouseCoordinates.x <= window.innerWidth / 1.95 + window.innerWidth / 22.5 && MouseListener.mouseCoordinates.y <= window.innerHeight / 33 + window.innerHeight / 22.5) {
        this.renderRacingLines = !this.renderRacingLines;
      }
    }
  }

  public renderSettings(canvas: HTMLCanvasElement) {}

  public renderButtons(canvas: HTMLCanvasElement) {
    CanvasUtil.fillRectangle(canvas, canvas.width / 10, canvas.height / 75, canvas.width / 2, canvas.height / 18, 50, 50, 50, 1, canvas.height / 100);

    CanvasUtil.fillRectangle(canvas, canvas.width / 9, canvas.height / 33, canvas.height / 45, canvas.height / 45, 150, 150, 150, 1, canvas.height / 200);
    CanvasUtil.drawRectangle(canvas, canvas.width / 9, canvas.height / 33, canvas.height / 45, canvas.height / 45, 30, 30, 30, 1, 1, canvas.height / 200);
    CanvasUtil.writeText(canvas, 'render neural network', canvas.width / 8, canvas.height / 21.5, 'left', 'system-ui', 15, 'white');
    if (this.showNetwork) {
      CanvasUtil.fillCircle(canvas, canvas.width / 9 + canvas.width / 180, canvas.height / 33 + canvas.height / 90, canvas.height / 130, 0, 0, 0, 1);
    }

    CanvasUtil.fillRectangle(canvas, canvas.width / 4.2, canvas.height / 33, canvas.height / 45, canvas.height / 45, 150, 150, 150, 1, canvas.height / 200);
    CanvasUtil.drawRectangle(canvas, canvas.width / 4.2, canvas.height / 33, canvas.height / 45, canvas.height / 45, 30, 30, 30, 1, 1, canvas.height / 200);
    CanvasUtil.writeText(canvas, 'render performance graph', canvas.width / 3.95, canvas.height / 21.5, 'left', 'system-ui', 15, 'white');
    if (this.showGraph) {
      CanvasUtil.fillCircle(canvas, canvas.width / 4.2 + canvas.width / 180, canvas.height / 33 + canvas.height / 90, canvas.height / 130, 0, 0, 0, 1);
    }

    CanvasUtil.fillRectangle(canvas, canvas.width / 2.6, canvas.height / 33, canvas.height / 45, canvas.height / 45, 150, 150, 150, 1, canvas.height / 200);
    CanvasUtil.drawRectangle(canvas, canvas.width / 2.6, canvas.height / 33, canvas.height / 45, canvas.height / 45, 30, 30, 30, 1, 1, canvas.height / 200);
    CanvasUtil.writeText(canvas, 'show advanced stats', canvas.width / 2.5, canvas.height / 21.5, 'left', 'system-ui', 15, 'white');
    if (this.showAdvancedStats) {
      CanvasUtil.fillCircle(canvas, canvas.width / 2.6 + canvas.width / 180, canvas.height / 33 + canvas.height / 90, canvas.height / 130, 0, 0, 0, 1);
    }

    CanvasUtil.fillRectangle(canvas, canvas.width / 1.95, canvas.height / 33, canvas.height / 45, canvas.height / 45, 150, 150, 150, 1, canvas.height / 200);
    CanvasUtil.drawRectangle(canvas, canvas.width / 1.95, canvas.height / 33, canvas.height / 45, canvas.height / 45, 30, 30, 30, 1, 1, canvas.height / 200);
    CanvasUtil.writeText(canvas, 'render racing lines', canvas.width / 1.9, canvas.height / 21.5, 'left', 'system-ui', 15, 'white');
    if (this.renderRacingLines) {
      CanvasUtil.fillCircle(canvas, canvas.width / 1.95 + canvas.width / 180, canvas.height / 33 + canvas.height / 90, canvas.height / 130, 0, 0, 0, 1);
    }
  }

  public renderGraph(canvas: HTMLCanvasElement) {
    const top: number = canvas.height / 1.4;
    const height: number = canvas.height / 5;
    const width: number = canvas.width / 8;
    const bottom: number = top + height;
    const left: number = canvas.width - canvas.width / 7;
    let highest: number = 0;
    let lowest: number = 0;
    if (this.performanceHistory.length === 1) {
      [highest, lowest] = [this.performanceHistory[0] * 1.01, this.performanceHistory[0] / 1.01];
    } else {
      highest = Math.max(...this.performanceHistory);
      lowest = Math.min(...this.performanceHistory);
    }
    CanvasUtil.fillRectangle(canvas, left, top, width, height, 0, 0, 0, 1, 5);

    const numGridLines = 5;

    for (let i = 0; i < numGridLines; i++) {
      const value = lowest + (i * (highest - lowest)) / (numGridLines - 1);
      const y = bottom - height * 0.1 - height * 0.8 * ((value - lowest) / (highest - lowest));
      CanvasUtil.drawLine(canvas, left + width * 0.05, y, left + width * 0.95, y, 255, 255, 255, 0.2, 1);
      const labelText = `${Math.floor(value / 1000)}.${("00" + Math.floor(value % 1000)).slice(-3)} s`;
      CanvasUtil.writeText(canvas, labelText, left - 10, y, "right", "system-ui", 10, "white");
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
        const timeText = `${Math.floor(time / 1000)}.${("00" + Math.floor(time % 1000)).slice(-3)} s`;
        CanvasUtil.writeText(canvas, timeText, x, y - 10, "center", "system-ui", 10, "white");
      }
    }
  }

  /**
   *
   * @param car
   * @param canvas
   */
  public renderNetwork(car: NetCar, canvas: HTMLCanvasElement) {
    const xPosition: number = canvas.width / 1.73;
    CanvasUtil.fillRectangle(canvas, xPosition + canvas.width / 30, canvas.height / 20, canvas.width / 4.5, canvas.height / 3.5, 0, 0, 0, 0.3, 5);
    CanvasUtil.writeText(canvas, "neural network of best car", xPosition + canvas.width / 30 + canvas.width / 8, canvas.height / 20 + canvas.height / 3.8, "center", "system-ui", 20, "black");
    const radius = canvas.height / 90;
    const biases: number[] = car.biases;

    car.genome.forEach((network) => {
      const [input, output, weight] = network;

      // positions for the connections and nodes
      const startX = xPosition + canvas.width / 14;
      const startY = canvas.height / 14 + input * radius * 4;
      const endX = xPosition + canvas.width / 4.5;
      const endY = canvas.height / 14 + radius + output * radius * 4;

      // displaying color using input value of corresponding node (input values being the ray lengths)
      // displaying thickness of line using weight of connection
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
    const moves = ["left", "right", "gas", "brake"];

    for (let output = 0; output < 4; output++) {
      CanvasUtil.fillCircle(canvas, xPosition + canvas.width / 4.5, canvas.height / 14 + radius + output * radius * 4, radius, 255, 255, 255, 0.8);
      CanvasUtil.writeText(canvas, `${moves[output]}`, xPosition + canvas.width / 4.3, canvas.height / 12.5 + radius + output * radius * 4, "left", "system-ui", 20, "white");
    }
  }
}
