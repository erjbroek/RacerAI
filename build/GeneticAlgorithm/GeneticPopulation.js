import CanvasUtil from "../utilities/CanvasUtil.js";
import GeneticCar from "./GeneticCar.js";
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
        this.generationTime = this.amountMoves * 200;
        console.log(this.amountMoves);
    }
    update(elapsed) {
        if (this.extinct) {
            this.calculateFitness();
            this.sortPlayersByFitness();
            this.generateNextGen();
            this.moveNumber = 0;
            this.maxDistance = 0;
            this.extinct = false;
            console.log(`amount ${this.cars[0].moves.length}`);
            this.generationTime = this.cars[0].moves.length * 200;
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
        console.log(`worst: ${worstDistanceCar}`);
        console.log(`best: ${highestDistanceCar}`);
        this.cars.forEach((car) => {
            car.fitness = (0.2 * car.distance);
        });
    }
    sortPlayersByFitness() {
        this.cars.sort((a, b) => b.fitness - a.fitness);
    }
    generateNextGen() {
        const playerPool = [];
        if (this.cars[0].fitness >= this.highScore + 5) {
            this.highScore = this.cars[0].fitness;
            this.cars.forEach((car) => {
                car.addMoves(4);
            });
        }
        ;
        this.cars.forEach((car) => {
            car.position = this.cars.indexOf(car);
            for (let i = 0; i + 1 < (car.fitness / 20) ** 2.5; i++) {
                playerPool.push(car);
            }
        });
        this.cars = [];
        for (let i = 0; i < this.size; i++) {
            const randomCar = playerPool[Math.floor(Math.random() * playerPool.length)];
            let newMoves = [...randomCar.moves];
            if (Math.random() < 0.25) {
                newMoves = randomCar.mutateMoves(newMoves);
            }
            this.cars.push(new GeneticCar(this.track.midPoint, this.startingRotation, newMoves, this.amountMoves, randomCar.position));
        }
    }
    render(canvas) {
        this.cars.forEach((car) => {
            CanvasUtil.drawCar(canvas, car.posX, car.posY, car.width, car.height, car.rotation, 0.3, car.alive);
        });
        CanvasUtil.writeText(canvas, `totalTime: ${this.generationTime}`, canvas.width / 10, canvas.height / 10, 'center', 'arial', 20, 'black');
    }
}
//# sourceMappingURL=GeneticPopulation.js.map