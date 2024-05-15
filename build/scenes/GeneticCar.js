import Car from "./Car.js";
import { ACCELERATE, BRAKE, ROTATE_LEFT, ROTATE_RIGHT, } from './Actions.js';
export default class GeneticCar extends Car {
    moves = [];
    fitness = 0;
    constructor(midPoint, startAngle, amountMoves) {
        super();
        this.width = window.innerHeight / 40;
        this.height = window.innerHeight / 25;
        this.alive = true;
        [this.posX, this.posY] = [midPoint[0], midPoint[1]];
        this.rotation = startAngle;
        this.xSpeed = 0;
        this.ySpeed = 0;
        const possibleMoves = [ACCELERATE, BRAKE, ROTATE_LEFT, ROTATE_RIGHT];
        this.moves = this.generateRandomMoves(amountMoves, possibleMoves);
        console.log(this.moves);
    }
    generateRandomMoves(amountMoves, possibleMoves) {
        const moves = [];
        for (let i = 0; i < amountMoves; i++) {
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            moves.push(randomMove);
        }
        return moves;
    }
    processMoves(moveNumber) {
        const move = this.moves[moveNumber];
        console.log(move);
        switch (move) {
            case 0:
                this.rotateLeft();
                break;
            case 1:
                this.rotateRight();
                break;
            case 2:
                this.accelerate();
                break;
            case 3:
                this.brake();
                break;
            default:
                break;
        }
    }
    rotateLeft() {
        if (this.xSpeed !== 0 || this.ySpeed !== 0) {
            this.rotation -= 20;
            this.updateSpeedWithRotation();
        }
        console.log('left');
    }
    rotateRight() {
        if (this.xSpeed !== 0 || this.ySpeed !== 0) {
            this.rotation += 20;
            this.updateSpeedWithRotation();
        }
        console.log('right');
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
        this.xSpeed += deltaX;
        this.ySpeed -= deltaY;
        console.log('accelerate');
    }
    brake() {
        this.xSpeed *= 0.6;
        this.ySpeed *= 0.6;
        console.log('break');
    }
    update(elapsed) {
        this.posX += this.xSpeed;
        this.posY += this.ySpeed;
    }
}
//# sourceMappingURL=GeneticCar.js.map