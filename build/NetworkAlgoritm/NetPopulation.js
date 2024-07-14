import CanvasUtil from "../utilities/CanvasUtil.js";
import NetCar from "./NetCar.js";
import Statistics from "./Statistics.js";
export default class NetPopulation {
    cars = [];
    nextGen = [];
    champions = [];
    generation = 1;
    size;
    highScore = 0;
    extinct = false;
    finished = false;
    track;
    startingPoint;
    startingAngle;
    species = [];
    trackTime = 0;
    addLocationTimer = 50;
    statistics = new Statistics();
    constructor(size, track, startingPoint, startingAngle) {
        this.size = size;
        this.track = track;
        this.startingPoint = startingPoint;
        this.startingAngle = startingAngle;
        this.extinct = false;
        this.species = [];
        for (let i = 0; i < this.size; i++) {
            const [genome, biases] = [this.createInitialGenome()[0], this.createInitialGenome()[1]];
            this.cars.push(new NetCar(startingPoint, startingAngle, genome, biases));
        }
        this.track.road.forEach((road) => {
            road[2] = 1;
        });
    }
    createInitialGenome() {
        const genome = [];
        const biases = [];
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
    evolve() {
        this.speciate();
        this.calculateFitness();
        this.sortPlayers();
        this.crossover();
        this.mutate();
        this.generation += 1;
    }
    speciate() {
        this.species = [];
        const threshold = 0.7;
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
                car.fitness += car.distance / highestDistanceCar;
            }
            if (!car.leftStartLine) {
                car.fitness *= 0.1;
            }
        });
        this.highScore = Math.max(this.highScore, ...this.cars.map((car) => car.fitness));
    }
    sortPlayers() {
        this.species.forEach((species) => {
            species.sort((car1, car2) => car2.fitness - car1.fitness);
        });
        this.cars.sort((car1, car2) => car2.fitness - car1.fitness);
    }
    crossover() {
        const survived = [];
        const selectedCars = [];
        const selectionPercentage = 0.5;
        this.champions = [];
        this.champions.push(new NetCar(this.startingPoint, this.startingAngle, this.cars[0].genome, this.cars[0].biases));
        this.champions.push(new NetCar(this.startingPoint, this.startingAngle, this.cars[1].genome, this.cars[1].biases));
        this.species.forEach((species) => {
            const numToSelect = Math.ceil(species.length * selectionPercentage);
            const topCars = species.slice(0, numToSelect);
            survived.push(...topCars);
        });
        survived.forEach((car) => {
            for (let i = 0; i <= Math.ceil(car.fitness * 100); i++) {
                selectedCars.push(car);
            }
        });
        this.nextGen = [];
        for (let i = 0; i < this.size - 2; i++) {
            const parent1 = selectedCars[Math.floor(Math.random() * selectedCars.length)];
            const parent2 = selectedCars[Math.floor(Math.random() * selectedCars.length)];
            const babyGenes = [];
            for (let j = 0; j < 20; j++) {
                const weight1 = parent1.genome[j][2];
                const weight2 = parent2.genome[j][2];
                const newGene = Math.random() > 0.5 ? weight1 : weight2;
                babyGenes.push([Math.floor(j / 4), j % 4, newGene]);
            }
            const babyBiases = [];
            for (let k = 0; k < parent1.biases.length; k++) {
                const bias1 = parent1.biases[k];
                const bias2 = parent2.biases[k];
                const newBias = Math.random() > 0.5 ? bias1 : bias2;
                babyBiases.push(newBias);
            }
            this.nextGen.push(new NetCar(this.startingPoint, this.startingAngle, babyGenes, babyBiases));
        }
    }
    mutate() {
        const slightMutationRate = 0.1;
        const bigMutationRate = 0.025;
        this.nextGen.forEach((car) => {
            car.genome.forEach((gene) => {
                if (Math.random() < slightMutationRate) {
                    gene[2] += Math.random() * 0.2 - 0.1;
                }
                else if (Math.random() < bigMutationRate) {
                    gene[2] = Math.random();
                }
                if (gene[2] > 1) {
                    gene[2] = 1;
                }
                if (gene[2] < 0) {
                    gene[2] = 0;
                }
            });
            car.biases.forEach((bias, index) => {
                if (Math.random() < slightMutationRate) {
                    car.biases[index] += Math.random() * 0.35 - 0.175;
                }
                else if (Math.random() < bigMutationRate) {
                    car.biases[index] = Math.random() * 2 - 1;
                }
                car.biases[index] = Math.max(-1, Math.min(car.biases[index], 1));
            });
        });
        this.nextGen.push(...this.champions);
        this.cars = this.nextGen;
    }
    update(elapsed) {
        if (!this.finished) {
            this.trackTime += elapsed;
        }
        this.cars.forEach((car) => {
            car.alive = this.track.checkCollisionWithTrack(car);
            if (car.timeSinceLastLap >= 15000) {
                car.alive = false;
            }
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
                if (car.totalLapTime >= 1700) {
                    if (this.track.checkCrossingFinishLine(car)) {
                        if (!car.crossingFinishLine) {
                            car.laps += 1;
                            car.crossingFinishLine = true;
                            car.timeSinceLastLap = 0;
                            this.statistics.currentHighestLaps = Math.max(this.statistics.currentHighestLaps, car.laps);
                        }
                    }
                    else {
                        car.crossingFinishLine = false;
                    }
                }
                car.update(elapsed);
                car.updateDistance();
            }
            else {
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
    handleCarLines(elapsed) {
        this.addLocationTimer -= elapsed;
        if (this.addLocationTimer <= 0) {
            this.addLocationTimer = 50;
            this.cars.forEach((car) => {
                car.locationHistory.push([car.posX, car.posY]);
            });
        }
    }
    renderCarLines(canvas) {
        this.cars.forEach((car) => {
            if (car.locationHistory.length >= 2) {
                if (car.locationHistory.length >= 40) {
                    car.locationHistory.splice(0, 1);
                }
                for (let i = 1; i < car.locationHistory.length - 1; i++) {
                    const opacity = (i / 41) * 0.45;
                    CanvasUtil.drawLine(canvas, car.posX, car.posY, car.locationHistory[car.locationHistory.length - 1][0], car.locationHistory[car.locationHistory.length - 1][1], 255, 255, 255, 0.45, 1);
                    CanvasUtil.drawLine(canvas, car.locationHistory[i][0], car.locationHistory[i][1], car.locationHistory[i - 1][0], car.locationHistory[i - 1][1], 255, 255, 255, opacity, 1);
                }
            }
        });
    }
    render(canvas) {
        this.renderCarLines(canvas);
        this.cars.forEach((car) => {
            if (car.alive) {
                car.renderRays(canvas, this.track);
                CanvasUtil.drawCar(canvas, car.posX, car.posY, car.width, car.height, car.rotation, car.red, car.green, car.blue, 0.8);
            }
        });
        CanvasUtil.writeText(canvas, `lap ${this.statistics.currentHighestLaps} / 5`, canvas.width / 2.4, canvas.height / 8, "center", "system-ui", 30, "black");
        CanvasUtil.writeText(canvas, `Generation: ${this.generation}`, canvas.width - canvas.width / 12, canvas.height / 10, "center", "system-ui", 30, "white");
        CanvasUtil.writeText(canvas, `Cars alive: ${this.cars.filter((car) => car.alive).length} / ${this.size}`, canvas.width - canvas.width / 12, canvas.height / 8, "center", "system-ui", 20, "white");
        CanvasUtil.writeText(canvas, `Species: ${this.species.length}`, canvas.width - canvas.width / 12, canvas.height / 6, "center", "system-ui", 20, "white");
        this.statistics.renderButtons(canvas);
        this.statistics.renderNetwork(this.cars[0], canvas);
        if (this.statistics.record !== Infinity) {
            if (Math.floor(this.statistics.record % 1000) < 100) {
                CanvasUtil.writeText(canvas, `Record: ${Math.floor(this.statistics.record / 1000)}.0${Math.floor(this.statistics.record % 1000)} s`, canvas.width - canvas.width / 7.5, canvas.height / 4, "left", "system-ui", 20, "white");
            }
            else {
                CanvasUtil.writeText(canvas, `Record: ${Math.floor(this.statistics.record / 1000)}.${Math.floor(this.statistics.record % 1000)} s`, canvas.width - canvas.width / 7.5, canvas.height / 4, "left", "system-ui", 20, "white");
            }
            CanvasUtil.writeText(canvas, `Gen: ${this.statistics.bestGen}`, canvas.width - canvas.width / 17, canvas.height / 4, "left", "system-ui", 20, "grey");
        }
        else {
            CanvasUtil.writeText(canvas, `Record: N/A`, canvas.width - canvas.width / 7.5, canvas.height / 4, "left", "system-ui", 20, "white");
            CanvasUtil.writeText(canvas, `Gen: N/A`, canvas.width - canvas.width / 15, canvas.height / 4, "left", "system-ui", 20, "grey");
        }
        if (this.statistics.recordHistory.length > 0) {
            CanvasUtil.writeText(canvas, `Generations that beat record`, canvas.width - canvas.width / 8, canvas.height / 3.1, "left", "system-ui", 15, "grey");
            CanvasUtil.drawLine(canvas, canvas.width - canvas.width / 6.5, canvas.height / 3, canvas.width - canvas.width / 6.5 + canvas.width / 7, canvas.height / 3, 255, 255, 255, 0.2, 2);
            const start = canvas.height / 2.6;
            for (let i = 0; i < this.statistics.recordHistory.length; i++) {
                if (Math.floor(this.statistics.recordHistory[i][0] % 1000) < 100) {
                    CanvasUtil.writeText(canvas, `Record: ${Math.floor(this.statistics.recordHistory[i][0] / 1000)}.0${Math.floor(this.statistics.recordHistory[i][0] % 1000)} s`, canvas.width - canvas.width / 7.5, start + i * (canvas.height / 45), "left", "system-ui", 20, "grey");
                }
                else {
                    CanvasUtil.writeText(canvas, `Record: ${Math.floor(this.statistics.recordHistory[i][0] / 1000)}.${Math.floor(this.statistics.recordHistory[i][0] % 1000)} s`, canvas.width - canvas.width / 7.5, start + i * (canvas.height / 45), "left", "system-ui", 20, "grey");
                }
                CanvasUtil.writeText(canvas, `Gen: ${this.statistics.recordHistory[i][1]}`, canvas.width - canvas.width / 17, start + i * (canvas.height / 45), "left", "system-ui", 20, "grey");
            }
        }
        if (this.trackTime % 1000 < 100) {
            CanvasUtil.writeText(canvas, `${Math.floor(this.trackTime / 1000)}.0${Math.floor(this.trackTime % 1000)} s`, canvas.width - canvas.width / 13, canvas.height / 5, "center", "system-ui", 20, "grey");
        }
        else {
            CanvasUtil.writeText(canvas, `${Math.floor(this.trackTime / 1000)}.${Math.floor(this.trackTime % 1000)} s`, canvas.width - canvas.width / 13, canvas.height / 5, "center", "system-ui", 20, "grey");
        }
        if (this.statistics.performanceHistory.length > 0) {
            this.statistics.renderGraph(canvas);
        }
    }
}
//# sourceMappingURL=NetPopulation.js.map