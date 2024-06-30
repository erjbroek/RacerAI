import CanvasUtil from '../utilities/CanvasUtil.js';
import GeneticCar from './GeneticCar.js';
export default class GeneticPopulation {
    cars = [];
    generation = 1;
    size;
    highScore = 0;
    moveNumber = 0;
    amountMoves = 15;
    extinct = false;
    moveDuration = 200;
    track;
    beaten = true;
    finished = false;
    startingPoint;
    startingRotation;
    highscoreTimesBeaten = 0;
    generationTime = 0;
    maxDistance = 0;
    constructor(size, startingPoint, startingAngle, track) {
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
    update(elapsed) {
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
        }
        else {
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
    calculateFitness() {
        let worstDistanceCar = 9999;
        let highestDistanceCar = 0;
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
    sortPlayersByFitness() {
        this.cars.sort((a, b) => b.fitness - a.fitness);
    }
    generateNextGen() {
        const playerPool = [];
        if (this.cars[0].fitness >= this.highScore) {
            this.highscoreTimesBeaten += 1;
            this.highScore = this.cars[0].fitness;
        }
        else {
            this.highscoreTimesBeaten = 0;
        }
        if (this.highscoreTimesBeaten > 0) {
            this.cars.forEach((car) => {
                car.addMoves(2);
            });
        }
        this.sortPlayersByFitness();
        const topPercentage = 0.1;
        const topCount = Math.ceil(this.size * topPercentage);
        const topPerformers = this.cars.slice(0, topCount);
        const maxFitness = this.cars[0].fitness;
        this.cars.forEach((car) => {
            car.fitness /= maxFitness;
            for (let i = 0; i < Math.floor((car.fitness * 6) ** 2.5); i++) {
                playerPool.push(car);
            }
        });
        this.cars = [];
        topPerformers.forEach((car) => {
            this.cars.push(new GeneticCar(this.track.midPoint, this.startingRotation, car.moves, this.amountMoves, car.position));
        });
        while (this.cars.length < this.size) {
            const randomCar = playerPool[Math.floor(Math.random() * playerPool.length)];
            const newCar = new GeneticCar(this.track.midPoint, this.startingRotation, randomCar.moves, this.amountMoves, randomCar.position);
            if (Math.random() < 0.6) {
                newCar.moves = randomCar.mutateMoves(randomCar.moves);
            }
            this.cars.push(newCar);
        }
    }
    render(canvas) {
        this.cars.forEach((car) => {
            if (car.alive) {
                CanvasUtil.drawCar(canvas, car.posX, car.posY, car.width, car.height, car.rotation, 0, 255, 0, 0.1, false);
            }
        });
        CanvasUtil.writeText(canvas, `generation: ${this.generation}`, canvas.width - canvas.width / 10, canvas.height / 10, 'center', 'system-ui', 20, 'white');
        CanvasUtil.writeText(canvas, `highest fitness: ${Math.round(this.highScore)}`, canvas.width - canvas.width / 10, canvas.height / 8, 'center', 'system-ui', 20, 'white');
        CanvasUtil.writeText(canvas, `Cars alive: ${this.cars.filter((car) => car.alive).length}`, canvas.width - canvas.width / 10, canvas.height / 6.7, 'center', 'system-ui', 20, 'white');
        CanvasUtil.writeText(canvas, `Cars alive: ${Math.floor((this.cars.filter((car) => car.alive).length / this.cars.length) * 100)}%`, canvas.width - canvas.width / 10, canvas.height / 6, 'center', 'system-ui', 20, 'white');
    }
}
//# sourceMappingURL=GeneticPopulation.js.map