import CanvasUtil from "../utilities/CanvasUtil.js";
import GeneticCar from "./GeneticCar.js";
import Track from "../Track.js";

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

  public finished: boolean = false;

  private startingPoint: number[];

  private startingRotation: number;

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
    this.generationTime = this.amountMoves * 200;
    console.log(this.amountMoves)
  }

  /**
   *
   * @param elapsed is the elapsed time since each last frame
   */
  public update(elapsed: number): void {
    if (this.extinct) {
      this.calculateFitness();
      this.sortPlayersByFitness();
      this.generateNextGen();
      this.moveNumber = 0;
      this.maxDistance = 0;
      this.extinct = false;
      console.log(`amount ${this.cars[0].moves.length}`);
      this.generationTime = this.cars[0].moves.length * 200;
    } else {
      this.extinct = true;
      // console.log(`Number of cars alive: ${this.cars.filter((car) => car.alive).length}`);
      this.moveDuration -= elapsed;
      if (this.moveDuration <= 0) {
        this.moveNumber += 1;
        this.moveDuration = 200;
      }
      this.cars.forEach((car) => {
        if (car.alive) {
          this.extinct = false;
          car.alive = this.track.checkCollisionWithTrack(car);
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
    //make a variable here that returns lowest distance of all players
    this.cars.forEach((car) => {
      if (car.distance <= worstDistanceCar) {
        worstDistanceCar = car.distance;
      }
      if (car.distance >= highestDistanceCar) {
        highestDistanceCar = car.distance;
      }
    });
    console.log(`worst: ${worstDistanceCar}`)
    console.log(`best: ${highestDistanceCar}`)

    this.cars.forEach((car) => {
      car.fitness = (0.2 * car.distance);
      // + (40 * (1 / (car.time / 1000)));
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
    // the new player pool for the next generation
    const playerPool: GeneticCar[] = [];

    // will award the players more points if highscore is beaten.
    // this way, the cars can focus more on performance while highscore is not being beaten.
    if (this.cars[0].fitness >= this.highScore + 5) {
      // this.highscoreTimesBeaten += 1;
      // if (this.highscoreTimesBeaten >= 4) {
        this.highScore = this.cars[0].fitness;
        this.cars.forEach((car) => {
          car.addMoves(4);
        });
      // }
    };

    // creates new player pool, where the chance of being picked is equal to fitness / 10
    // this way, players with higher fitness have a higher chance to survive.
    this.cars.forEach((car) => {
      car.position = this.cars.indexOf(car);
      for (let i = 0; i + 1 < (car.fitness / 20) ** 2.5; i++) {
        playerPool.push(car);
      }
    });
    this.cars = [];

    // adds a random car from the playerPool array, and adds it to the new generation
    // with each player added, the player has a chance to mutate
    for (let i = 0; i < this.size; i++) {
      const randomCar = playerPool[Math.floor(Math.random() * playerPool.length)];
      let newMoves = [...randomCar.moves];
      if (Math.random() < 0.25) { // Probability to mutate
        newMoves = randomCar.mutateMoves(newMoves);
      }
      this.cars.push(new GeneticCar(this.track.midPoint, this.startingRotation, newMoves, this.amountMoves, randomCar.position))
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
    CanvasUtil.writeText(canvas, `totalTime: ${this.generationTime}`, canvas.width / 10, canvas.height / 10, 'center', 'arial', 20, 'black')
  }
}
