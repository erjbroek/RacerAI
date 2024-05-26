import CanvasUtil from '../utilities/CanvasUtil.js';
import KeyListener from '../utilities/KeyListener.js';
import NeatCar from "./NeatCar.js";
export default class NeatPopulation {
    cars = [];
    generation = 1;
    size;
    highScore = 0;
    extinct = false;
    track;
    startingPoint;
    startingRotation;
    constructor(size, track, startingPoint, startingAngle) {
        this.size = 1;
        this.track = track;
        this.startingPoint = startingPoint;
        this.startingRotation = startingAngle;
        for (let i = 0; i < this.size; i++) {
            this.cars.push(new NeatCar(this.startingPoint, this.startingRotation));
        }
        this.track.road.forEach((road) => {
            road[2] = 1;
        });
    }
    update(elapsed) {
        if (KeyListener.isKeyDown('KeyW')) {
            this.cars.forEach((car) => {
                car.accelerate();
            });
        }
        else if (KeyListener.isKeyDown('KeyS')) {
            this.cars.forEach((car) => {
                car.brake();
            });
        }
        if (KeyListener.isKeyDown('KeyD')) {
            this.cars.forEach((car) => {
                car.rotateRight();
            });
        }
        else if (KeyListener.isKeyDown('KeyA')) {
            this.cars.forEach((car) => {
                car.rotateLeft();
            });
        }
        if (this.extinct) {
            this.calculateFitness();
            this.sortPlayersByFitness();
            this.generateNextGen();
            this.generation += 1;
        }
        else {
            this.cars.forEach((car) => {
                car.update(elapsed);
            });
        }
    }
    calculateFitness() {
        let highestDistanceCar = 0;
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
    }
    sortPlayersByFitness() {
        this.cars.sort((a, b) => b.fitness - a.fitness);
    }
    generateNextGen() {
        const playerPool = [];
    }
    render(canvas) {
        this.cars.forEach((car) => {
            car.render(canvas, this.track);
            CanvasUtil.drawCar(canvas, car.posX, car.posY, car.width, car.height, car.rotation, 0.3, car.alive);
        });
        CanvasUtil.writeText(canvas, `generation: ${this.generation}`, canvas.width - canvas.width / 10, canvas.height / 10, 'center', 'arial', 20, 'white');
        CanvasUtil.writeText(canvas, `highest fitness: ${Math.round(this.highScore)}`, canvas.width - canvas.width / 10, canvas.height / 8, 'center', 'arial', 20, 'white');
        CanvasUtil.writeText(canvas, `Cars alive: ${this.cars.filter((car) => car.alive).length}`, canvas.width - canvas.width / 10, canvas.height / 7, 'center', 'arial', 20, 'white');
    }
}
//# sourceMappingURL=NeatPopulation.js.map