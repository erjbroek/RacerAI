import CanvasUtil from '../utilities/CanvasUtil.js';
import NetCar from './NetCar.js';
export default class NetPopulation {
    cars = [];
    generation = 1;
    size;
    highScore = 0;
    extinct = false;
    track;
    startingPoint;
    startingAngle;
    species = [];
    maxDistance = 0;
    generationTime = 0;
    triggered = false;
    constructor(size, track, startingPoint, startingAngle) {
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
    createInitialGenome() {
        const genome = [];
        for (let input = 0; input < 5; input++) {
            for (let output = 0; output < 4; output++) {
                genome.push([input, output, Math.random()]);
            }
        }
        return genome;
    }
    evolve() {
        if (!this.triggered) {
            this.triggered = true;
            this.speciate();
            this.calculateFitness();
            this.sortPlayers();
            this.crossover();
            this.generation += 1;
        }
    }
    speciate() {
        this.species = [];
        const threshold = 1.4;
        for (const car of this.cars) {
            let placed = false;
            for (const species of this.species) {
                if (this.genomeDistance(car.genome, species[0].genome) < threshold) {
                    species.push(car);
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                this.species.push([car]);
            }
        }
        console.log(this.species);
    }
    genomeDistance(genome1, genome2) {
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
    calculateFitness() {
        let highestDistanceCar = 0;
        let bestLapTime = Number.MAX_VALUE;
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
        this.cars.forEach((car) => {
            car.fitness = car.laps > 0 ? 1 + car.laps / 2 : 0.1;
            if (car.laps >= 5) {
                car.fitness *= 2;
            }
            if (car.laps > 0) {
                const relativeLapTime = car.totalLapTime / car.laps / bestLapTime;
                car.fitness *= 1 / relativeLapTime;
            }
            else {
                car.fitness += (car.distance / highestDistanceCar);
            }
        });
        this.highScore = Math.max(this.highScore, ...this.cars.map((car) => car.fitness));
    }
    sortPlayers() {
        this.species.forEach((species) => {
            species.sort((car1, car2) => car2.fitness - car1.fitness);
        });
    }
    crossover() {
        const survived = [];
        const selectedCars = [];
        const selectionPercentage = 0.5;
        this.species.forEach((species) => {
            const numToSelect = Math.ceil(species.length * selectionPercentage);
            const topCars = species.slice(0, numToSelect);
            survived.push(...topCars);
        });
        survived.forEach((car) => {
            for (let i = 0; i <= Math.ceil(car.fitness); i++) {
                selectedCars.push(car);
            }
        });
        const nextGen = [];
        for (let i = 0; i < this.size; i++) {
            const parent1 = selectedCars[Math.floor(Math.random() * selectedCars.length)];
            const parent2 = selectedCars[Math.floor(Math.random() * selectedCars.length)];
            const babyGenes = [];
            for (let i = 0; i < 20; i++) {
                const weight1 = parent1.genome[i][2];
                const weight2 = parent2.genome[i][2];
                const newGene = Math.random() > 0.5 ? weight1 : weight2;
                babyGenes.push([Math.floor(i / 4), i % 4, newGene]);
            }
            nextGen.push(new NetCar(this.startingPoint, this.startingAngle, babyGenes));
        }
    }
    update(elapsed) {
        this.generationTime += elapsed;
        this.cars.forEach((car) => {
            car.alive = this.track.checkCollisionWithTrack(car);
            if (car.laps >= 5) {
                car.alive = false;
            }
            if (car.alive) {
                car.totalLapTime += elapsed;
                if (this.track.checkCrossingFinishLine(car)) {
                    if (!car.crossingFinishLine) {
                        car.laps += 1;
                        car.crossingFinishLine = true;
                        console.log(car.laps);
                    }
                }
                else {
                    car.crossingFinishLine = false;
                }
                car.update(elapsed);
                car.updateDistance();
                if (car.distance > this.maxDistance) {
                    this.maxDistance = car.distance;
                }
            }
        });
        this.extinct = !this.cars.some((car) => car.alive);
        if (this.extinct) {
            this.extinct = true;
            this.generationTime = 0;
            this.evolve();
        }
    }
    visualizeNetwork(car, canvas) {
        CanvasUtil.fillRectangle(canvas, canvas.width / 30, canvas.height / 20, canvas.width / 4, canvas.height / 3.5, 0, 0, 0, 0.3, 5);
        CanvasUtil.writeText(canvas, 'neural network of best car', canvas.width / 30 + canvas.width / 8, canvas.height / 20 + canvas.height / 3.8, 'center', 'arial', 20, 'black');
        const radius = canvas.height / 60;
        car.genome.forEach((network) => {
            const [input, output, weight] = network;
            const startX = canvas.width / 14;
            const startY = canvas.height / 14 + input * radius * 3;
            const endX = canvas.width / 4;
            const endY = canvas.height / 14 + radius + output * radius * 3;
            const lineWidth = weight * 10;
            const rayLength = car.rayLengths[input];
            const ratio = rayLength / 100;
            const red = Math.floor(255 * (1 - ratio));
            const green = Math.floor(255 * ratio);
            CanvasUtil.drawLine(canvas, startX, startY, endX, endY, red, green, 0, 0.8, lineWidth);
        });
        for (let input = 0; input < 5; input++) {
            CanvasUtil.fillCircle(canvas, canvas.width / 14, canvas.height / 14 + input * radius * 3, radius, 255, 255, 255, 0.8);
            CanvasUtil.writeText(canvas, `${input}`, canvas.width / 14, canvas.height / 12.5 + input * radius * 3, 'center', 'arial', 20, 'black');
        }
        for (let output = 0; output < 4; output++) {
            CanvasUtil.fillCircle(canvas, canvas.width / 4, canvas.height / 14 + radius + output * radius * 3, radius, 255, 255, 255, 0.8);
            CanvasUtil.writeText(canvas, `${output}`, canvas.width / 4, canvas.height / 12.5 + radius + output * radius * 3, 'center', 'arial', 20, 'black');
        }
    }
    render(canvas) {
        this.cars.forEach((car) => {
            car.render(canvas, this.track);
            CanvasUtil.drawCar(canvas, car.posX, car.posY, car.width, car.height, car.rotation, 0.6, car.alive);
        });
        CanvasUtil.writeText(canvas, `generation: ${this.generation}`, canvas.width - canvas.width / 10, canvas.height / 10, 'center', 'arial', 20, 'white');
        CanvasUtil.writeText(canvas, `highest fitness: ${Math.round(this.highScore)}`, canvas.width - canvas.width / 10, canvas.height / 8, 'center', 'arial', 20, 'white');
        CanvasUtil.writeText(canvas, `Cars alive: ${this.cars.filter((car) => car.alive).length}`, canvas.width - canvas.width / 10, canvas.height / 7, 'center', 'arial', 20, 'white');
        this.visualizeNetwork(this.cars[0], canvas);
    }
}
//# sourceMappingURL=NetPopulation.js.map