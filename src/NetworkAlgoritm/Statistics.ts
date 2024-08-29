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

  public static championsSurvive: boolean = true;

  public static highest: number = -Infinity;

  public static lowest: number = Infinity;

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

  public update(elapsed: number) {}

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
