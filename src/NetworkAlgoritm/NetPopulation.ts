import UI from '../utilities/UI.js';
import Track from '../Track.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import KeyListener from '../utilities/KeyListener.js';
import DisplayCar from './DisplayCar.js';
import NetCar from './NetCar.js';
import Statistics from './Statistics.js';
import Usercar from './Usercar.js';
import DrawTrack from '../scenes/DrawTrack.js';

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

  public usercar: Usercar;

  public statistics: Statistics = new Statistics();

  public raceCountdown: number = 5000;

  public startCountdown: boolean = false;

  public constructor(size: number, track: Track, startingPoint: number[], startingAngle: number) {
    this.size = size;
    Statistics.size = size;
    this.track = track;
    this.startingPoint = startingPoint;
    this.startingAngle = startingAngle;
    this.extinct = false;
    this.species = [];

    for (let i = 0; i < this.size; i++) {
      const [genome, biases]: [number[][], number[]] = [this.createInitialGenome()[0], this.createInitialGenome()[1]];
      this.cars.push(new NetCar(startingPoint, startingAngle, genome, biases));
    }
    this.usercar = new Usercar(startingPoint, startingAngle);

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
   * speciates car into species.
   * similar cars get put into similar species
   * this way, diversity between the population is promoted, and makes sure cars get less stuck in local minima
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
   * calculates the fitness of each car based on:
   * - amount of laps completed
   * - completion time
   * - distance travelled
   *
   * more & faster laps = higher fitness
   * distance is used if no laps have been completed
   */
  public calculateFitness() {
    this.cars.forEach((car) => {
      if (car.laps > 0) {
        car.fitness = ((1 / (car.raceDuration / 1000)) * 100) ** car.laps;
      } else {
        car.fitness += car.distance / 1000;
      }

      // Penalize cars that haven't left the starting line
      if (!car.leftStartLine) {
        car.fitness = 0;
      }
    });

    // Update high score with the maximum fitness value
    this.highScore = Math.max(this.highScore, ...this.cars.map((car) => car.fitness));
  }

  /**
   * sorts players/ cars and species based on their fitnes
   */
  private sortPlayers() {
    this.species.forEach((species) => {
      species.sort((car1, car2) => car2.fitness - car1.fitness);
    });
    this.cars = this.cars.sort((car1, car2) => car2.fitness - car1.fitness);
  }

  /**
   *
   */
  private crossover(): void {
    // first, the selection of the best performing players of each species is selected for actual crossover
    const survived: NetCar[] = [];
    const selectedCars: NetCar[] = [];
    const { selectionPercentage } = Statistics; // Top 50% of each species survives

    if (Statistics.championsSurvive) {
      // best 2 players survive without mutation
      this.champions = [];
      this.champions.push(new NetCar(this.startingPoint, this.startingAngle, this.cars[0].genome, this.cars[0].biases));
      this.champions.push(new NetCar(this.startingPoint, this.startingAngle, this.cars[1].genome, this.cars[1].biases));
    }

    this.species.forEach((species) => {
      const numToSelect = Math.ceil(species.length * selectionPercentage);
      const topCars = species.slice(0, numToSelect);
      survived.push(...topCars);
    });

    // Adds all fitness together
    const totalFitness = survived.reduce((sum, car) => sum + car.fitness, 0);

    // The total fitness is used to select a random car

    // uses roulette wheel selection to select the next cars proportionate to fitness of the car
    // It checks a random point in totalFitness, and if the
    // fitness of the car is below that random point, the car gets added.
    // - example:
    // - if the total fitness is 100, and 1 car has a fitness of 50%
    // - there would be a 50% chance that car gets added
    // - if the random point is 30, it would get added
    // - if the random point is 80, the cars fitness (50) will get subtracked until a car with higher fitness gets selected
    // to summarize, a higher fitness means higher chance to get picked
    function selectCar(survived: NetCar[]) {
      let random = Math.random() * totalFitness;
      for (const car of survived) {
        if (random < car.fitness) {
          return car;
        }
        random -= car.fitness;
      }

      // should always find a car, but in the edge case that it doesn't
      // it returns the last car
      return survived[survived.length - 1];
    }

    // the NextGen array is the array used to save the next generation of cars
    this.nextGen = [];
    for (let i = 0; i < this.size - 2; i++) {
      // selects 2 random cars used as parent for the new car
      const parent1 = selectCar(survived);
      const parent2 = selectCar(survived);
      const babyGenes = [];

      // Crossover of weights of connections
      for (let j = 0; j < 20; j++) {
        const weight1 = parent1.genome[j][2];
        const weight2 = parent2.genome[j][2];
        const newGene = Math.random() > 0.5 ? weight1 : weight2;
        babyGenes.push([Math.floor(j / 4), j % 4, newGene]);
      }

      // Crossover of biases of output nodes
      const babyBiases = [];
      for (let k = 0; k < parent1.biases.length; k++) {
        const bias1 = parent1.biases[k];
        const bias2 = parent2.biases[k];
        const newBias = Math.random() > 0.5 ? bias1 : bias2;
        babyBiases.push(newBias);
      }

      // Adds car to next generation
      this.nextGen.push(new NetCar(this.startingPoint, this.startingAngle, babyGenes, babyBiases));
    }
  }

  /**
   * mutates the network of the player
   */
  private mutate(): void {
    const { slightMutationRate } = Statistics;
    const { bigMutationRate } = Statistics;
    console.log(`slightMutationRate: ${slightMutationRate}, bigMutationRate: ${bigMutationRate}`);

    this.nextGen.forEach((car) => {
      car.genome.forEach((gene) => {
        if (Math.random() < slightMutationRate) {
          gene[2] += Math.random() * 0.25 - 0.125;
        }
        if (Math.random() < bigMutationRate) {
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

      // mutating biasses (currently not used in feedforward though)
      car.biases.forEach((bias, index) => {
        if (Math.random() < slightMutationRate) {
          car.biases[index] += Math.random() * 0.35 - 0.175; // Slight mutation
        } else if (Math.random() < bigMutationRate) {
          car.biases[index] = Math.random() * 2 - 1; // Big mutation, randomize bias in the range -1 to 1
        }

        // Ensure biases are within -1 and 1
        car.biases[index] = Math.max(-1, Math.min(car.biases[index], 1));
      });
    });

    if (Statistics.championsSurvive) {
      this.nextGen.push(...this.champions);
    }
    this.cars = this.nextGen;
  }

  /**
   * Update the population
   *
   * @param elapsed is the elapsed time since last frame
   */
  public update(elapsed: number) {
    if (KeyListener.keyPressed('Delete')) {
      if (DrawTrack.racing) {
        this.startCountdown = true;
        this.raceCountdown = 5000;
      }
    }
    if (DrawTrack.racing) {
      if (this.startCountdown) {
        this.raceCountdown -= elapsed;
        this.usercar = new Usercar(this.startingPoint, this.startingAngle);
      }
      if (this.raceCountdown <= 0) {
        this.startCountdown = false;
        this.usercar.update(elapsed, this.track);
      }
    }

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
        car.finished = true;
        car.alive = false;
        if (car.raceDuration < Statistics.record && car.leftStartLine) {
          Statistics.record = car.raceDuration;
          Statistics.bestGen = this.generation;
          Statistics.recordCar.genome = car.genome;
          this.statistics.recordHistory.push([Statistics.record, Statistics.bestGen, new DisplayCar(car.genome)]);
        }
        if (!this.statistics.addedToHistory && car.leftStartLine) {
          this.finished = true;
          Statistics.performanceHistory.push([this.trackTime, this.generation, new DisplayCar(car.genome)]);
          this.statistics.addedToHistory = true;
        }
      }

      if (car.alive) {
        car.raceDuration += elapsed;
        car.timeSinceLastLap += elapsed;

        // makes sure lap doesnt count if car waits at finish line
        if (car.raceDuration >= 1700) {
          if (this.track.checkCrossingFinishLine(car)) {
            if (!car.crossingFinishLine && car.leftStartLine) {
              car.laps += 1;
              car.crossingFinishLine = true;
              car.timeSinceLastLap = 0;
              Statistics.currentHighestLaps = Math.max(Statistics.currentHighestLaps, car.laps);
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
      this.finished = false;
      this.statistics.addedToHistory = false;
      this.track.deathPositions = [];
      Statistics.currentHighestLaps = 0;
      this.size = Statistics.size;
      this.evolve();
    }
    Statistics.carsAlive = this.cars.filter((car) => car.alive).length;
    Statistics.species = this.species.length;
  }

  /**
   * updates the values of the car lines
   *
   * @param elapsed
   */
  public handleCarLines(elapsed: number) {
    this.addLocationTimer -= elapsed;
    if (this.addLocationTimer <= 0) {
      this.addLocationTimer = 50;
      this.cars.forEach((car) => {
        car.locationHistory.push([car.posX, car.posY]);
      });
    }
  }

  /**
   * renders the lines that the car follow, so the player can see the path the car has taken more easily
   *
   * @param canvas is the canvas the element are rendered to
   */
  public renderCarLines(canvas: HTMLCanvasElement) {
    this.cars.forEach((car) => {
      if (car.locationHistory.length >= 2) {
        if (car.locationHistory.length >= 40) {
          car.locationHistory.splice(0, 1);
        }
        for (let i = 1; i < car.locationHistory.length - 1; i++) {
          const opacity = (i / 41) * 0.45;
          CanvasUtil.drawLine(canvas, car.locationHistory[i][0], car.locationHistory[i][1], car.locationHistory[i - 1][0], car.locationHistory[i - 1][1], 255, 255, 255, opacity, 1);
        }
      }
    });
  }

  /**
   * Render the population + information to the canvas
   *
   * @param canvas is the selected canvas the items are drawn on
   */
  public render(canvas: HTMLCanvasElement) {
    if (DrawTrack.racing) {
      if (this.raceCountdown <= 0) {
        this.usercar.render(canvas);
      }
    }
    if (this.statistics.renderRacingLines) {
      this.renderCarLines(canvas);
    }
    this.cars.forEach((car) => {
      if (car.alive) {
        car.renderRays(canvas, this.track);
        CanvasUtil.createNetCar(canvas, car);
      }
    });
    if (!UI.openSettings) {
      CanvasUtil.writeText(canvas, `lap ${Statistics.currentHighestLaps} / 5`, canvas.width / 2.4, canvas.height / 8, 'center', 'system-ui', 30, 'black');
    }
    CanvasUtil.writeText(canvas, `Generation: ${this.generation}`, canvas.width - canvas.width / 12, canvas.height / 10, 'center', 'system-ui', 30, 'white');
    CanvasUtil.writeText(canvas, `Cars alive: ${this.cars.filter((car) => car.alive).length} / ${this.size}`, canvas.width - canvas.width / 12, canvas.height / 8, 'center', 'system-ui', 20, 'white');
    CanvasUtil.writeText(canvas, `Species: ${this.species.length}`, canvas.width - canvas.width / 12, canvas.height / 6, 'center', 'system-ui', 20, 'white');

    this.statistics.renderButtons(canvas);

    if (Statistics.record !== Infinity) {
      if (Math.floor(Statistics.record % 1000) < 100) {
        CanvasUtil.writeText(canvas, `Record: ${Math.floor(Statistics.record / 1000)}.0${Math.floor(Statistics.record % 1000)} s`, canvas.width - canvas.width / 7.5, canvas.height / 4, 'left', 'system-ui', 20, 'white');
      } else {
        CanvasUtil.writeText(canvas, `Record: ${Math.floor(Statistics.record / 1000)}.${Math.floor(Statistics.record % 1000)} s`, canvas.width - canvas.width / 7.5, canvas.height / 4, 'left', 'system-ui', 20, 'white');
      }
      CanvasUtil.writeText(canvas, `Gen: ${Statistics.bestGen}`, canvas.width - canvas.width / 17, canvas.height / 4, 'left', 'system-ui', 20, 'grey');
    } else {
      CanvasUtil.writeText(canvas, 'Record: N/A', canvas.width - canvas.width / 7.5, canvas.height / 4, 'left', 'system-ui', 20, 'white');
      CanvasUtil.writeText(canvas, 'Gen: N/A', canvas.width - canvas.width / 15, canvas.height / 4, 'left', 'system-ui', 20, 'grey');
    }

    // renders record history + visual of the car
    if (this.statistics.recordHistory.length > 0) {
      CanvasUtil.writeText(canvas, 'Generations that beat record', canvas.width - canvas.width / 8, canvas.height / 3.1, 'left', 'system-ui', 15, 'grey');
      CanvasUtil.drawLine(canvas, canvas.width - canvas.width / 6.5, canvas.height / 3, canvas.width - canvas.width / 6.5 + canvas.width / 7, canvas.height / 3, 255, 255, 255, 0.2, 2);

      const start = canvas.height / 2.6;
      const rowHeight = canvas.height / 35;

      for (let i = 0; i < this.statistics.recordHistory.length; i++) {
        if (Math.floor(this.statistics.recordHistory[i][0] % 1000) < 100) {
          CanvasUtil.writeText(canvas, `${Math.floor(this.statistics.recordHistory[i][0] / 1000)}.0${Math.floor(this.statistics.recordHistory[i][0] % 1000)} s`, canvas.width - canvas.width / 11, start + i * rowHeight, 'left', 'system-ui', 20, 'grey');
        } else {
          CanvasUtil.writeText(canvas, `${Math.floor(this.statistics.recordHistory[i][0] / 1000)}.${Math.floor(this.statistics.recordHistory[i][0] % 1000)} s`, canvas.width - canvas.width / 11, start + i * rowHeight, 'left', 'system-ui', 20, 'grey');
        }
        CanvasUtil.writeText(canvas, `Gen: ${this.statistics.recordHistory[i][1]}: `, canvas.width - canvas.width / 7.5, start + i * rowHeight, 'left', 'system-ui', 20, 'white');
        CanvasUtil.createNetCar(canvas, this.statistics.recordHistory[i][2], canvas.width - canvas.width / 28, start + i * rowHeight - canvas.height / 100, 0.8, 90);
      }
    }

    if (this.trackTime % 1000 < 100) {
      CanvasUtil.writeText(canvas, `${Math.floor(this.trackTime / 1000)}.0${Math.floor(this.trackTime % 1000)} s`, canvas.width - canvas.width / 13, canvas.height / 5, 'center', 'system-ui', 20, 'grey');
    } else {
      CanvasUtil.writeText(canvas, `${Math.floor(this.trackTime / 1000)}.${Math.floor(this.trackTime % 1000)} s`, canvas.width - canvas.width / 13, canvas.height / 5, 'center', 'system-ui', 20, 'grey');
    }

    if (UI.openSettings) {
      UI.renderSettings(canvas, this.generation, this.track);
      this.statistics.renderNetwork(this.cars, canvas);
    } else {
      CanvasUtil.writeText(canvas, 'Customization & statistics ->', canvas.width * 0.66, canvas.height * 0.143, 'left', 'system-ui', 20, 'lightgray');
    }

    if (this.startCountdown) {
      if (this.raceCountdown <= 3000) {
        CanvasUtil.writeText(canvas, `${Math.ceil(this.raceCountdown / 1000)}`, canvas.width / 2, canvas.height / 2, 'center', 'system-ui', 150, 'red', 600);
      }
    }
  }
}
