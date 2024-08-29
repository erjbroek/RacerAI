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

  public beaten: boolean = false;

  public finished: boolean = false;

  public startingPoint: number[];

  public startingRotation: number;

  private highscoreTimesBeaten: number = 0;

  public generationTime: number = 0;

  public maxDistance: number = 0;

  public performanceHistory: Array<[number, number]> = [[0, 0]];

  public highest: number = -Infinity;

  public lowest: number = Infinity;

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
    this.performanceHistory.push([this.cars[0].fitness, this.generation]);

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
   * @param canvas is the canvas to render on
   */
  public renderGraph(canvas: HTMLCanvasElement) {
    const top: number = canvas.height * 0.6;
    const height: number = canvas.height * 0.295;
    const width: number = canvas.width * 0.110;
    const bottom: number = top + height;
    const left: number = canvas.width * 0.866;

    CanvasUtil.writeText(canvas, 'Fitness each generation', left + width / 2.4, canvas.height * 0.535, 'center', 'system-ui', 20, 'white');
    if (this.performanceHistory.length === 0) {
      CanvasUtil.writeText(canvas, '(No data yet)', left + width / 2.4, canvas.height * 0.56, 'center', 'system-ui', 15, 'lightgray');
      [this.highest, this.lowest] = [500, 0];
    } else if (this.performanceHistory.length === 1) {
      [this.highest, this.lowest] = [this.performanceHistory[0][0] * 1.4, this.performanceHistory[0][0] / 1.4];
    } else {
      this.highest = -Infinity;
      this.lowest = Infinity;

      this.performanceHistory.forEach((entry) => {
        const fitness = entry[0];
        this.highest = Math.max(fitness, this.highest);
        this.lowest = Math.min(fitness, this.lowest);
      });
    }

    CanvasUtil.fillRectangle(canvas, left, top, width, height, 0, 0, 0, 1, 5);
    CanvasUtil.drawLine(canvas, left + width * 0.05, top + height * 0.1, left + width * 0.05, bottom - height * 0.08, 255, 255, 255, 0.5, 1);
    CanvasUtil.drawLine(canvas, left + width * 0.05, bottom - height * 0.08, left + width * 0.95, bottom - height * 0.08, 255, 255, 255, 0.5, 1);

    const numGridLines = 5;
    for (let i = 0; i < numGridLines; i++) {
      const value = this.lowest + (i * (this.highest - this.lowest)) / (numGridLines - 1);
      const y = bottom - height * 0.1 - height * 0.8 * ((value - this.lowest) / (this.highest - this.lowest));
      CanvasUtil.drawLine(canvas, left + width * 0.05, y, left + width * 0.95, y, 255, 255, 255, 0.2, 1);
      const labelText = `${Math.floor(value)}`;
      CanvasUtil.writeText(canvas, labelText, left - 10, y, 'right', 'system-ui', 10, 'white');
    }

    for (let i = 0; i < this.performanceHistory.length; i++) {
      const score = this.performanceHistory[i][0];
      const yNormalized = (score - this.lowest) / (this.highest - this.lowest);
      const x = left + width * 0.1 + ((width * 0.8) / this.performanceHistory.length) * i;
      const y = bottom - height * 0.1 - height * 0.8 * yNormalized;
      if (i > 0) {
        const lastTime = this.performanceHistory[i - 1][0];
        const lastYNormalized = (lastTime - this.lowest) / (this.highest - this.lowest);
        const lastX = left + width * 0.1 + ((width * 0.8) / this.performanceHistory.length) * (i - 1);
        const lastY = bottom - height * 0.1 - height * 0.8 * lastYNormalized;
        CanvasUtil.drawLine(canvas, lastX + 10, lastY, x + 10, y, 255, 255, 255, 0.5, 1);
      }
      CanvasUtil.fillCircle(canvas, x + 10, y, 3, 255, 255, 255, 1);
      CanvasUtil.drawLine(canvas, x + 10, bottom - height * 0.06, x + 10, bottom - height * 0.08 - 5, 255, 255, 255, 1, 1);
      if (this.performanceHistory.length <= 7 || score === this.highest || score === this.lowest) {
        CanvasUtil.writeText(canvas, `${Math.round(score)}`, x + 10, y - 10, 'center', 'system-ui', 10, 'white');
      }
    }
  }

  /**
   *
   * @param canvas is the selected canvas the items are drawn on
   */
  public render(canvas: HTMLCanvasElement) {
    this.cars.forEach((car) => {
      if (car.alive) {
        CanvasUtil.drawCar(canvas, car.posX, car.posY, car.width, car.height, car.rotation, 0, 255, 0, 0.5, false);
      }
    });
    CanvasUtil.writeText(canvas, `Generation: ${this.generation}`, canvas.width - canvas.width / 12, canvas.height / 10, 'center', 'system-ui', 30, 'white');
    CanvasUtil.writeText(canvas, `Cars alive: ${this.cars.filter((car) => car.alive).length} / ${Math.floor(this.size)}`, canvas.width - canvas.width / 12, canvas.height / 8, 'center', 'system-ui', 18, 'grey');
    CanvasUtil.writeText(canvas, `Fitness record: ${Math.round(this.highScore * 10) / 10}`, canvas.width - canvas.width / 12, canvas.height / 6, 'center', 'system-ui', 20, 'white');
    this.renderGraph(canvas);
  }
}
