import Player from '../drawables/Player.js';
import Scene from './Scene.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import Handlebackground from '../ui/handleBackground.js';
import Finished from './Finished.js';
import HandleScore from '../ui/handleScore.js';
export default class Launch extends Scene {
    launchAngle;
    handleBackground = new Handlebackground();
    handleScore = new HandleScore();
    player = new Player();
    xSpeed;
    ySpeed;
    finishFlight = false;
    endScreen = new Finished();
    gravity = 0.19;
    constructor(maxX, maxY, launchAngle, launchPower) {
        super(maxX, maxY);
        this.launchAngle = launchAngle;
        this.player.angle = this.launchAngle;
        launchPower *= 2;
        this.xSpeed = (launchPower / 10) * Math.cos((launchAngle * Math.PI) / 180);
        this.ySpeed = (launchPower / 10) * Math.sin((launchAngle * Math.PI) / 180);
    }
    processInput(keyListener, mouseListener) {
        if ((Math.abs(this.xSpeed) >= 8
            || this.player.posY < window.innerHeight / 1.2)
            && !this.handleBackground.isTouchingGround()) {
            if (this.player.energy > 0) {
                if (keyListener.isKeyDown('KeyA')) {
                    this.ySpeed -= 0.24 * (this.xSpeed / 9);
                    this.xSpeed += this.ySpeed > 0 ? 0.13 : -0.21;
                    this.player.energy -= 1;
                }
                else if (keyListener.isKeyDown('KeyD')) {
                    this.ySpeed += 0.05 * (this.xSpeed / 9);
                    this.xSpeed -= this.ySpeed > 0 ? 0.13 : -0.07;
                    this.player.energy -= 1;
                }
            }
        }
    }
    update(elapsed) {
        this.applyGravity();
        this.handleBackground.moveBackground(this.player, this.xSpeed, this.ySpeed);
        this.handleScore.calculateDistances(this.xSpeed, this.ySpeed, (window.innerHeight - this.player.posY - this.player.image.height)
            - (window.innerHeight
                - (this.handleBackground.getPosY() + this.handleBackground.getHeight())));
        if (Math.abs(this.xSpeed) + Math.abs(this.ySpeed) <= 0.1) {
            this.finishFlight = true;
        }
        return this;
    }
    applyGravity() {
        if (this.handleBackground.isTouchingGround()) {
            this.player.posY = window.innerHeight - this.player.image.height;
            this.ySpeed *= -0.5;
            this.xSpeed *= 0.6;
            this.player.rotationSpeed = this.xSpeed;
            this.player.touchedGround = true;
        }
        else {
            this.ySpeed += this.gravity;
            if (this.xSpeed <= 8 && this.player.touchedGround) {
                this.player.rotate();
            }
            else {
                this.player.setAngle(this.xSpeed, this.ySpeed);
                this.player.touchedGround = false;
            }
        }
    }
    render(canvas) {
        CanvasUtil.fillCanvas(canvas, 'Black');
        this.handleBackground.render(canvas);
        this.handleScore.render(canvas);
        this.player.render(canvas);
        this.player.renderPower(canvas);
        if (this.finishFlight) {
            this.endScreen.render(canvas, this.handleScore);
        }
    }
}
//# sourceMappingURL=Launch.js.map