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
    beaten = false;
    finished = false;
    static startingPoint;
    startingRotation;
    highscoreTimesBeaten = 0;
    generationTime = 0;
    maxDistance = 0;
    performanceHistory = [[0, 0]];
    highest = -Infinity;
    posYCap = 500;
    lowest = Infinity;
    crossed = false;
    constructor(size, startingPoint, startingAngle, track) {
        this.size = size;
        this.track = track;
        GeneticPopulation.startingPoint = startingPoint;
        this.startingRotation = startingAngle;
        for (let i = 0; i < this.size; i++) {
            this.cars.push(new GeneticCar(GeneticPopulation.startingPoint, this.startingRotation, [], this.amountMoves));
        }
        this.track.road.forEach((road) => {
            road[2] = 1;
        });
    }
    update(elapsed) {
        this.generationTime += elapsed;
        this.cars.forEach((car) => {
            car.alive = this.track.checkCollisionWithTrack(car);
            if (car.alive) {
                car.raceDuration += elapsed;
                if (!this.crossed) {
                    if (car.raceDuration >= 3000) {
                        if (Math.sqrt(((car.posX - this.track.midPoint[0]) ** 2) + ((car.posY - this.track.midPoint[1]) ** 2)) <= this.track.radius) {
                            if (this.track.checkCrossingFinishLine(car)) {
                                if (!car.crossingFinishLine && car.leftStartLine) {
                                    car.crossingFinishLine = true;
                                    this.crossed = true;
                                    car.laps += 1;
                                }
                            }
                            else {
                                car.crossingFinishLine = false;
                            }
                        }
                    }
                }
                car.processMoves(this.moveNumber, elapsed);
                car.update(elapsed);
                car.updateDistance();
            }
        });
        let highestDistance = -Infinity;
        this.cars.forEach((car) => {
            if (car.distance > highestDistance) {
                highestDistance = car.distance;
            }
        });
        this.maxDistance = Math.max(this.maxDistance, highestDistance);
        this.extinct = !this.cars.some((car) => car.alive);
        if (this.extinct) {
            this.extinct = true;
            this.crossed = false;
            this.maxDistance = 0;
            this.moveNumber = 0;
            this.generationTime = 0;
            this.finished = false;
            this.evolve();
        }
        else {
            this.moveDuration -= elapsed;
            if (this.moveDuration <= 0) {
                this.moveNumber += 1;
                this.moveDuration = 200;
            }
        }
    }
    evolve() {
        this.generation += 1;
        this.calculateFitness();
        this.sortPlayersByFitness();
        this.generateNextGen();
    }
    calculateFitness() {
        let worstDistanceCar = Infinity;
        let highestDistanceCar = -Infinity;
        this.cars.forEach((car) => {
            if (car.distance <= worstDistanceCar) {
                worstDistanceCar = car.distance;
            }
            if (car.distance >= highestDistanceCar) {
                highestDistanceCar = car.distance;
            }
        });
        this.cars.forEach((car) => {
            car.fitness = 0.2 * car.distance;
            const highestLaps = Math.max(...this.cars.map((geneticCar) => geneticCar.laps));
            car.laps = highestLaps;
            if (car.collided) {
                car.fitness = 0;
            }
            if (car.laps > 0) {
                car.fitness *= car.laps + 1;
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
        this.performanceHistory.push([this.cars[0].fitness, this.generation]);
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
    renderGraph(canvas) {
        const top = canvas.height * 0.6;
        const height = canvas.height * 0.295;
        const width = canvas.width * 0.11;
        const bottom = top + height;
        const left = canvas.width * 0.866;
        CanvasUtil.writeText(canvas, "Fitness each generation", left + width / 2.4, canvas.height * 0.535, "center", "system-ui", 20, "white");
        if (this.performanceHistory.length === 0) {
            CanvasUtil.writeText(canvas, "(No data yet)", left + width / 2.4, canvas.height * 0.56, "center", "system-ui", 15, "lightgray");
            [this.highest, this.lowest] = [500, 0];
        }
        else if (this.performanceHistory.length === 1) {
            [this.highest, this.lowest] = [500, 0];
        }
        else {
            this.highest = -Infinity;
            this.lowest = Infinity;
            this.performanceHistory.forEach((entry) => {
                const fitness = entry[0];
                this.highest = Math.max(fitness, this.highest);
                if (this.highest > this.posYCap) {
                    this.posYCap = Math.ceil(this.highest / 500) * 500;
                }
                this.lowest = Math.min(fitness, this.lowest);
            });
        }
        CanvasUtil.fillRectangle(canvas, left, top, width, height, 0, 0, 0, 1, 5);
        CanvasUtil.drawLine(canvas, left + width * 0.05, top + height * 0.1, left + width * 0.05, bottom - height * 0.08, 255, 255, 255, 0.5, 1);
        CanvasUtil.drawLine(canvas, left + width * 0.05, bottom - height * 0.08, left + width * 0.95, bottom - height * 0.08, 255, 255, 255, 0.5, 1);
        const numGridLines = 5;
        for (let i = 0; i < numGridLines; i++) {
            const value = this.lowest + (i * (this.posYCap - this.lowest)) / (numGridLines - 1);
            const y = bottom - height * 0.1 - height * 0.8 * ((value - this.lowest) / (this.posYCap - this.lowest));
            CanvasUtil.drawLine(canvas, left + width * 0.05, y, left + width * 0.95, y, 255, 255, 255, 0.2, 1);
            const labelText = `${Math.floor(value)}`;
            CanvasUtil.writeText(canvas, labelText, left - 10, y, "right", "system-ui", 10, "white");
        }
        for (let i = 0; i < this.performanceHistory.length; i++) {
            const score = this.performanceHistory[i][0];
            const yNormalized = (score - this.lowest) / (this.posYCap - this.lowest);
            const x = left + width * 0.1 + ((width * 0.8) / this.performanceHistory.length) * i;
            const y = bottom - height * 0.1 - height * 0.8 * yNormalized;
            if (i > 0) {
                const lastTime = this.performanceHistory[i - 1][0];
                const lastYNormalized = (lastTime - this.lowest) / (this.posYCap - this.lowest);
                const lastX = left + width * 0.1 + ((width * 0.8) / this.performanceHistory.length) * (i - 1);
                const lastY = bottom - height * 0.1 - height * 0.8 * lastYNormalized;
                CanvasUtil.drawLine(canvas, lastX + 10, lastY, x + 10, y, 255, 255, 255, 0.5, 1);
            }
            CanvasUtil.fillCircle(canvas, x + 10, y, 3, 255, 255, 255, 1);
            CanvasUtil.drawLine(canvas, x + 10, bottom - height * 0.06, x + 10, bottom - height * 0.08 - 5, 255, 255, 255, 0.5, 1);
            if (this.performanceHistory.length <= 7 || score === this.highest || score === this.lowest) {
                CanvasUtil.writeText(canvas, `${Math.round(score)}`, x + 10, y - 10, "center", "system-ui", 10, "white");
            }
        }
    }
    render(canvas) {
        this.cars.forEach((car) => {
            if (car.alive) {
                CanvasUtil.drawCar(canvas, car.posX, car.posY, car.width, car.height, car.rotation, 0, 255, 0, 0.5, false);
            }
        });
        CanvasUtil.writeText(canvas, `Generation: ${this.generation}`, canvas.width - canvas.width / 12, canvas.height / 10, "center", "system-ui", 30, "white");
        CanvasUtil.writeText(canvas, `Cars alive: ${this.cars.filter((car) => car.alive).length} / ${Math.ceil(this.size)}`, canvas.width - canvas.width / 12, canvas.height / 8, "center", "system-ui", 18, "grey");
        CanvasUtil.writeText(canvas, `Fitness record: ${Math.round(this.highScore * 10) / 10}`, canvas.width - canvas.width / 12, canvas.height / 6, "center", "system-ui", 20, "white");
        this.renderGraph(canvas);
        CanvasUtil.drawCircle(canvas, this.track.midPoint[0], this.track.midPoint[1], this.track.radius, 255, 0, 0, 1);
    }
}
//# sourceMappingURL=GeneticPopulation.js.map