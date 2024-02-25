import CanvasUtil from '../utilities/CanvasUtil.js';
import Drawable from './Drawable.js';
export default class Player extends Drawable {
    rotationSpeed = 0;
    touchedGround = false;
    totalEnergy;
    energy;
    constructor() {
        super();
        this.image = CanvasUtil.loadNewImage('./assets/player.png');
        this.totalEnergy = 150;
        this.energy = 150;
        this.image.width = window.innerWidth / 15;
        this.image.height = window.innerWidth / 15;
        this.posX = window.innerWidth / 10 - this.image.width / 2;
        this.posY = window.innerHeight / 1.1 - this.image.height / 2.05;
    }
    move(ySpeed) {
        this.posY += ySpeed;
    }
    rotate() {
        this.angle += this.rotationSpeed;
    }
    setAngle(xSpeed, ySpeed) {
        let angle = Math.atan2(xSpeed, ySpeed) * (180 / Math.PI);
        angle *= -1;
        angle += 90;
        this.angle = angle;
    }
    renderPower(canvas) {
        if (this.energy > 0) {
            CanvasUtil.drawRectangle(canvas, this.posX, this.posY - canvas.width / 50, this.image.width + 2 * (this.posX - canvas.width / 15), canvas.height / 100, 'red');
            CanvasUtil.fillRectangle(canvas, this.posX, this.posY - canvas.width / 50, (this.image.width + 2 * (this.posX - canvas.width / 15)) * (this.energy / this.totalEnergy), canvas.height / 100, 'red');
        }
    }
}
//# sourceMappingURL=Player.js.map