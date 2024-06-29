import Car from '../Car.js';
import { ACCELERATE, BRAKE, ROTATE_LEFT, ROTATE_RIGHT, ROTATE_SHARP_LEFT, ROTATE_SHARP_RIGHT, } from '../Actions.js';
export default class GeneticCar extends Car {
    moves = [];
    fitness = 0;
    checkAlive = 800;
    position = 0;
    parentPosition;
    distance = 0;
    collided = false;
    finished = false;
    constructor(midPoint, startAngle, moves, amountMoves, parentPosition = null) {
        super();
        this.width = window.innerHeight / 40;
        this.height = window.innerHeight / 25;
        this.alive = true;
        [this.posX, this.posY] = [midPoint[0], midPoint[1]];
        this.prevPosX = 0;
        this.prevPosY = 0;
        this.rotation = startAngle;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.parentPosition = parentPosition;
        if (moves.length === 0) {
            const possibleMoves = [ACCELERATE, BRAKE, ROTATE_LEFT, ROTATE_RIGHT, ROTATE_SHARP_LEFT, ROTATE_SHARP_RIGHT];
            this.moves = this.generateRandomMoves(amountMoves, possibleMoves);
        }
        else {
            this.moves = moves;
        }
    }
    generateRandomMoves(amountMoves, possibleMoves) {
        const moves = [];
        for (let i = 0; i < amountMoves; i++) {
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            moves.push(randomMove);
        }
        return moves;
    }
    processMoves(moveNumber, elapsed) {
        const move = this.moves[moveNumber];
        if (moveNumber >= this.moves.length - 1) {
            this.checkAlive -= elapsed;
        }
        if (this.checkAlive <= 0) {
            this.alive = false;
        }
        switch (move) {
            case 0:
                this.accelerate();
                break;
            case 1:
                this.brake();
                break;
            case 2:
                this.rotateLeft();
                break;
            case 3:
                this.rotateRight();
                break;
            case 4:
                this.rotateSharpLeft();
                break;
            case 5:
                this.rotateSharpRight();
                break;
            default:
                break;
        }
    }
    mutateMoves(moves) {
        const newMoves = [...moves];
        const mutationCount = Math.ceil(newMoves.length * 0.06);
        for (let i = 0; i < mutationCount; i++) {
            const moveIndex = Math.floor(Math.random() * newMoves.length);
            const currentMutationRate = 0.01 + ((moveIndex / newMoves.length) ** 2);
            if (Math.random() < currentMutationRate) {
                newMoves[moveIndex] = this.generateRandomMove();
            }
        }
        return newMoves;
    }
    generateRandomMove() {
        const possibleMoves = [ACCELERATE, BRAKE, ROTATE_LEFT, ROTATE_RIGHT, ROTATE_SHARP_LEFT, ROTATE_SHARP_RIGHT];
        return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }
    addMoves(amount) {
        const newMoves = this.generateRandomMoves(amount, [ACCELERATE, BRAKE, ROTATE_LEFT, ROTATE_RIGHT, ROTATE_SHARP_LEFT, ROTATE_SHARP_RIGHT]);
        newMoves.forEach((newMove) => {
            this.moves.push(newMove);
        });
    }
    rotateLeft() {
        const deltaRotation = (this.rotation * Math.PI) / 180;
        const deltaX = Math.sin(deltaRotation);
        const deltaY = Math.cos(deltaRotation);
        this.xSpeed += deltaX / 13;
        this.ySpeed -= deltaY / 13;
        if (this.xSpeed !== 0 || this.ySpeed !== 0) {
            this.rotation -= 1.2;
            this.updateSpeedWithRotation();
        }
    }
    rotateRight() {
        const deltaRotation = (this.rotation * Math.PI) / 180;
        const deltaX = Math.sin(deltaRotation);
        const deltaY = Math.cos(deltaRotation);
        this.xSpeed += deltaX / 13;
        this.ySpeed -= deltaY / 13;
        if (this.xSpeed !== 0 || this.ySpeed !== 0) {
            this.rotation += 1.2;
            this.updateSpeedWithRotation();
        }
    }
    rotateSharpLeft() {
        const deltaRotation = (this.rotation * Math.PI) / 180;
        const deltaX = Math.sin(deltaRotation);
        const deltaY = Math.cos(deltaRotation);
        this.xSpeed += deltaX / 20;
        this.ySpeed -= deltaY / 20;
        if (this.xSpeed !== 0 || this.ySpeed !== 0) {
            this.rotation -= 2;
            this.updateSpeedWithRotation();
        }
    }
    rotateSharpRight() {
        const deltaRotation = (this.rotation * Math.PI) / 180;
        const deltaX = Math.sin(deltaRotation);
        const deltaY = Math.cos(deltaRotation);
        this.xSpeed += deltaX / 20;
        this.ySpeed -= deltaY / 20;
        if (this.xSpeed !== 0 || this.ySpeed !== 0) {
            this.rotation += 2;
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
        if (this.xSpeed >= -5 && this.xSpeed <= 5) {
            this.xSpeed += deltaX / 7;
        }
        if (this.ySpeed >= -5 && this.ySpeed <= 5) {
            this.ySpeed -= deltaY / 7;
        }
    }
    brake() {
        const brakeFactor = 1 - (1 - 0.6) / 13;
        this.xSpeed *= brakeFactor;
        this.ySpeed *= brakeFactor;
    }
    updateDistance() {
        const distance = Math.abs(this.xSpeed) + Math.abs(this.ySpeed);
        this.distance += distance;
    }
    update(elapsed) {
        this.xSpeed *= 0.99;
        this.ySpeed *= 0.99;
        if (Math.abs(this.xSpeed) + Math.abs(this.ySpeed) <= 0.01) {
            this.checkAlive -= elapsed;
        }
        if (this.checkAlive <= 0) {
            this.alive = false;
        }
        this.posX += this.xSpeed;
        this.posY += this.ySpeed;
    }
}
//# sourceMappingURL=GeneticCar.js.map