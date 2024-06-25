import Track from "../Track.js";
import CanvasUtil from "../utilities/CanvasUtil.js";
import KeyListener from "../utilities/KeyListener.js";
import NeftCar from "./NeftCar.js";

export default class NeftPopulation {
  public cars: NeftCar[] = [];

  private generation: number = 1;

  private size: number;

  private highScore: number = 0;

  public extinct: boolean = false;

  private track: Track;

  private startingPoint: number[];

  private startingAngle: number;

  private species: NeftCar[][] = [];

  private maxDistance: number = 0;

  public generationTime: number = 0;

  public constructor(size: number, track: Track, startingPoint: number[], startingAngle: number) {
    this.size = 10;
    this.track = track;
    this.startingPoint = startingPoint;
    this.startingAngle = startingAngle;
    this.extinct = false;
    this.species = [];

    for (let i = 0; i < this.size; i++) {
      const genome = this.createInitialGenome();
      this.cars.push(new NeftCar(startingPoint, startingAngle, genome));
    }

    this.track.road.forEach((road) => {
      road[2] = 1;
    });
  }

  public createInitialGenome(): number[][] {
    const genome: number[][] = [];
    // creates network of 5 inputs (the rays) and 4 outputs (directions, like left or accelerating)
    for (let input = 0; input < 5; input++) {
      for (let output = 0; output < 4; output++) {
        genome.push([input, output, Math.random()]);
      }
    }
    return genome;
  }

  public evolve() {
    console.log("evolving");
    this.speciate();
    this.calculateFitness();
    this.selection();
    this.crossover();
    this.mutate();
    this.generation += 1;
  }

  public speciate() {}

  public calculateFitness() {
    let highestDistanceCar: number = 0;
    this.cars.forEach((car) => {
      if (car.distance >= highestDistanceCar) {
        highestDistanceCar = car.distance;
      }
    });

    this.cars.forEach((car) => {
      car.fitness = 0.2 * car.distance;
      if (car.collided) {
        car.fitness /= 3;
      }
      if (car.finished) {
        car.fitness *= 3;
      }
    });

    this.highScore = Math.max(this.highScore, ...this.cars.map((car) => car.fitness));
  }

  public selection() {}

  public crossover() {}

  public mutate() {}

  /**
   * Update the population
   *
   * @param elapsed is the elapsed time since last frame
   */
  public update(elapsed: number) {
    this.generationTime += elapsed;

    let allAliveCarsFinished = true;


    this.cars.forEach((car) => {
      if (car.alive) {
        this.extinct = false;
        car.alive = this.track.checkCollisionWithTrack(car);
        if (car.alive) {
          if (this.generationTime >= 3000) {
            if (this.track.checkCrossingFinishLine(car)) {
              if (!car.crossingFinishLine) {
                car.laps += 1;
                car.crossingFinishLine = true;
                console.log(car.laps);
              }
            } else {
              car.crossingFinishLine = false;
            }
          }
          if (car.laps < 5) {
            allAliveCarsFinished = false;
          }
        }
        car.update(elapsed);
        car.updateDistance();
        if (car.distance > this.maxDistance) {
          this.maxDistance = car.distance;
        }
      }
    });

    if (this.extinct || allAliveCarsFinished) {
      this.extinct = true;
      this.generationTime = 0;
      this.evolve();
    }
  }

  public visualizeNetwork(car: NeftCar, canvas: HTMLCanvasElement) {
    CanvasUtil.fillRectangle(canvas, canvas.width / 30, canvas.height / 20, canvas.width / 4, canvas.height / 3.5, 0, 0, 0, 0.3, 5);
    CanvasUtil.writeText(canvas, "neural network of best car", canvas.width / 30 + canvas.width / 8, canvas.height / 20 + canvas.height / 3.8, "center", "arial", 20, "black");
    const radius = canvas.height / 60;

    car.genome.forEach((network) => {
      const [input, output, weight] = network;

      // positions for the connections and nodes
      const startX = canvas.width / 14;
      const startY = canvas.height / 14 + input * radius * 3;
      const endX = canvas.width / 4;
      const endY = canvas.height / 14 + radius + output * radius * 3;

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
      CanvasUtil.fillCircle(canvas, canvas.width / 14, canvas.height / 14 + input * radius * 3, radius, 255, 255, 255, 0.8);
      CanvasUtil.writeText(canvas, `${input}`, canvas.width / 14, canvas.height / 12.5 + input * radius * 3, "center", "arial", 20, "black");
    }
    for (let output = 0; output < 4; output++) {
      CanvasUtil.fillCircle(canvas, canvas.width / 4, canvas.height / 14 + radius + output * radius * 3, radius, 255, 255, 255, 0.8);
      CanvasUtil.writeText(canvas, `${output}`, canvas.width / 4, canvas.height / 12.5 + radius + output * radius * 3, "center", "arial", 20, "black");
    }
  }

  /**
   * Render the population
   * @param canvas is the selected canvas the items are drawn on
   */
  public render(canvas: HTMLCanvasElement) {
    this.cars.forEach((car) => {
      car.render(canvas, this.track);
      CanvasUtil.drawCar(canvas, car.posX, car.posY, car.width, car.height, car.rotation, 0.6, car.alive);
    });
    CanvasUtil.writeText(canvas, `generation: ${this.generation}`, canvas.width - canvas.width / 10, canvas.height / 10, "center", "arial", 20, "white");
    CanvasUtil.writeText(canvas, `highest fitness: ${Math.round(this.highScore)}`, canvas.width - canvas.width / 10, canvas.height / 8, "center", "arial", 20, "white");
    CanvasUtil.writeText(canvas, `Cars alive: ${this.cars.filter((car) => car.alive).length}`, canvas.width - canvas.width / 10, canvas.height / 7, "center", "arial", 20, "white");
    this.visualizeNetwork(this.cars[0], canvas);
  }
}
