import UI from '../utilities/UI.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import KeyListener from '../utilities/KeyListener.js';
import DisplayCar from './DisplayCar.js';
import NetCar from './NetCar.js';
import Statistics from './Statistics.js';
import Usercar from './Usercar.js';
import DrawTrack from '../scenes/DrawTrack.js';
import MouseListener from '../utilities/MouseListener.js';
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
    usercar;
    statistics = new Statistics();
    raceCountdown = 5000;
    finishCountdown = 4000;
    startFinishCountdown = false;
    startCountdown = false;
    ai;
    showChoose = false;
    constructor(size, track, startingPoint, startingAngle) {
        this.size = size;
        Statistics.size = size;
        this.track = track;
        this.startingPoint = startingPoint;
        this.startingAngle = startingAngle;
        this.extinct = false;
        this.species = [];
        for (let i = 0; i < this.size; i++) {
            const [genome, biases] = [this.createInitialGenome()[0], this.createInitialGenome()[1]];
            this.cars.push(new NetCar(startingPoint, startingAngle, genome, biases, 1));
        }
        this.usercar = new Usercar(startingPoint, startingAngle);
        this.ai = new NetCar(startingPoint, startingAngle, this.cars[0].genome, this.cars[0].biases, 1);
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
        this.cars.forEach((car) => {
            if (car.laps > 0) {
                car.fitness = ((1 / (car.raceDuration / 1000)) * 100) ** car.laps;
            }
            else {
                car.fitness += car.distance / 1000;
            }
            if (!car.leftStartLine) {
                car.fitness = 0;
            }
        });
        this.highScore = Math.max(this.highScore, ...this.cars.map((car) => car.fitness));
    }
    sortPlayers() {
        this.species.forEach((species) => {
            species.sort((car1, car2) => car2.fitness - car1.fitness);
        });
        this.cars = this.cars.sort((car1, car2) => car2.fitness - car1.fitness);
    }
    crossover() {
        const survived = [];
        const selectedCars = [];
        const { selectionPercentage } = Statistics;
        if (Statistics.championsSurvive) {
            this.champions = [];
            this.champions.push(new NetCar(this.startingPoint, this.startingAngle, this.cars[0].genome, this.cars[0].biases, 1));
            this.champions.push(new NetCar(this.startingPoint, this.startingAngle, this.cars[1].genome, this.cars[1].biases, 1));
        }
        this.species.forEach((species) => {
            const numToSelect = Math.ceil(species.length * selectionPercentage);
            const topCars = species.slice(0, numToSelect);
            survived.push(...topCars);
        });
        const totalFitness = survived.reduce((sum, car) => sum + car.fitness, 0);
        function selectCar(survived) {
            let random = Math.random() * totalFitness;
            for (const car of survived) {
                if (random < car.fitness) {
                    return car;
                }
                random -= car.fitness;
            }
            return survived[survived.length - 1];
        }
        this.nextGen = [];
        for (let i = 0; i < this.size - 2; i++) {
            const parent1 = selectCar(survived);
            const parent2 = selectCar(survived);
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
            this.nextGen.push(new NetCar(this.startingPoint, this.startingAngle, babyGenes, babyBiases, 1));
        }
    }
    mutate() {
        const { slightMutationRate } = Statistics;
        const { bigMutationRate } = Statistics;
        console.log(`slightMutationRate: ${slightMutationRate}, bigMutationRate: ${bigMutationRate}`);
        this.nextGen.forEach((car) => {
            car.genome.forEach((gene) => {
                if (Math.random() < slightMutationRate) {
                    gene[2] += Math.random() * 0.25 - 0.125;
                }
                if (Math.random() < bigMutationRate) {
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
        if (Statistics.championsSurvive) {
            this.nextGen.push(...this.champions);
        }
        this.cars = this.nextGen;
    }
    update(elapsed) {
        if (KeyListener.keyPressed('Delete')) {
            if (DrawTrack.racing) {
                this.showChoose = true;
            }
        }
        if (DrawTrack.racing) {
            if (this.startCountdown) {
                this.raceCountdown -= elapsed;
            }
            if (this.raceCountdown <= 0) {
                this.startCountdown = false;
                this.usercar.update(elapsed, this.track);
                this.ai.update(elapsed, this.track, true);
                if (this.track.checkCrossingFinishLine(this.ai)) {
                    if (!this.ai.crossingFinishLine && this.ai.leftStartLine) {
                        this.ai.laps += 1;
                        this.ai.crossingFinishLine = true;
                        this.ai.timeSinceLastLap = 0;
                        Statistics.currentHighestLaps = Math.max(Statistics.currentHighestLaps, this.ai.laps);
                    }
                }
                else {
                    this.ai.crossingFinishLine = false;
                }
                if (this.track.checkCrossingFinishLine(this.usercar)) {
                    if (!this.usercar.crossingFinishLine && this.usercar.leftStartLine) {
                        this.usercar.laps += 1;
                        this.usercar.crossingFinishLine = true;
                        Statistics.currentHighestLaps = Math.max(Statistics.currentHighestLaps, this.usercar.laps);
                    }
                }
                else {
                    this.usercar.crossingFinishLine = false;
                }
            }
            if (this.usercar.laps >= 5) {
                this.usercar.finished = true;
                this.raceCountdown = 5000;
                this.startCountdown = false;
                this.startFinishCountdown = true;
            }
            else if (this.ai.laps >= 5) {
                this.ai.finished = true;
                this.raceCountdown = 5000;
                this.startCountdown = false;
                this.startFinishCountdown = true;
            }
            if (this.startFinishCountdown) {
                this.finishCountdown -= elapsed;
            }
            if (this.finishCountdown <= 0) {
                this.finishCountdown = 4000;
                this.startFinishCountdown = false;
                this.ai.laps = 0;
                this.usercar.laps = 0;
            }
        }
        if (!this.finished) {
            this.trackTime += elapsed;
        }
        if (this.raceCountdown >= 5000) {
            this.cars.forEach((car) => {
                car.alive = this.track.checkCollisionWithTrack(car);
                if (car.timeSinceLastLap >= 15000) {
                    car.alive = false;
                }
                if (car.laps >= 5) {
                    car.finished = true;
                    car.alive = false;
                    if (car.raceDuration < Statistics.record && car.leftStartLine) {
                        Statistics.record = car.raceDuration;
                        Statistics.bestGen = this.generation;
                        Statistics.recordCar.genome = car.genome;
                        this.statistics.recordHistory.push([Statistics.record, Statistics.bestGen, new DisplayCar(car.genome)]);
                    }
                    if (!this.statistics.addedToHistory && car.leftStartLine) {
                        this.finished = true;
                        Statistics.performanceHistory.push([this.trackTime, this.generation, new DisplayCar(car.genome)]);
                        this.statistics.addedToHistory = true;
                    }
                }
                if (car.alive) {
                    car.raceDuration += elapsed;
                    car.timeSinceLastLap += elapsed;
                    if (car.raceDuration >= 1700) {
                        if (this.track.checkCrossingFinishLine(car)) {
                            if (!car.crossingFinishLine && car.leftStartLine) {
                                car.laps += 1;
                                car.crossingFinishLine = true;
                                car.timeSinceLastLap = 0;
                                Statistics.currentHighestLaps = Math.max(Statistics.currentHighestLaps, car.laps);
                            }
                        }
                        else {
                            car.crossingFinishLine = false;
                        }
                    }
                    car.update(elapsed, this.track, false);
                    car.updateDistance();
                }
                else {
                    car.xSpeed = 0;
                    car.ySpeed = 0;
                }
            });
        }
        this.handleCarLines(elapsed);
        this.extinct = !this.cars.some((car) => car.alive);
        if (this.extinct) {
            this.extinct = true;
            this.trackTime = 0;
            this.finished = false;
            this.statistics.addedToHistory = false;
            this.track.deathPositions = [];
            Statistics.currentHighestLaps = 0;
            this.size = Statistics.size;
            this.evolve();
        }
        Statistics.carsAlive = this.cars.filter((car) => car.alive).length;
        Statistics.species = this.species.length;
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
                    CanvasUtil.drawLine(canvas, car.locationHistory[i][0], car.locationHistory[i][1], car.locationHistory[i - 1][0], car.locationHistory[i - 1][1], 255, 255, 255, opacity, 1);
                }
            }
        });
    }
    render(canvas) {
        if (DrawTrack.racing) {
            if (this.raceCountdown <= 0) {
                this.usercar.render(canvas);
                this.ai.castRays(this.track);
                CanvasUtil.createNetCar(canvas, this.ai);
            }
        }
        if (this.statistics.renderRacingLines) {
            this.renderCarLines(canvas);
        }
        if (this.raceCountdown >= 5000) {
            this.cars.forEach((car) => {
                if (car.alive) {
                    car.renderRays(canvas, this.track);
                    CanvasUtil.createNetCar(canvas, car);
                }
            });
        }
        if (!UI.openSettings) {
            CanvasUtil.writeText(canvas, `lap ${Statistics.currentHighestLaps} / 5`, canvas.width / 2.4, canvas.height / 8, 'center', 'system-ui', 30, 'black');
        }
        CanvasUtil.writeText(canvas, `Generation: ${this.generation}`, canvas.width - canvas.width / 12, canvas.height / 10, 'center', 'system-ui', 30, 'white');
        CanvasUtil.writeText(canvas, `Cars alive: ${this.cars.filter((car) => car.alive).length} / ${this.size}`, canvas.width - canvas.width / 12, canvas.height / 8, 'center', 'system-ui', 20, 'white');
        CanvasUtil.writeText(canvas, `Species: ${this.species.length}`, canvas.width - canvas.width / 12, canvas.height / 6, 'center', 'system-ui', 20, 'white');
        this.statistics.renderButtons(canvas);
        if (Statistics.record !== Infinity) {
            if (Math.floor(Statistics.record % 1000) < 100) {
                CanvasUtil.writeText(canvas, `Record: ${Math.floor(Statistics.record / 1000)}.0${Math.floor(Statistics.record % 1000)} s`, canvas.width - canvas.width / 7.5, canvas.height / 4, 'left', 'system-ui', 20, 'white');
            }
            else {
                CanvasUtil.writeText(canvas, `Record: ${Math.floor(Statistics.record / 1000)}.${Math.floor(Statistics.record % 1000)} s`, canvas.width - canvas.width / 7.5, canvas.height / 4, 'left', 'system-ui', 20, 'white');
            }
            CanvasUtil.writeText(canvas, `Gen: ${Statistics.bestGen}`, canvas.width - canvas.width / 17, canvas.height / 4, 'left', 'system-ui', 20, 'grey');
        }
        else {
            CanvasUtil.writeText(canvas, 'Record: N/A', canvas.width - canvas.width / 7.5, canvas.height / 4, 'left', 'system-ui', 20, 'white');
            CanvasUtil.writeText(canvas, 'Gen: N/A', canvas.width - canvas.width / 15, canvas.height / 4, 'left', 'system-ui', 20, 'grey');
        }
        if (this.statistics.recordHistory.length > 0) {
            CanvasUtil.writeText(canvas, 'Generations that beat record', canvas.width - canvas.width / 8, canvas.height / 3.1, 'left', 'system-ui', 15, 'grey');
            CanvasUtil.drawLine(canvas, canvas.width - canvas.width / 6.5, canvas.height / 3, canvas.width - canvas.width / 6.5 + canvas.width / 7, canvas.height / 3, 255, 255, 255, 0.2, 2);
            const start = canvas.height / 2.6;
            const rowHeight = canvas.height / 35;
            for (let i = 0; i < this.statistics.recordHistory.length; i++) {
                if (Math.floor(this.statistics.recordHistory[i][0] % 1000) < 100) {
                    CanvasUtil.writeText(canvas, `${Math.floor(this.statistics.recordHistory[i][0] / 1000)}.0${Math.floor(this.statistics.recordHistory[i][0] % 1000)} s`, canvas.width - canvas.width / 11, start + i * rowHeight, 'left', 'system-ui', 20, 'grey');
                }
                else {
                    CanvasUtil.writeText(canvas, `${Math.floor(this.statistics.recordHistory[i][0] / 1000)}.${Math.floor(this.statistics.recordHistory[i][0] % 1000)} s`, canvas.width - canvas.width / 11, start + i * rowHeight, 'left', 'system-ui', 20, 'grey');
                }
                CanvasUtil.writeText(canvas, `Gen: ${this.statistics.recordHistory[i][1]}: `, canvas.width - canvas.width / 7.5, start + i * rowHeight, 'left', 'system-ui', 20, 'white');
                CanvasUtil.createNetCar(canvas, this.statistics.recordHistory[i][2], canvas.width - canvas.width / 28, start + i * rowHeight - canvas.height / 100, 0.8, 90);
            }
        }
        if (this.trackTime % 1000 < 100) {
            CanvasUtil.writeText(canvas, `${Math.floor(this.trackTime / 1000)}.0${Math.floor(this.trackTime % 1000)} s`, canvas.width - canvas.width / 13, canvas.height / 5, 'center', 'system-ui', 20, 'grey');
        }
        else {
            CanvasUtil.writeText(canvas, `${Math.floor(this.trackTime / 1000)}.${Math.floor(this.trackTime % 1000)} s`, canvas.width - canvas.width / 13, canvas.height / 5, 'center', 'system-ui', 20, 'grey');
        }
        if (UI.openSettings) {
            UI.renderSettings(canvas, this.generation, this.track);
            this.statistics.renderNetwork(this.cars, canvas);
        }
        else {
            CanvasUtil.writeText(canvas, 'Customization & statistics ->', canvas.width * 0.66, canvas.height * 0.143, 'left', 'system-ui', 20, 'lightgray');
        }
        if (this.showChoose) {
            const width = window.innerWidth * 0.2;
            const height = window.innerHeight * 0.4;
            let easyOpacity = 0.8;
            let normalOpacity = 0.8;
            let hardOpacity = 0.8;
            const handleMouseHover = (x, y, difficulty, opacity) => {
                if (MouseListener.mouseHover(x, y, width, height)) {
                    opacity = 1;
                    if (MouseListener.isButtonDown(0)) {
                        this.startCountdown = true;
                        this.raceCountdown = 5000;
                        this.usercar = new Usercar(this.startingPoint, this.startingAngle);
                        this.ai = new NetCar(this.startingPoint, this.startingAngle, this.champions[0].genome, this.champions[0].biases, difficulty);
                        this.showChoose = false;
                    }
                }
                return opacity;
            };
            easyOpacity = handleMouseHover(window.innerWidth * 0.1, window.innerHeight * 0.3, 0.8, easyOpacity);
            normalOpacity = handleMouseHover(window.innerWidth * 0.35, window.innerHeight * 0.3, 1, normalOpacity);
            hardOpacity = handleMouseHover(window.innerWidth * 0.6, window.innerHeight * 0.3, 1.3, hardOpacity);
            CanvasUtil.fillRectangleWithGradient(canvas, canvas.width * 0.1, canvas.height * 0.3, width, height, [{ red: 70, green: 255, blue: 100, opacity: easyOpacity, stop: 0.5 }, { red: 0, green: 200, blue: 200, opacity: easyOpacity, stop: 1 }], 60, 20);
            CanvasUtil.fillRectangleWithGradient(canvas, canvas.width * 0.35, canvas.height * 0.3, width, height, [{ red: 255, green: 255, blue: 50, opacity: normalOpacity, stop: 0.5 }, { red: 200, green: 100, blue: 0, opacity: normalOpacity, stop: 1 }], -80, 20);
            CanvasUtil.fillRectangleWithGradient(canvas, canvas.width * 0.6, canvas.height * 0.3, width, height, [{ red: 255, green: 100, blue: 50, opacity: hardOpacity, stop: 0.5 }, { red: 200, green: 50, blue: 150, opacity: hardOpacity, stop: 1 }], 200, 20);
            CanvasUtil.writeText(canvas, 'Makkelijk', canvas.width * 0.2, canvas.height * 0.4, 'center', 'system-ui', 50, 'black', 500);
            CanvasUtil.writeText(canvas, 'Normaal', canvas.width * 0.45, canvas.height * 0.4, 'center', 'system-ui', 50, 'black', 500);
            CanvasUtil.writeText(canvas, 'Moeilijk', canvas.width * 0.7, canvas.height * 0.4, 'center', 'system-ui', 50, 'black', 500);
        }
        if (this.startCountdown) {
            if (this.raceCountdown <= 3000) {
                CanvasUtil.writeText(canvas, `${Math.ceil(this.raceCountdown / 1000)}`, canvas.width * 0.43, canvas.height / 2, 'center', 'system-ui', 300, 'red', 300);
            }
        }
        if (this.startFinishCountdown) {
            if (this.usercar.finished) {
                CanvasUtil.writeText(canvas, 'Gewonnen!', canvas.width * 0.43, canvas.height / 2, 'center', 'system-ui', 200, 'green', 300);
            }
            else if (this.ai.finished) {
                CanvasUtil.writeText(canvas, 'Verloren', canvas.width * 0.43, canvas.height / 2, 'center', 'system-ui', 200, 'red', 300);
            }
        }
    }
}
//# sourceMappingURL=NetPopulation.js.map