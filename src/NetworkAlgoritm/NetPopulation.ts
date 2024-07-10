import Track from "../Track.js";
import CanvasUtil from "../utilities/CanvasUtil.js";
import KeyListener from "../utilities/KeyListener.js";
import NetCar from "./NetCar.js";
import Statistics from "./Statistics.js";

export default class NetPopulation {
  public cars: NetCar[] = [];

  private nextGen: NetCar[] = [];

  public champions: NetCar[] = [];

  private generation: number = 1;

  private size: number;

  private highScore: number = 0;

  public extinct: boolean = false;

  private finished: boolean = false;

  private track: Track;

  private startingPoint: number[];

  private startingAngle: number;

  private species: NetCar[][] = [];

  public trackTime: number = 0;

  public addLocationTimer: number = 50;

  public statistics: Statistics = new Statistics();

  public constructor(size: number, track: Track, startingPoint: number[], startingAngle: number) {
    this.size = size;
    this.track = track;
    this.startingPoint = startingPoint;
    this.startingAngle = startingAngle;
    this.extinct = false;
    this.species = [];

    for (let i = 0; i < this.size; i++) {
      const [genome, biases]: [number[][], number[]] = [this.createInitialGenome()[0], this.createInitialGenome()[1]];
      this.cars.push(new NetCar(startingPoint, startingAngle, genome, biases));
    }

    this.track.road.forEach((road) => {
      road[2] = 1;
    });
  }

  /**
   * creates the first network for each car
   *
   * @returns array with the initial genome and biases
   */
  public createInitialGenome(): [number[][], number[]] {
    const genome: number[][] = [];
    const biases: number[] = [];
    // creates network of 5 inputs (the rays) and 4 outputs (directions, like left or accelerating)
    for (let input = 0; input < 5; input++) {
      for (let output = 0; output < 4; output++) {
        genome.push([input, output, Math.random()]);
      }
    }

    for (let outputBias = 0; outputBias < 4; outputBias++) {
      biases.push(0);
    }
    return [genome, biases];
  }

  /**
   * after a population is extinct, these functions are called to choose the cars for the next generation (which will be mutated so that improvement is possible)
   */
  public evolve() {
    this.speciate();
    this.calculateFitness();
    this.sortPlayers();
    this.crossover();
    this.mutate();
    this.generation += 1;
  }

  /**
   *
   */
  public speciate() {
    this.species = [];

    const threshold = 0.7;

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
    this.cars.sort((car1, car2) => car2.fitness - car1.fitness);
  }

  /**
   *
   */
  private crossover(): void {
    // first, the selection of the best performing players of each species is selected for actual crossover
    const survived: NetCar[] = [];
    const selectedCars: NetCar[] = [];
    const selectionPercentage = 0.5; // Top 50% of each species survives

    // best 2 players survive without mutation
    this.champions = [];
    this.champions.push(new NetCar(this.startingPoint, this.startingAngle, this.cars[0].genome, this.cars[0].biases));
    this.champions.push(new NetCar(this.startingPoint, this.startingAngle, this.cars[1].genome, this.cars[1].biases));

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
    for (let i = 0; i < this.size - 2; i++) {
      const parent1 = selectedCars[Math.floor(Math.random() * selectedCars.length)];
      const parent2 = selectedCars[Math.floor(Math.random() * selectedCars.length)];
      const babyGenes: number[][] = [];

      // crossover of weights of connections
      for (let j = 0; j < 20; j++) {
        const weight1: any = parent1.genome[j][2];
        const weight2: any = parent2.genome[j][2];
        const newGene: number = Math.random() > 0.5 ? weight1 : weight2;
        babyGenes.push([Math.floor(j / 4), j % 4, newGene]);
      }

      // crossover of biases of output nodes
      const babyBiases: number[] = [];
      for (let k = 0; k < parent1.biases.length; k++) {
        const bias1 = parent1.biases[k];
        const bias2 = parent2.biases[k];
        const newBias = Math.random() > 0.5 ? bias1 : bias2;
        babyBiases.push(newBias);
      }
      this.nextGen.push(new NetCar(this.startingPoint, this.startingAngle, babyGenes, babyBiases));
    }
  }

  /**
   * mutates the network of the player
   */
  private mutate(): void {
    // the chance for each gene to mutate by 20%
    const slightMutationRate = 0.1;

    // the chance for each gene to get randomized
    const bigMutationRate = 0.025;

    this.nextGen.forEach((car) => {
      car.genome.forEach((gene) => {
        if (Math.random() < slightMutationRate) {
          gene[2] += Math.random() * 0.2 - 0.1;
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
      car.biases.forEach((bias, index) => {
        if (Math.random() < slightMutationRate) {
          car.biases[index] += Math.random() * 0.35 - 0.175; // Slight mutation
        } else if (Math.random() < bigMutationRate) {
          car.biases[index] = Math.random() * 2 - 1; // Big mutation, re-randomize bias in the range -1 to 1
        }

        // Ensure biases are within a reasonable range, e.g., -1 to 1
        car.biases[index] = Math.max(-1, Math.min(car.biases[index], 1));
      });
    });

    this.nextGen.push(...this.champions);
    this.cars = this.nextGen;
  }

  /**
   * Update the population
   *
   * @param elapsed is the elapsed time since last frame
   */
  public update(elapsed: number) {
    if (!this.finished) {
      this.trackTime += elapsed;
    }
    this.cars.forEach((car) => {
      car.alive = this.track.checkCollisionWithTrack(car);

      // makes sure car doesnt get stuck in loop
      if (car.timeSinceLastLap >= 15000) {
        car.alive = false;
      }

      // if car finishes, update record
      if (car.laps >= 5) {
        car.alive = false;
        if (car.totalLapTime < this.statistics.record && car.leftStartLine) {
          this.statistics.record = car.totalLapTime;
          this.statistics.bestGen = this.generation;
          this.statistics.recordHistory.push([this.statistics.record, this.statistics.bestGen]);
        }
        if (!this.statistics.addedToHistory && car.leftStartLine) {
          this.finished = true;
          this.statistics.performanceHistory.push(this.trackTime);
          this.statistics.addedToHistory = true;
        }
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
              this.statistics.currentHighestLaps = Math.max(this.statistics.currentHighestLaps, car.laps);
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

    this.handleCarLines(elapsed);
    this.extinct = !this.cars.some((car) => car.alive);

    if (this.extinct) {
      this.extinct = true;
      this.trackTime = 0;
      this.statistics.currentHighestLaps = 0;
      this.finished = false;
      this.statistics.addedToHistory = false;
      this.evolve();
    }
  }

  public handleCarLines(elapsed: number) {
    this.addLocationTimer -= elapsed;
    if (this.addLocationTimer <= 0) {
      this.addLocationTimer = 50;
      this.cars.forEach((car) => {
        car.locationHistory.push([car.posX, car.posY]);
      });
    }
  }

  public renderCarLines(canvas: HTMLCanvasElement) {
    this.cars.forEach((car) => {
      if (car.locationHistory.length >= 2) {
        if (car.locationHistory.length >= 40) {
          car.locationHistory.splice(0, 1);
        }
        for (let i = 1; i < car.locationHistory.length - 1; i++) {
          const opacity = (i / 41) * 0.3;
          CanvasUtil.drawLine(canvas, car.posX, car.posY, car.locationHistory[car.locationHistory.length - 1][0], car.locationHistory[car.locationHistory.length - 1][1], 255, 255, 255, 0.3, 1)
          CanvasUtil.drawLine(canvas, car.locationHistory[i][0], car.locationHistory[i][1], car.locationHistory[i - 1][0], car.locationHistory[i - 1][1], 255, 255, 255, opacity, 1)
        }
      }
    });
  }

  /**
   * Render the population
   *
   * @param canvas is the selected canvas the items are drawn on
   */
  public render(canvas: HTMLCanvasElement) {
    this.renderCarLines(canvas)
    this.cars.forEach((car) => {
      if (car.alive) {
        car.renderRays(canvas, this.track);
        CanvasUtil.drawCar(canvas, car.posX, car.posY, car.width, car.height, car.rotation, car.red, car.green, car.blue, 0.8);
      }
    });
    CanvasUtil.writeText(canvas, `lap ${this.statistics.currentHighestLaps} / 5`, canvas.width / 2.4, canvas.height / 10, "center", "system-ui", 30, "black");
    CanvasUtil.writeText(canvas, `Generation: ${this.generation}`, canvas.width - canvas.width / 12, canvas.height / 10, "center", "system-ui", 30, "white");
    CanvasUtil.writeText(canvas, `Cars alive: ${this.cars.filter((car) => car.alive).length} / ${this.size}`, canvas.width - canvas.width / 12, canvas.height / 8, "center", "system-ui", 20, "white");
    CanvasUtil.writeText(canvas, `Species: ${this.species.length}`, canvas.width - canvas.width / 12, canvas.height / 6, "center", "system-ui", 20, "white");

    this.statistics.renderButtons(canvas);
    this.statistics.renderNetwork(this.cars[0], canvas);

    if (this.statistics.record !== Infinity) {
      if (Math.floor(this.statistics.record % 1000) < 100) {
        CanvasUtil.writeText(canvas, `Record: ${Math.floor(this.statistics.record / 1000)}.0${Math.floor(this.statistics.record % 1000)} s`, canvas.width - canvas.width / 7.5, canvas.height / 4, "left", "system-ui", 20, "white");
      } else {
        CanvasUtil.writeText(canvas, `Record: ${Math.floor(this.statistics.record / 1000)}.${Math.floor(this.statistics.record % 1000)} s`, canvas.width - canvas.width / 7.5, canvas.height / 4, "left", "system-ui", 20, "white");
      }
      CanvasUtil.writeText(canvas, `Gen: ${this.statistics.bestGen}`, canvas.width - canvas.width / 17, canvas.height / 4, "left", "system-ui", 20, "grey");
    } else {
      CanvasUtil.writeText(canvas, `Record: N/A`, canvas.width - canvas.width / 7.5, canvas.height / 4, "left", "system-ui", 20, "white");
      CanvasUtil.writeText(canvas, `Gen: N/A`, canvas.width - canvas.width / 15, canvas.height / 4, "left", "system-ui", 20, "grey");
    }

    // renders record history
    if (this.statistics.recordHistory.length > 0) {
      CanvasUtil.writeText(canvas, `Generations that beat record`, canvas.width - canvas.width / 8, canvas.height / 3.1, "left", "system-ui", 15, "grey");
      CanvasUtil.drawLine(canvas, canvas.width - canvas.width / 6.5, canvas.height / 3, canvas.width - canvas.width / 6.5 + canvas.width / 7, canvas.height / 3, 255, 255, 255, 0.2, 2);

      const start = canvas.height / 2.6;
      for (let i = 0; i < this.statistics.recordHistory.length; i++) {
        if (Math.floor(this.statistics.recordHistory[i][0] % 1000) < 100) {
          CanvasUtil.writeText(canvas, `Record: ${Math.floor(this.statistics.recordHistory[i][0] / 1000)}.0${Math.floor(this.statistics.recordHistory[i][0] % 1000)} s`, canvas.width - canvas.width / 7.5, start + i * (canvas.height / 45), "left", "system-ui", 20, "grey");
        } else {
          CanvasUtil.writeText(canvas, `Record: ${Math.floor(this.statistics.recordHistory[i][0] / 1000)}.${Math.floor(this.statistics.recordHistory[i][0] % 1000)} s`, canvas.width - canvas.width / 7.5, start + i * (canvas.height / 45), "left", "system-ui", 20, "grey");
        }
        CanvasUtil.writeText(canvas, `Gen: ${this.statistics.recordHistory[i][1]}`, canvas.width - canvas.width / 17, start + i * (canvas.height / 45), "left", "system-ui", 20, "grey");
      }
    }

    if (this.trackTime % 1000 < 100) {
      CanvasUtil.writeText(canvas, `${Math.floor(this.trackTime / 1000)}.0${Math.floor(this.trackTime % 1000)} s`, canvas.width - canvas.width / 13, canvas.height / 5, "center", "system-ui", 20, "grey");
    } else {
      CanvasUtil.writeText(canvas, `${Math.floor(this.trackTime / 1000)}.${Math.floor(this.trackTime % 1000)} s`, canvas.width - canvas.width / 13, canvas.height / 5, "center", "system-ui", 20, "grey");
    }

    // CanvasUtil.drawCircle(canvas, this.startingPoint[0], this.startingPoint[1], 120, 255, 0, 0, 1);
    if (this.statistics.performanceHistory.length > 0) {
      this.statistics.renderGraph(canvas);
    }
  }
}
