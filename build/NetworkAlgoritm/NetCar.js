import Car from "../Car.js";
import CanvasUtil from "../utilities/CanvasUtil.js";
export default class NetCar extends Car {
    fitness = 0;
    checkAlive = 500;
    position = 0;
    parentPosition;
    distance = 0;
    collided = false;
    finished = false;
    rayLength = 150;
    numRays = 5;
    raySpread = 180;
    rayLengths;
    genome = [];
    biases = [];
    laps = 0;
    crossingFinishLine = false;
    leftStartLine = false;
    timeSinceLastLap = 0;
    totalLapTime = 0;
    startingPoint = [0, 0];
    red = 0;
    green = 255;
    blue = 0;
    constructor(startPoint, startAngle, genome, biases) {
        super();
        this.onFinishLine = false;
        this.width = window.innerHeight / 40;
        this.height = window.innerHeight / 25;
        this.alive = true;
        this.prevPosX = 0;
        this.prevPosY = 0;
        [this.posX, this.posY] = [startPoint[0], startPoint[1]];
        this.startingPoint = startPoint;
        this.rotation = startAngle;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.rayLengths = Array(this.numRays).fill(this.rayLength);
        this.genome = genome;
        this.biases = biases;
    }
    castRays(track) {
        const rayAngles = this.calculateRayAngles();
        this.rayLengths = rayAngles.map((angle) => this.castRay(angle, track));
        return this.rayLengths;
    }
    calculateRayAngles() {
        const angles = [];
        for (let i = 0; i < this.numRays; i++) {
            const angle = (i / (this.numRays - 1)) * this.raySpread - this.raySpread / 2 - 90;
            angles.push(this.rotation + angle);
        }
        return angles;
    }
    castRay(angle, track) {
        const radianAngle = (angle * Math.PI) / 180;
        let rayX = this.posX;
        let rayY = this.posY;
        for (let d = 0; d < this.rayLength; d++) {
            rayX = this.posX + d * Math.cos(radianAngle);
            rayY = this.posY + d * Math.sin(radianAngle);
            const gridX = Math.floor(rayX / track.gridSize);
            const gridY = Math.floor(rayY / track.gridSize);
            let collisionOccured = false;
            for (let offsetX = -1; offsetX <= 1; offsetX++) {
                for (let offsetY = -1; offsetY <= 1; offsetY++) {
                    const cellX = gridX + offsetX;
                    const cellY = gridY + offsetY;
                    const cellKey = `${cellX},${cellY}`;
                    const tracksInCell = track.getTracksInCell(cellKey);
                    tracksInCell.forEach((trackIndex) => {
                        const [trackX, trackY] = track.road[trackIndex];
                        const distanceSquared = (rayX - trackX) ** 2 + (rayY - trackY) ** 2;
                        const minDistanceSquared = track.radius ** 2;
                        if (distanceSquared < minDistanceSquared) {
                            collisionOccured = true;
                        }
                    });
                }
            }
            if (!collisionOccured) {
                return d;
            }
        }
        return this.rayLength;
    }
    feedForward(inputs) {
        const outputLayer = [0, 0, 0, 0];
        this.genome.forEach((connection) => {
            const [inputIndex, outputIndex, weight, bias] = connection;
            if (inputIndex < inputs.length && outputIndex < outputLayer.length) {
                outputLayer[outputIndex] += (inputs[inputIndex] / this.rayLength) * weight;
            }
        });
        const activatedOutputLayer = outputLayer.map((neuron) => this.sigmoid(neuron));
        const turnActions = activatedOutputLayer.slice(0, 2);
        const speedActions = activatedOutputLayer.slice(2, 4);
        let red = 255;
        let green = 255;
        let blue = 255;
        if (turnActions[0] > turnActions[1]) {
            this.rotateLeft();
            blue -= 150;
        }
        else if (turnActions[1] > turnActions[0]) {
            this.rotateRight();
            red -= 150;
        }
        if (speedActions[0] > speedActions[1]) {
            this.accelerate();
        }
        else if (speedActions[1] > speedActions[0]) {
            this.brake();
            green -= 255;
            blue -= 255;
        }
        this.red = red;
        this.green = green;
        this.blue = blue;
    }
    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }
    update(elapsed) {
        this.prevPosX = this.posX;
        this.prevPosY = this.posY;
        this.feedForward(this.rayLengths);
        this.xSpeed *= 0.98;
        this.ySpeed *= 0.98;
        const distanceFromStart = Math.sqrt((this.posX - this.startingPoint[0]) ** 2 + (this.posY - this.startingPoint[1]) ** 2);
        if (distanceFromStart > 120) {
            this.leftStartLine = true;
        }
        if (Math.abs(this.xSpeed) + Math.abs(this.ySpeed) <= 0.55) {
            this.checkAlive -= elapsed;
        }
        if (this.checkAlive <= 0) {
            this.alive = false;
        }
        this.posX += (this.xSpeed / 5) * elapsed;
        this.posY += (this.ySpeed / 5) * elapsed;
    }
    rotateLeft() {
        if (Math.abs(this.xSpeed) + Math.abs(this.ySpeed) >= 0.2) {
            this.rotation -= 4.2;
            this.updateSpeedWithRotation();
        }
    }
    rotateRight() {
        if (Math.abs(this.xSpeed) + Math.abs(this.ySpeed) >= 0.2) {
            this.rotation += 4.2;
            this.updateSpeedWithRotation();
        }
    }
    updateSpeedWithRotation() {
        const radians = ((this.rotation - 90) * Math.PI) / 180;
        const speedMagnitude = Math.sqrt(this.xSpeed * this.xSpeed + this.ySpeed * this.ySpeed);
        this.xSpeed = speedMagnitude * Math.cos(radians);
        this.ySpeed = speedMagnitude * Math.sin(radians);
    }
    accelerate() {
        const deltaRotation = (this.rotation * Math.PI) / 180;
        const deltaX = Math.sin(deltaRotation);
        const deltaY = Math.cos(deltaRotation);
        this.xSpeed += deltaX / 17;
        this.ySpeed -= deltaY / 17;
    }
    brake() {
        const brakeFactor = 1 - (1 - 0.6) / 20;
        this.xSpeed *= brakeFactor;
        this.ySpeed *= brakeFactor;
    }
    updateDistance() {
        const distance = Math.abs(this.xSpeed) + Math.abs(this.ySpeed);
        this.distance += distance;
    }
    renderRays(canvas, track) {
        this.castRays(track);
        const rayAngles = this.calculateRayAngles();
        rayAngles.forEach((angle, i) => {
            const distance = this.rayLengths[i];
            const radianAngle = (angle * Math.PI) / 180;
            const endX = this.posX + distance * Math.cos(radianAngle);
            const endY = this.posY + distance * Math.sin(radianAngle);
            CanvasUtil.drawLine(canvas, this.posX, this.posY, endX, endY, 0, 255, 0, 1, 0.3);
        });
    }
}
//# sourceMappingURL=NetCar.js.map