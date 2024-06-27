import Car from '../Car.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
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
    laps = 0;
    crossingFinishLine = false;
    leftStartLine = false;
    totalLapTime = 0;
    rank = 0;
    startingPoint = [0, 0];
    constructor(startPoint, startAngle, genome) {
        super();
        this.width = window.innerHeight / 40;
        this.height = window.innerHeight / 25;
        this.alive = true;
        [this.posX, this.posY] = [startPoint[0], startPoint[1]];
        this.startingPoint = startPoint;
        this.rotation = startAngle;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.rayLengths = Array(this.numRays).fill(this.rayLength);
        this.genome = genome;
    }
    castRays(track) {
        const rayAngles = this.calculateRayAngles();
        this.rayLengths = rayAngles.map((angle) => this.castRay(angle, track));
        return this.rayLengths;
    }
    calculateRayAngles() {
        const angles = [];
        for (let i = 0; i < this.numRays; i++) {
            const angle = (i / (this.numRays - 1)) * this.raySpread - (this.raySpread / 2) - 90;
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
            const [inputIndex, outputIndex, weight] = connection;
            if (inputIndex < inputs.length && outputIndex < outputLayer.length) {
                outputLayer[outputIndex] += (inputs[inputIndex] / this.rayLength) * weight;
            }
        });
        const activatedOutputLayer = outputLayer.map((neuron) => this.sigmoid(neuron));
        const [moveLeft, moveRight, accelerate, brake] = activatedOutputLayer;
        if (moveLeft > 0.75)
            this.rotateLeft();
        if (moveRight > 0.75)
            this.rotateRight();
        if (accelerate > 0.75)
            this.accelerate();
        if (brake > 0.75)
            this.brake();
    }
    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }
    update(elapsed) {
        this.feedForward(this.rayLengths);
        this.xSpeed *= 0.995;
        this.ySpeed *= 0.995;
        const distanceFromStart = Math.sqrt((this.posX - this.startingPoint[0]) ** 2 +
            (this.posY - this.startingPoint[1]) ** 2);
        if (distanceFromStart > 40) {
            this.leftStartLine = true;
        }
        if (Math.abs(this.xSpeed) + Math.abs(this.ySpeed) <= 0.4) {
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
            this.rotation -= 3.8;
            this.updateSpeedWithRotation();
        }
        if (this.alive) {
            console.log(Math.abs(this.xSpeed) + Math.abs(this.ySpeed));
        }
    }
    rotateRight() {
        if (Math.abs(this.xSpeed) + Math.abs(this.ySpeed) >= 0.2) {
            this.rotation += 3.8;
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
        const brakeFactor = 1 - (1 - 0.6) / 15;
        this.xSpeed *= brakeFactor;
        this.ySpeed *= brakeFactor;
    }
    updateDistance() {
        const distance = Math.abs(this.xSpeed) + Math.abs(this.ySpeed);
        this.distance += distance;
    }
    render(canvas, track) {
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