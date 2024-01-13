import CanvasUtil from '../utilities/CanvasUtil.js';
import Drawable from './Drawable.js';
export default class Player extends Drawable {
    rotationSpeed = 0;
    touchedGround = false;
    constructor() {
        super();
        this.image = CanvasUtil.loadNewImage('./assets/player.png');
        this.image.width = window.innerWidth / 15;
        this.image.height = window.innerWidth / 15;
        this.posX = window.innerWidth / 10 - this.image.width / 2;
        this.posY = window.innerHeight / 1.1 - this.image.height / 2;
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
}
//# sourceMappingURL=Player.js.map