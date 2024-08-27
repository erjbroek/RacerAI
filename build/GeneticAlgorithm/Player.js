import Car from '../Car.js';
export default class Player extends Car {
    fitness = 0;
    collided = false;
    finished = false;
    constructor(midPoint, startAngle) {
        super();
        this.width = window.innerHeight / 40;
        this.height = window.innerHeight / 25;
        this.alive = true;
        [this.posX, this.posY] = [midPoint[0], midPoint[1]];
        this.rotation = startAngle;
        this.xSpeed = 0;
        this.ySpeed = 0;
    }
    rotateLeft() {
        if (this.xSpeed !== 0 || this.ySpeed !== 0) {
            this.rotation -= 2.1;
            this.updateSpeedWithRotation();
        }
    }
    rotateRight() {
        if (this.xSpeed !== 0 || this.ySpeed !== 0) {
            this.rotation += 2.1;
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
    update(elapsed) {
        this.xSpeed *= 0.99;
        this.ySpeed *= 0.99;
        this.posX += this.xSpeed;
        this.posY += this.ySpeed;
    }
}
//# sourceMappingURL=Player.js.map