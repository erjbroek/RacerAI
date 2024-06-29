import Track from "../Track.js";
import CanvasUtil from "../utilities/CanvasUtil.js";
import KeyListener from "../utilities/KeyListener.js";
import NetCar from "./NetCar.js";

export default class NetPopulation {
  public cars: NetCar[] = [];

  private nextGen: NetCar[] = [];

  private generation: number = 1;

  private size: number;

  private highScore: number = 0;

  public extinct: boolean = false;

  private track: Track;

  private startingPoint: number[];

  private startingAngle: number;

  private species: NetCar[][] = [];

  public generationTime: number = 0;

  public record: number = Infinity;

  public constructor(size: number, track: Track, startingPoint: number[], startingAngle: number) {
    this.size = 50;
    this.track = track;
    this.startingPoint = startingPoint;
    this.startingAngle = startingAngle;
    this.extinct = false;
    this.species = [];

    for (let i = 0; i < this.size; i++) {
      const genome = this.createInitialGenome();
      this.cars.push(new NetCar(startingPoint, startingAngle, genome));
    }

    this.track.road.forEach((road) => {
      road[2] = 1;
    });
  }

  /**
   *
   */
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

  /**
   *
   */
  public evolve() {
    this.speciate();
    this.calculateFitness();
    this.sortPlayers();
    this.crossover();
    this.mutate();
  }

  /**
   *
   */
  public speciate() {
    this.species = [];

    const threshold = 1.4;

    for (const car of this.cars) {
      let placed = false;

      // Try to place the car in an existing species
      for (const species of this.species) {
        if (this.genomeDistance(car.genome, species[0].genome) < threshold) {
          species.push(car);
          placed = true;
          break;
        }
      }

      // If no species are similar enough, create a new species
      if (!placed) {
        this.species.push([car]);
      }
    }
  }

  /**
   * calculates how different the genomes of the players are (the weights), so they can be grouped in species
   *
   * @param genome1 is the genome of the first car
   * @param genome2 the genome of the car that the first car is being compared with
   * @returns number that represents the difference between the two genomes
   */
  private genomeDistance(genome1: number[][], genome2: number[][]): number {
    let sumSquaredDifference = 0;

    const length1 = genome1.length;
    const length2 = genome2.length;
    const maxLength = length1 * length2;

    for (let i = 0; i < maxLength; i++) {
      const [input1, output1, weight1] = genome1[i] || [0, 0, 0];
      const [input2, output2, weight2] = genome2[i] || [0, 0, 0];

      sumSquaredDifference += (weight1 - weight2) ** 2;
    }

    return Math.sqrt(sumSquaredDifference);
  }

  /**
   *
   */
  public calculateFitness() {
    let highestDistanceCar: number = 0;
    let bestLapTime: number = Number.MAX_VALUE;

    this.cars.forEach((car) => {
      if (car.distance > highestDistanceCar) {
        highestDistanceCar = car.distance;
      }
      if (car.laps > 0) {
        const averageLapTime = car.totalLapTime / car.laps;
        if (averageLapTime < bestLapTime) {
          bestLapTime = averageLapTime;
        }
      }
    });

    // actual fitness function
    this.cars.forEach((car) => {
      // Base fitness on laps completed and penalize incomplete laps
      car.fitness = car.laps > 0 ? 1 + car.laps / 2 : 0.1;

      // Reward if race completed
      if (car.laps >= 5) {
        car.fitness *= 2;
      }

      // Reward based on average lap time
      if (car.laps > 0) {
        const relativeLapTime = car.totalLapTime / car.laps / bestLapTime;
        car.fitness *= 1 / relativeLapTime;
      } else {
        // Penalize cars that haven't completed a lap by using distance as a secondary metric
        car.fitness += car.distance / highestDistanceCar;
      }

      // cars that havent left the starting line are penalized
      if (!car.leftStartLine) {
        car.fitness *= 0.1;
      }
    });

    this.highScore = Math.max(this.highScore, ...this.cars.map((car) => car.fitness));
  }

  /**
   *
   */
  private sortPlayers() {
    this.species.forEach((species) => {
      species.sort((car1, car2) => car2.fitness - car1.fitness);
    });
  }

  /**
   *
   */
  private crossover(): void {
    // first, the selection of the best performing players of each species is selected for actual crossover
    const survived: NetCar[] = [];
    const selectedCars: NetCar[] = [];
    const selectionPercentage = 0.5; // Top 50% of each species survives

    this.species.forEach((species) => {
      const numToSelect = Math.ceil(species.length * selectionPercentage);
      const topCars = species.slice(0, numToSelect);
      survived.push(...topCars);
    });

    // creates the array, with probability of selection based on fitness
    survived.forEach((car) => {
      for (let i = 0; i <= Math.ceil(car.fitness * 100); i++) {
        selectedCars.push(car);
      }
    });
    this.nextGen = [];

    // makes the new generation
    for (let i = 0; i < this.size; i++) {
      const parent1 = selectedCars[Math.floor(Math.random() * selectedCars.length)];
      const parent2 = selectedCars[Math.floor(Math.random() * selectedCars.length)];
      const babyGenes: number[][] = [];
      for (let j = 0; j < 20; j++) {
        const weight1: any = parent1.genome[j][2];
        const weight2: any = parent2.genome[j][2];
        const newGene: number = Math.random() > 0.5 ? weight1 : weight2;
        babyGenes.push([Math.floor(j / 4), j % 4, newGene]);
      }
      this.nextGen.push(new NetCar(this.startingPoint, this.startingAngle, babyGenes));
    }
  }

  /**
   * mutates the network of the player
   */
  private mutate(): void {
    // the chance for each gene to mutate by 10%
    const slightMutationRate = 0.1;

    // the chance for each gene to get randomized
    const bigMutationRate = 0.02;

    this.nextGen.forEach((car) => {
      car.genome.forEach((gene) => {
        if (Math.random() < slightMutationRate) {
          gene[2] += Math.random() * 0.3 - 0.15;
        } else if (Math.random() < bigMutationRate) {
          gene[2] = Math.random();
        }

        // making sure the weights are between 0 and 1
        if (gene[2] > 1) {
          gene[2] = 1;
        }
        if (gene[2] < 0) {
          gene[2] = 0;
        }
      });
    });

    this.cars = this.nextGen;
  }

  /**
   * Update the population
   *
   * @param elapsed is the elapsed time since last frame
   */
  public update(elapsed: number) {
    this.generationTime += elapsed;

    this.cars.forEach((car) => {
      car.alive = this.track.checkCollisionWithTrack(car);

      // makes sure car doesnt get stuck in loop
      if (car.timeSinceLastLap >= 20000) {
        car.alive = false;
      }
      if (car.laps >= 5) {
        car.alive = false;
        this.record = Math.min(this.record, car.totalLapTime);
      }
  
      if (car.alive) {
        car.totalLapTime += elapsed;
        car.timeSinceLastLap += elapsed;

        // makes sure lap doesnt count if car waits at finish line
        if (car.totalLapTime >= 1700) {
          if (this.track.checkCrossingFinishLine(car)) {
            if (!car.crossingFinishLine) {
              car.laps += 1;
              car.crossingFinishLine = true;
              car.timeSinceLastLap = 0;
            }
          } else {
            car.crossingFinishLine = false;
          }
        }
        car.update(elapsed);
        car.updateDistance();
      } else {
        car.xSpeed = 0;
        car.ySpeed = 0;
      }
    });

    this.extinct = !this.cars.some((car) => car.alive);

    if (this.extinct) {
      this.extinct = true;
      this.generationTime = 0;
      this.evolve();
    }
  }

  /**
   *
   * @param car
   * @param canvas
   */
  public visualizeNetwork(car: NetCar, canvas: HTMLCanvasElement) {
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
   *
   * @param canvas is the selected canvas the items are drawn on
   */
  public render(canvas: HTMLCanvasElement) {
    this.cars.forEach((car) => {
      if (car.alive) {
        car.renderRays(canvas, this.track);
        CanvasUtil.drawCar(canvas, car.posX, car.posY, car.width, car.height, car.rotation, car.red, car.green, car.blue, 0.8);
      }
    });
    CanvasUtil.writeText(canvas, `generation: ${this.generation}`, canvas.width - canvas.width / 10, canvas.height / 10, "center", "arial", 20, "white");
    CanvasUtil.writeText(canvas, `highest fitness: ${Math.round(this.highScore)}`, canvas.width - canvas.width / 10, canvas.height / 8, "center", "arial", 20, "white");
    CanvasUtil.writeText(canvas, `Cars alive: ${this.cars.filter((car) => car.alive).length}`, canvas.width - canvas.width / 10, canvas.height / 7, "center", "arial", 20, "white");
    this.visualizeNetwork(this.cars[0], canvas);
    if (this.record !== Infinity) {
      CanvasUtil.writeText(canvas, `Record: ${this.record.toFixed(2)}`, canvas.width - canvas.width / 10, canvas.height / 6, "center", "arial", 20, "white");
    } else {
      CanvasUtil.writeText(canvas, `Record: N/A`, canvas.width - canvas.width / 10, canvas.height / 6, "center", "arial", 20, "white");
    }
    CanvasUtil.writeText(canvas, `current time: ${Math.round(this.generationTime)} ms`, canvas.width - canvas.width / 10, canvas.height / 5, "center", "arial", 20, "white");
    CanvasUtil.drawCircle(canvas, this.startingPoint[0], this.startingPoint[1], 60, 255, 0, 0, 1);
  }
}
