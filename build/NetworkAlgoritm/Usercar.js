import Car from '../Car.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
export default class Usercar extends Car {
    checkAlive = 500;
    collided = false;
    finished = false;
    laps = 0;
    crossingFinishLine = false;
    startingPoint = [0, 0];
    locationHistory = [];
    constructor(startPoint, startAngle) {
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
    }
    update(elapsed) {
        this.prevPosX = this.posX;
        this.prevPosY = this.posY;
        this.xSpeed *= 0.98;
        this.ySpeed *= 0.98;
    }
    render(canvas) {
        CanvasUtil.drawCar(canvas, this.posX, this.posY, this.width, this.height, this.rotation, 255, 0, 0, 1, true);
    }
    rotateLeft() {
        if (Math.abs(this.xSpeed) + Math.abs(this.ySpeed) >= 0.2) {
            this.rotation -= 5;
            this.updateSpeedWithRotation();
        }
    }
    rotateRight() {
        if (Math.abs(this.xSpeed) + Math.abs(this.ySpeed) >= 0.2) {
            this.rotation += 5;
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
}
//# sourceMappingURL=Usercar.js.map