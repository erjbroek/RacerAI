import Player from '../drawables/Player.js';
import Scene from './Scene.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import HandleBackground from '../ui/handleBackground.js';
import Finished from './Finished.js';
export default class Launch extends Scene {
    launchAngle;
    handleBackground;
    player;
    xSpeed;
    ySpeed;
    distance = 0;
    maxHeight = 0;
    finishFlight = false;
    endScreen = new Finished(window.innerWidth, window.innerHeight);
    gravity = 0.05;
    constructor(maxX, maxY, launchAngle, launchPower) {
        super(maxX, maxY);
        this.player = new Player();
        this.handleBackground = new HandleBackground();
        this.launchAngle = launchAngle;
        this.xSpeed = (launchPower / 10) * Math.cos((launchAngle * Math.PI) / 180);
        this.ySpeed = (launchPower / 10) * Math.sin((launchAngle * Math.PI) / 180);
    }
    processInput(keyListener, mouseListener) {
    }
    update(elapsed) {
        this.applyGravity();
        this.distance += (this.xSpeed / 100);
        this.handleBackground.moveBackground(this.player, this.xSpeed, this.ySpeed);
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
        this.player.render(canvas);
        CanvasUtil.writeTextToCanvas(canvas, `distance: ${Math.round(this.distance * 10) / 10}m`, 100, 100, 'center', 'arial', 20, 'black');
        if (this.finishFlight) {
            this.endScreen.render(canvas);
        }
    }
}
//# sourceMappingURL=Launch.js.map