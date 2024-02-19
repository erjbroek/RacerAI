import Player from '../drawables/Player.js';
import Scene from './Scene.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import HandleScenery from '../ui/HandleScenery.js';
import Finished from './Finished.js';
import HandleScore from '../ui/handleScore.js';
import Choose from './Choose.js';
import HandleItems from '../ui/HandleItems.js';
import Background from '../background items/Background.js';
export default class Launch extends Scene {
    launchAngle;
    handleScenery = new HandleScenery();
    handleItems = new HandleItems();
    player = new Player();
    xSpeed;
    ySpeed;
    finishFlight = false;
    endScreen = new Finished();
    endGame = false;
    gravity = 0.19;
    constructor(launchAngle, launchPower) {
        super();
        this.launchAngle = launchAngle;
        this.player.angle = this.launchAngle;
        this.xSpeed = (launchPower / 10) * Math.cos((launchAngle * Math.PI) / 180);
        this.ySpeed = (launchPower / 10) * Math.sin((launchAngle * Math.PI) / 180);
        HandleScenery.backgrounds.push(new Background(0, window.innerHeight - 302 * 4, 1));
        HandleScore.resetRound();
    }
    processInput(keyListener, mouseListener) {
        if (!HandleScenery.touchingGround && !(Math.abs(this.xSpeed) <= 8 && this.player.touchedGround)) {
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
        if (this.finishFlight) {
            this.endGame = this.endScreen.processInput(keyListener, mouseListener);
        }
    }
    update(elapsed) {
        this.applyGravity();
        HandleScenery.addScenery();
        HandleScenery.removeUnusedScenery();
        HandleScenery.moveScenery(this.player, this.xSpeed, this.ySpeed);
        HandleItems.addItems();
        HandleItems.removeUnusedItems();
        HandleItems.collision(this.player);
        HandleItems.moveItems(this.player, this.xSpeed, this.ySpeed);
        HandleScore.calculateDistances(this.xSpeed, (window.innerHeight - this.player.posY - this.player.image.height)
            - (window.innerHeight
                - (HandleScenery.backgrounds[0].posY
                    + HandleScenery.backgrounds[0].image.height)));
        if (Math.abs(this.xSpeed) + Math.abs(this.ySpeed) <= 0.1) {
            this.finishFlight = true;
        }
        if (this.endGame) {
            HandleScore.duckDollars += HandleScore.totalCoins;
            return new Choose();
        }
        return this;
    }
    applyGravity() {
        if (HandleScenery.touchingGround) {
            this.player.posY = window.innerHeight - this.player.image.height;
            this.ySpeed *= -0.5;
            this.xSpeed *= 0.6;
            this.player.rotationSpeed = this.xSpeed;
            this.player.touchedGround = true;
        }
        else {
            this.ySpeed += this.gravity;
            if (this.xSpeed >= 0.03) {
                this.xSpeed -= 0.03;
            }
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
        HandleScenery.render(canvas, this.player);
        this.player.renderPower(canvas);
        CanvasUtil.writeTextToCanvas(canvas, `coins: ${HandleScore.totalCoins}`, window.innerWidth / 50, window.innerHeight / 30, 'left', 'arial', 20, 'black');
        if (this.finishFlight) {
            this.endScreen.endRound(canvas);
        }
    }
}
//# sourceMappingURL=Launch.js.map