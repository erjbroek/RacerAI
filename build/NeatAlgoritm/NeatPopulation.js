import CanvasUtil from '../utilities/CanvasUtil.js';
import NeftCar from './NeftCar.js';
export default class NeftPopulation {
    cars = [];
    generation = 1;
    size;
    highScore = 0;
    extinct = false;
    track;
    startingPoint;
    startingAngle;
    species;
    constructor(size, track, startingPoint, startingAngle) {
        this.size = size;
        this.track = track;
        this.startingPoint = startingPoint;
        this.startingAngle = startingAngle;
        this.extinct = false;
        this.species = [];
        this.cars.push();
        for (let i = 0; i < this.size - 1; i++) {
            const genome = this.createInitialGenome();
            this.cars.push(new NeftCar(startingPoint, startingAngle, genome));
        }
        this.track.road.forEach((road) => {
            road[2] = 1;
        });
    }
    createInitialGenome() {
        const genome = [];
        for (let input = 0; input < this.cars[0].numRays; input++) {
            for (let output = 0; output < 4; output++) {
                genome.push([input, output, Math.random()]);
            }
        }
        return genome;
    }
    evolve() {
        this.speciate();
        this.calculateFitness();
        this.selection();
        this.reproduce();
        this.mutate();
        this.generation += 1;
    }
    speciate() {
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
        this.highScore = Math.max(this.highScore, ...this.cars.map((car) => car.fitness));
    }
    selection() {
    }
    reproduce() {
    }
    mutate() {
    }
    update(elapsed) {
        let allCarsDead = true;
        this.cars.forEach((car) => {
            if (car.alive) {
                car.update(elapsed);
                allCarsDead = false;
            }
        });
        if (allCarsDead) {
            this.extinct = true;
            this.evolve();
        }
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