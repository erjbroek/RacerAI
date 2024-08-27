import MouseListener from "../utilities/MouseListener.js";
import CanvasUtil from "../utilities/CanvasUtil.js";
import NetCar from "./NetCar.js";
import NetPopulation from "./NetPopulation.js";
import DisplayCar from "./DisplayCar.js";
import UI from "../utilities/UI.js";

export default class Statistics {
  public showAdvancedStats: boolean = false;

  public showNetwork: boolean = false;

  public showGraph: boolean = true;

  public renderRacingLines: boolean = true;

  public static performanceHistory: Array<[number, number, DisplayCar]> = [];

  public static record: number = Infinity;

  public recordHistory: Array<[number, number, DisplayCar]> = [];

  public addedToHistory: boolean = false;

  public static bestGen: number = 1;

  public static currentHighestLaps: number = 0;

  public static carsAlive: number = 0;

  public static species: number = 0;

  public static slightMutationRate: number = 0.2;

  public static bigMutationRate: number = 0.035;

  public static selectionPercentage: number = 0.5;

  public static size: number = 0;

  public static recordCar: DisplayCar = new DisplayCar([]);

  private highest: number = 0;

  private lowest: number = Infinity

  /**
   *
   */
  public constuctor() {}

  /**
   *
   */
  public processInput() {
    if (MouseListener.buttonPressed(0)) {
      if (MouseListener.mouseCoordinates.x >= window.innerWidth / 8.9 && MouseListener.mouseCoordinates.y >= window.innerHeight / 33 && MouseListener.mouseCoordinates.x <= window.innerWidth / 8.9 + window.innerWidth / 22.5 && MouseListener.mouseCoordinates.y <= window.innerHeight / 33 + window.innerHeight / 22.5) {
        this.renderRacingLines = !this.renderRacingLines;
      }
      if (MouseListener.mouseCoordinates.x >= window.innerWidth / 1.95 && MouseListener.mouseCoordinates.y >= window.innerHeight / 33 && MouseListener.mouseCoordinates.x <= window.innerWidth / 1.95 + window.innerWidth / 22.5 && MouseListener.mouseCoordinates.y <= window.innerHeight / 33 + window.innerHeight / 22.5) {
        this.showGraph = !this.showGraph;
      }
    }
  }

  public update(elapsed: number) {

  }

  /**
   *
   * @param canvas is the canvas to render on
   */
  public renderButtons(canvas: HTMLCanvasElement) {
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

  /**
   *
   * @param canvas is the canvas to render on
   */
  public renderGraph(canvas: HTMLCanvasElement) {
    const top: number = canvas.height / 1.4;
    const height: number = canvas.height / 5;
    const width: number = canvas.width / 8;
    const bottom: number = top + height;
    const left: number = canvas.width - canvas.width / 7;
    if (Statistics.performanceHistory.length === 1) {
      [this.highest, this.lowest] = [Statistics.performanceHistory[0][0] * 1.01, Statistics.performanceHistory[0][0] / 1.01];
    } else {
      Statistics.performanceHistory.forEach((index) => {
        this.highest = Math.max(index[0], this.highest);
        this.lowest = Math.min(index[0], this.lowest);
      })
    }
    CanvasUtil.fillRectangle(canvas, left, top, width, height, 0, 0, 0, 1, 5);

    const numGridLines = 5;

    for (let i = 0; i < numGridLines; i++) {
      const value = this.lowest + (i * (this.highest - this.lowest)) / (numGridLines - 1);
      const y = bottom - height * 0.1 - height * 0.8 * ((value - this.lowest) / (this.highest - this.lowest));
      CanvasUtil.drawLine(canvas, left + width * 0.05, y, left + width * 0.95, y, 255, 255, 255, 0.2, 1);
      const labelText = `${Math.floor(value / 1000)}.${`00${Math.floor(value % 1000)}`.slice(-3)} s`;
      CanvasUtil.writeText(canvas, labelText, left - 10, y, "right", "system-ui", 10, "white");
    }

    for (let i = 0; i < Statistics.performanceHistory.length; i++) {
      const time = Statistics.performanceHistory[i][0];
      const yNormalized = (time - this.lowest) / (this.highest - this.lowest);
      const x = left + width * 0.1 + ((width * 0.8) / Statistics.performanceHistory.length) * i;
      const y = bottom - height * 0.1 - height * 0.8 * yNormalized;

      if (Statistics.performanceHistory.indexOf(Statistics.performanceHistory[i]) > 0) {
        const lastTime = Statistics.performanceHistory[i - 1][0];
        const lastYNormalized = (lastTime - this.lowest) / (this.highest - this.lowest);
        const lastX = left + width * 0.1 + ((width * 0.8) / Statistics.performanceHistory.length) * (i - 1);
        const lastY = bottom - height * 0.1 - height * 0.8 * lastYNormalized;
        CanvasUtil.drawLine(canvas, lastX, lastY, x, y, 255, 255, 255, 0.5, 1);
      }

      CanvasUtil.fillCircle(canvas, x, y, 3, 255, 255, 255, 1);
      if (Statistics.performanceHistory.length <= 7 || time === this.highest || time === this.lowest) {
        const timeText = `${Math.floor(time / 1000)}.${`00${Math.floor(time % 1000)}`.slice(-3)} s`;
        CanvasUtil.writeText(canvas, timeText, x, y - 10, "center", "system-ui", 10, "white");
      }
    }
  }

  /**
   *
   * @param car
   * @param canvas
   */
  public renderNetwork(cars: NetCar[], canvas: HTMLCanvasElement) {
    const sortedCars = cars
      .filter((car) => car.alive)
      .sort((car1, car2) => {
        if (car1.laps === car2.laps) {
          return car2.distance - car1.distance;
        }
        return car2.laps - car1.laps;
      });
    const xPosition: number = canvas.width / 50;
    const yPosition: number = canvas.height / 1.6;
    CanvasUtil.fillRectangle(canvas, xPosition + canvas.width / 30, yPosition, canvas.width / 3.22, canvas.height / 3.5, 0, 0, 0, 0.3, 10);
    if (!sortedCars[0].alive) {
      CanvasUtil.writeText(canvas, "neural network of best car (died)", xPosition + canvas.width / 30 + canvas.width / 8, yPosition + canvas.height / 3.8, "center", "system-ui", 20, "white");
    } else {
      CanvasUtil.writeText(canvas, "neural network of best car", xPosition + canvas.width / 30 + canvas.width / 8, yPosition + canvas.height / 3.8, "center", "system-ui", 20, "white");
    }
    const radius = canvas.height / 90;
    const { biases } = sortedCars[0];

    sortedCars[0].genome.forEach((network) => {
      const [input, output, weight] = network;

      // positions for the connections and nodes
      const startX = xPosition + canvas.width / 12;
      const startY = yPosition + canvas.height / 30 + input * radius * 4;
      const endX = xPosition + canvas.width / 3.5;
      const endY = yPosition + canvas.height / 30 + radius + output * radius * 4;

      // displaying color using input value of corresponding node (input values being the ray lengths)
      // displaying thickness of line using weight of connection
      const lineWidth = weight * 10;
      const rayLength = sortedCars[0].rayLengths[input];
      const ratio = rayLength / 100;
      const red = Math.floor(255 * (1 - ratio));
      const green = Math.floor(255 * ratio);

      if (!sortedCars[0].alive) {
        CanvasUtil.drawLine(canvas, startX, startY, endX, endY, red / 2, green / 2, 0, 0.8, lineWidth);
      } else {
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
