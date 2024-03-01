import CanvasUtil from '../utilities/CanvasUtil.js';
import Drawable from './Drawable.js';
export default class Player extends Drawable {
    rotationSpeed = 0;
    touchedGround = false;
    totalEnergy;
    energy;
    boost;
    totalBoost;
    boostPower;
    boostEfficiency;
    constructor() {
        super();
        this.image = CanvasUtil.loadNewImage('./assets/player.png');
        this.totalEnergy = 200;
        this.energy = 200;
        this.totalBoost = 150;
        this.boost = this.totalBoost;
        this.boostPower = 0.1;
        this.image.width = window.innerWidth / 15;
        this.image.height = window.innerWidth / 15;
        this.posX = window.innerWidth / 10 - this.image.width / 2;
        this.posY = window.innerHeight / 1.1 - this.image.height / 3;
    }
    move(ySpeed) {
        this.posY += ySpeed;
    }
    rotate() {
        this.angle += this.rotationSpeed;
    }
    activateBoost(xSpeed, ySpeed) {
        if (this.boost > 0) {
            const addedX = this.boostPower;
            const addedY = this.boostPower;
            this.boost -= 1 / (this.totalBoost / 100);
            return [xSpeed + addedX, ySpeed + addedY];
        }
        return [xSpeed, ySpeed];
    }
    setAngle(xSpeed, ySpeed) {
        let angle = Math.atan2(xSpeed, ySpeed) * (180 / Math.PI);
        angle *= -1;
        angle += 90;
        this.angle = angle;
    }
    renderPower(canvas) {
        if (this.energy > 0) {
            CanvasUtil.drawRectangle(canvas, this.posX, this.posY - canvas.width / 50, this.image.width + 2 * (this.posX - canvas.width / 15), canvas.height / 100, 'green');
            CanvasUtil.fillRectangle(canvas, this.posX, this.posY - canvas.width / 50, (this.image.width + 2 * (this.posX - canvas.width / 15)) * (this.energy / this.totalEnergy), canvas.height / 100, 'green');
        }
        if (this.boost > 0) {
            CanvasUtil.drawRectangle(canvas, this.posX, this.posY - canvas.width / 30, this.image.width + 2 * (this.posX - canvas.width / 15), canvas.height / 100, 'red');
            CanvasUtil.fillRectangle(canvas, this.posX, this.posY - canvas.width / 30, (this.image.width + 2 * (this.posX - canvas.width / 15)) * (this.boost / this.totalBoost), canvas.height / 100, 'red');
        }
    }
}
//# sourceMappingURL=Player.js.map