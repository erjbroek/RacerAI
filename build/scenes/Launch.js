import Player from '../drawables/Player.js';
import Scene from './Scene.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import HandleItems from '../ui/HandleItems.js';
import Finished from './Finished.js';
import HandleScore from '../ui/handleScore.js';
export default class Launch extends Scene {
    launchAngle;
    handleBackground = new HandleItems();
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
        this.xSpeed = (launchPower / 10) * Math.cos((launchAngle * Math.PI) / 180);
        this.ySpeed = (launchPower / 10) * Math.sin((launchAngle * Math.PI) / 180);
    }
    processInput(keyListener, mouseListener) {
        if (!this.handleBackground.touchingGround && !(Math.abs(this.xSpeed) <= 8 && this.player.touchedGround)) {
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
        this.handleBackground.addItems();
        this.handleBackground.removeUnusedItems();
        this.handleBackground.collision(this.player, elapsed);
        this.handleBackground.moveItems(this.player, this.xSpeed, this.ySpeed);
        HandleScore.calculateDistances(this.xSpeed, (window.innerHeight - this.player.posY - this.player.image.height)
            - (window.innerHeight
                - (this.handleBackground.backgrounds[0].posY
                    + this.handleBackground.backgrounds[0].image.height)));
        if (Math.abs(this.xSpeed) + Math.abs(this.ySpeed) <= 0.1) {
            this.finishFlight = true;
        }
        return this;
    }
    applyGravity() {
        if (this.handleBackground.touchingGround) {
            this.player.posY = window.innerHeight - this.player.image.height;
            this.ySpeed *= -0.5;
            this.xSpeed *= 0.6;
            this.player.rotationSpeed = this.xSpeed;
            this.player.touchedGround = true;
        }
        else {
            this.ySpeed += this.gravity;
            if (Math.abs(this.xSpeed) <= 8 && this.player.touchedGround) {
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
        this.player.render(canvas);
        this.player.renderPower(canvas);
        CanvasUtil.writeTextToCanvas(canvas, `coins: ${HandleScore.totalCoins}`, window.innerWidth / 50, window.innerHeight / 30, 'left', 'arial', 20, 'black');
        if (this.finishFlight) {
            this.endScreen.render(canvas);
        }
    }
}
//# sourceMappingURL=Launch.js.map