import CanvasUtil from '../utilities/CanvasUtil.js';
import GeneticCar from './GeneticCar.js';
import Track from '../Track.js';

export default class GeneticPopulation {
  public cars: GeneticCar[] = [];

  public generation: number = 1;

  public size: number;

  public highScore: number = 0;

  public moveNumber: number = 0;

  public amountMoves: number = 15;

  public extinct: boolean = false;

  public moveDuration: number = 200;

  public track: Track;

  public beaten: boolean = true;

  public finished: boolean = false;

  public startingPoint: number[];

  public startingRotation: number;

  private highscoreTimesBeaten: number = 0;

  public generationTime: number = 0;

  public maxDistance: number = 0;

  public constructor(size: number, startingPoint: number[], startingAngle: number, track: Track) {
    this.size = size;
    this.track = track;
    this.startingPoint = startingPoint;
    this.startingRotation = startingAngle;
    for (let i = 0; i < this.size; i++) {
      this.cars.push(new GeneticCar(this.startingPoint, this.startingRotation, [], this.amountMoves));
    }
    this.track.road.forEach((road) => {
      road[2] = 1;
    });
  }

  /**
   *
   * @param elapsed is the elapsed time since each last frame
   */
  public update(elapsed: number): void {
    this.generationTime += elapsed;
    if (this.extinct) {
      this.calculateFitness();
      this.sortPlayersByFitness();
      this.generateNextGen();
      this.moveNumber = 0;
      this.maxDistance = 0;
      this.generation += 1;
      this.generationTime = 0;
      this.extinct = false;
    } else {
      this.extinct = true;
      this.moveDuration -= elapsed;
      if (this.moveDuration <= 0) {
        this.moveNumber += 1;
        this.moveDuration = 200;
      }
      this.cars.forEach((car) => {
        if (car.alive) {
          this.extinct = false;
          car.alive = this.track.checkCollisionWithTrack(car);
          if (car.alive) {
            if (!car.finished) {
              if (this.generationTime >= 4000) {
                car.finished = this.track.checkCrossingFinishLine(car);
              }
            }
          }
          car.processMoves(this.moveNumber, elapsed);
          car.update(elapsed);
          car.updateDistance();
          if (car.distance > this.maxDistance) {
            this.maxDistance = car.distance;
          }
        }
      });
    }
  }

  /**
   *
   */
  public calculateFitness() {
    let worstDistanceCar: number = 9999;
    let highestDistanceCar: number = 0;
    // make a variable here that returns lowest distance of all players
    this.cars.forEach((car) => {
      if (car.distance <= worstDistanceCar) {
        worstDistanceCar = car.distance;
      }
      if (car.distance >= highestDistanceCar) {
        highestDistanceCar = car.distance;
      }
    });

    this.cars.forEach((car) => {
      car.fitness = (0.2 * car.distance);
      if (car.collided) {
        car.fitness /= 3;
      }
      if (car.finished) {
        car.fitness *= 3;
        this.beaten = true;
      }
    });
  }

  /**
   * sorts players based on fitness
   */
  private sortPlayersByFitness(): void {
    this.cars.sort((a, b) => b.fitness - a.fitness);
  }

  /**
   * generates the next gen of players
   */
  private generateNextGen(): void {
    const playerPool: GeneticCar[] = [];

    // Update high score and count of times high score is beaten
    if (this.cars[0].fitness >= this.highScore) {
      this.highscoreTimesBeaten += 1;
      this.highScore = this.cars[0].fitness;
    } else {
      this.highscoreTimesBeaten = 0;
    }

    // Add a move if the high score has been beaten multiple times
    if (this.highscoreTimesBeaten > 0) {
      this.cars.forEach((car) => {
        car.addMoves(2);
      });
    }

    // Sort cars by fitness
    this.sortPlayersByFitness();

    // Determine the top performers (top 10%)
    const topPercentage = 0.1;
    const topCount = Math.ceil(this.size * topPercentage);
    const topPerformers = this.cars.slice(0, topCount);

    // Normalize fitness and populate the player pool
    const maxFitness = this.cars[0].fitness;
    this.cars.forEach((car) => {
      car.fitness /= maxFitness;
      for (let i = 0; i < Math.floor((car.fitness * 6) ** 2.5); i++) {
        playerPool.push(car);
      }
    });

    // Clear the current cars array for the new generation
    this.cars = [];

    // Add the top performers to the new generation without mutation
    topPerformers.forEach((car) => {
      this.cars.push(new GeneticCar(this.track.midPoint, this.startingRotation, car.moves, this.amountMoves, car.position));
    });

    // Generate the rest of the new generation, potentially mutating their moves
    while (this.cars.length < this.size) {
      const randomCar = playerPool[Math.floor(Math.random() * playerPool.length)];
      const newCar = new GeneticCar(this.track.midPoint, this.startingRotation, randomCar.moves, this.amountMoves, randomCar.position);

      if (Math.random() < 0.6) { // Probability to mutate
        newCar.moves = randomCar.mutateMoves(randomCar.moves);
      }

      this.cars.push(newCar);
    }
  }

  /**
   *
   * @param canvas is the selected canvas the items are drawn on
   */
  public render(canvas: HTMLCanvasElement) {
    this.cars.forEach((car) => {
      CanvasUtil.drawCar(canvas, car.posX, car.posY, car.width, car.height, car.rotation, 0.3, car.alive);
    });
    CanvasUtil.writeText(canvas, `generation: ${this.generation}`, canvas.width - canvas.width / 10, canvas.height / 10, 'center', 'arial', 20, 'white');
    CanvasUtil.writeText(canvas, `highest fitness: ${Math.round(this.highScore)}`, canvas.width - canvas.width / 10, canvas.height / 8, 'center', 'arial', 20, 'white');
    CanvasUtil.writeText(canvas, `Cars alive: ${this.cars.filter((car) => car.alive).length}`, canvas.width - canvas.width / 10, canvas.height / 6.7, 'center', 'arial', 20, 'white');
    CanvasUtil.writeText(canvas, `Cars alive: ${Math.floor((this.cars.filter((car) => car.alive).length / this.cars.length) * 100)}%`, canvas.width - canvas.width / 10, canvas.height / 6, 'center', 'arial', 20, 'white');
  }
}
