import CanvasUtil from "../utilities/CanvasUtil.js";
import NetCar from "./NetCar.js";
export default class NetPopulation {
    cars = [];
    nextGen = [];
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
    record = Infinity;
    recordHistory = [];
    bestGen = 1;
    currentHighestLaps = 0;
    visualizeBestNetwork = false;
    constructor(size, track, startingPoint, startingAngle) {
        this.size = 50;
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
            for (let i = 0; i <= Math.ceil(car.fitness * 100); i++) {
                selectedCars.push(car);
            }
        });
        this.nextGen = [];
        for (let i = 0; i < this.size; i++) {
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
        const slightMutationRate = 0.15;
        const bigMutationRate = 0.03;
        this.nextGen.forEach((car) => {
            car.genome.forEach((gene) => {
                if (Math.random() < slightMutationRate) {
                    gene[2] += Math.random() * 0.3 - 0.15;
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
                    car.biases[index] += Math.random() * 0.3 - 0.15;
                }
                else if (Math.random() < bigMutationRate) {
                    car.biases[index] = Math.random() * 2 - 1;
                }
                car.biases[index] = Math.max(-1, Math.min(car.biases[index], 1));
            });
        });
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
                if (car.totalLapTime < this.record && car.leftStartLine) {
                    this.record = car.totalLapTime;
                    this.bestGen = this.generation;
                    this.recordHistory.push([this.record, this.bestGen]);
                }
                this.finished = true;
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
                            this.currentHighestLaps = Math.max(this.currentHighestLaps, car.laps);
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
        this.extinct = !this.cars.some((car) => car.alive);
        if (this.extinct) {
            this.extinct = true;
            this.trackTime = 0;
            this.currentHighestLaps = 0;
            this.finished = false;
            this.evolve();
        }
    }
    visualizeNetwork(car, canvas) {
        CanvasUtil.fillRectangle(canvas, canvas.width / 30, canvas.height / 20, canvas.width / 4, canvas.height / 3.5, 0, 0, 0, 0.3, 5);
        CanvasUtil.writeText(canvas, "neural network of best car", canvas.width / 30 + canvas.width / 8, canvas.height / 20 + canvas.height / 3.8, "center", "system-ui", 20, "black");
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
            CanvasUtil.writeText(canvas, `${input}`, canvas.width / 14, canvas.height / 12.5 + input * radius * 3, "center", "system-ui", 20, "black");
        }
        for (let output = 0; output < 4; output++) {
            CanvasUtil.fillCircle(canvas, canvas.width / 4, canvas.height / 14 + radius + output * radius * 3, radius, 255, 255, 255, 0.8);
            CanvasUtil.writeText(canvas, `${output}`, canvas.width / 4, canvas.height / 12.5 + radius + output * radius * 3, "center", "system-ui", 20, "black");
        }
    }
    render(canvas) {
        this.cars.forEach((car) => {
            if (car.alive) {
                car.renderRays(canvas, this.track);
                CanvasUtil.drawCar(canvas, car.posX, car.posY, car.width, car.height, car.rotation, car.red, car.green, car.blue, 0.8);
            }
        });
        CanvasUtil.writeText(canvas, `lap ${this.currentHighestLaps} / 5`, canvas.width / 2.4, canvas.height / 15, 'center', 'system-ui', 30, 'black');
        CanvasUtil.writeText(canvas, `Generation: ${this.generation}`, canvas.width - canvas.width / 12, canvas.height / 10, "center", "system-ui", 30, "white");
        CanvasUtil.writeText(canvas, `Cars alive: ${this.cars.filter((car) => car.alive).length} / ${this.size}`, canvas.width - canvas.width / 12, canvas.height / 8, "center", "system-ui", 20, "white");
        if (this.visualizeBestNetwork) {
            this.visualizeNetwork(this.cars[0], canvas);
        }
        if (this.record !== Infinity) {
            CanvasUtil.writeText(canvas, `Record: ${Math.floor(this.record / 1000)}.${Math.floor((this.record % 1000) / 10)} s`, canvas.width - canvas.width / 7.5, canvas.height / 4, "left", "system-ui", 20, "white");
            CanvasUtil.writeText(canvas, `Gen: ${this.bestGen}`, canvas.width - canvas.width / 17, canvas.height / 4, "left", "system-ui", 20, "grey");
        }
        else {
            CanvasUtil.writeText(canvas, `Record: N/A`, canvas.width - canvas.width / 7.5, canvas.height / 4, "left", "system-ui", 20, "white");
            CanvasUtil.writeText(canvas, `Gen: N/A`, canvas.width - canvas.width / 15, canvas.height / 4, "left", "system-ui", 20, "grey");
        }
        if (this.recordHistory.length > 0) {
            CanvasUtil.writeText(canvas, `Generations that beat record`, canvas.width - canvas.width / 8, canvas.height / 3.1, "left", "system-ui", 15, "grey");
            CanvasUtil.drawLine(canvas, canvas.width - canvas.width / 6.5, canvas.height / 3, canvas.width - canvas.width / 6.5 + canvas.width / 7, canvas.height / 3, 255, 255, 255, 0.2, 2);
            const start = canvas.height / 2.6;
            for (let i = 0; i < this.recordHistory.length; i++) {
                CanvasUtil.writeText(canvas, `Record: ${Math.floor(this.recordHistory[i][0] / 1000)}.${Math.floor((this.recordHistory[i][0] % 1000))} s`, canvas.width - canvas.width / 7.5, start + i * 40, "left", "system-ui", 20, "grey");
                CanvasUtil.writeText(canvas, `Gen: ${this.recordHistory[i][1]}`, canvas.width - canvas.width / 17, start + i * 40, "left", "system-ui", 20, "grey");
            }
        }
        CanvasUtil.writeText(canvas, `${Math.floor(this.trackTime / 1000)}.${Math.floor(this.trackTime % 1000)} s`, canvas.width - canvas.width / 13, canvas.height / 5, "center", "system-ui", 20, "grey");
        CanvasUtil.drawCircle(canvas, this.startingPoint[0], this.startingPoint[1], 85, 255, 0, 0, 1);
    }
}
//# sourceMappingURL=NetPopulation.js.map