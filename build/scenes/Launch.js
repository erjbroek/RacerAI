import Player from '../drawables/Player.js';
import Scene from './Scene.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import HandleBackground from '../ui/handleBackground.js';
export default class Launch extends Scene {
    launchAngle;
    handleBackground;
    player;
    xSpeed;
    ySpeed;
    gravity;
    constructor(maxX, maxY, launchAngle, launchPower) {
        super(maxX, maxY);
        this.player = new Player();
        this.handleBackground = new HandleBackground();
        this.launchAngle = launchAngle;
        this.gravity = 0.05;
        this.xSpeed = (launchPower / 10) * Math.cos((launchAngle * Math.PI) / 180);
        this.ySpeed = (launchPower / 10) * Math.sin((launchAngle * Math.PI) / 180);
    }
    processInput(keyListener, mouseListener) {
    }
    update(elapsed) {
        this.applyGravity();
        this.handleBackground.moveBackground(this.player, this.xSpeed, this.ySpeed);
        this.player.angle = this.launchAngle;
        return null;
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
    }
}
//# sourceMappingURL=Launch.js.map