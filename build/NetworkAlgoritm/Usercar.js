import KeyListener from '../utilities/KeyListener.js';
import Car from '../Car.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import DrawTrack from '../scenes/DrawTrack.js';
export default class Usercar extends Car {
    checkAlive = 500;
    collided = false;
    finished = false;
    laps = 0;
    crossingFinishLine = false;
    startingPoint = [0, 0];
    leftStartLine = false;
    locationHistory = [];
    carImage = CanvasUtil.loadNewImage('./assets/racecar.png');
    constructor(startPoint, startAngle) {
        super();
        this.onFinishLine = false;
        this.width = window.innerHeight / 40 * 3;
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
    update(elapsed, track) {
        this.prevPosX = this.posX;
        this.prevPosY = this.posY;
        this.xSpeed *= 0.98;
        this.ySpeed *= 0.98;
        const distanceFromStart = Math.sqrt((this.posX - this.startingPoint[0]) ** 2 + (this.posY - this.startingPoint[1]) ** 2);
        if (distanceFromStart > (120 + (track.radius * 0.15 * Number(DrawTrack.racing)))) {
            this.leftStartLine = true;
        }
        if (KeyListener.isKeyDown('KeyW') || KeyListener.isKeyDown('ArrowUp')) {
            this.accelerate();
        }
        else if (KeyListener.isKeyDown('KeyS') || KeyListener.isKeyDown('ArrowDown')) {
            this.brake();
        }
        if (KeyListener.isKeyDown('KeyA') || KeyListener.isKeyDown('ArrowLeft')) {
            this.rotateLeft();
        }
        else if (KeyListener.isKeyDown('KeyD') || KeyListener.isKeyDown('ArrowRight')) {
            this.rotateRight();
        }
        if (track.checkCollisionWithTrack(this)) {
            this.posX += (this.xSpeed / 7.5) * elapsed;
            this.posY += (this.ySpeed / 7.5) * elapsed;
        }
        else {
            this.posX += (this.xSpeed / 20) * elapsed;
            this.posY += (this.ySpeed / 20) * elapsed;
        }
    }
    render(canvas) {
        CanvasUtil.drawImage(canvas, this.carImage, this.posX - this.width / 2, this.posY - this.height / 2, this.width, this.height, this.rotation - 90, 1);
    }
    rotateLeft() {
        if (Math.abs(this.xSpeed) + Math.abs(this.ySpeed) >= 0.2) {
            this.rotation -= 3.5;
            this.updateSpeedWithRotation();
        }
    }
    rotateRight() {
        if (Math.abs(this.xSpeed) + Math.abs(this.ySpeed) >= 0.2) {
            this.rotation += 3.5;
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