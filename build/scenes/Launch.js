import Player from '../drawables/Player.js';
import Scene from './Scene.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import HandleBackground from '../ui/HandleBackground.js';
import Finished from './Finished.js';
import HandleScore from '../ui/handleScore.js';
export default class Launch extends Scene {
    launchAngle;
    handleBackground = new HandleBackground();
    handleScore = new HandleScore();
    player = new Player();
    xSpeed;
    ySpeed;
    finishFlight = false;
    endScreen = new Finished();
    gravity = 0.05;
    constructor(maxX, maxY, launchAngle, launchPower) {
        super(maxX, maxY);
        this.launchAngle = launchAngle;
        this.xSpeed = (launchPower / 10) * Math.cos((launchAngle * Math.PI) / 180);
        this.ySpeed = (launchPower / 10) * Math.sin((launchAngle * Math.PI) / 180);
    }
    processInput(keyListener, mouseListener) {
    }
    update(elapsed) {
        this.applyGravity();
        this.handleBackground.moveBackground(this.player, this.xSpeed, this.ySpeed);
        this.handleScore.calculateDistances(this.xSpeed, this.ySpeed, (window.innerHeight - this.player.posY - this.player.image.height)
            - (window.innerHeight - (this.handleBackground.getPosY() + this.handleBackground.getHeight())));
        this.player.angle = this.launchAngle;
        if (this.xSpeed <= 0.01) {
            this.finishFlight = true;
        }
        return this;
    }
    applyGravity() {
        if (this.handleBackground.getTouchingGround()) {
            this.player.posY = window.innerHeight - this.player.image.height;
            this.ySpeed *= -0.5;
            this.xSpeed *= 0.6;
            this.handleBackground.touchGround();
        }
        else {
            this.ySpeed += this.gravity;
        }
    }
    render(canvas) {
        CanvasUtil.fillCanvas(canvas, 'Black');
        this.handleBackground.render(canvas);
        this.handleScore.render(canvas);
        this.player.render(canvas);
        if (this.finishFlight) {
            this.endScreen.render(canvas);
        }
    }
}
//# sourceMappingURL=Launch.js.map