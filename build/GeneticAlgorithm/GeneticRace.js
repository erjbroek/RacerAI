import Scene from '../scenes/Scene.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import KeyListener from '../utilities/KeyListener.js';
import GeneticCar from './GeneticCar.js';
import Player from './Player.js';
export default class GeneticRace extends Scene {
    track;
    champion;
    player;
    moveDuration = 200;
    moveNumber = 0;
    startingPoint;
    startingAngle;
    constructor(track, champion, startingPoint, startingAngle) {
        super();
        this.track = track;
        this.champion = champion;
        this.startingPoint = startingPoint;
        this.startingAngle = startingAngle;
        this.player = new Player(startingPoint, startingAngle);
        this.champion = new GeneticCar(startingPoint, startingAngle, this.champion.moves, 999);
    }
    processInput() {
        if (this.player.alive) {
            if (KeyListener.isKeyDown('KeyW')) {
                this.player.accelerate();
            }
            else if (KeyListener.isKeyDown('KeyS')) {
                this.player.brake();
            }
            if (KeyListener.isKeyDown('KeyD')) {
                this.player.rotateRight();
            }
            else if (KeyListener.isKeyDown('KeyA')) {
                this.player.rotateLeft();
            }
        }
    }
    update(elapsed) {
        this.moveDuration -= elapsed;
        this.champion.alive = this.track.checkCollisionWithTrack(this.champion);
        this.player.alive = this.track.checkCollisionWithTrack(this.player);
        if (this.champion.alive) {
            if (this.moveDuration <= 0) {
                this.moveNumber += 1;
                this.moveDuration = 200;
            }
            this.champion.processMoves(this.moveNumber, elapsed);
            this.champion.update(elapsed);
        }
        if (this.player.alive) {
            this.player.update(elapsed);
        }
        if (!this.player.alive && !this.champion.alive) {
            this.moveNumber = 0;
            this.champion = new GeneticCar(this.startingPoint, this.startingAngle, this.champion.moves, null);
            this.player = new Player(this.startingPoint, this.startingAngle);
        }
        return this;
    }
    render(canvas) {
        this.track.render(canvas);
        CanvasUtil.drawCar(canvas, this.champion.posX, this.champion.posY, this.champion.width, this.champion.height, this.champion.rotation, 255, 0, 0, 1, false);
        CanvasUtil.drawCar(canvas, this.player.posX, this.player.posY, this.player.width, this.player.height, this.player.rotation, 0, 0, 255, 1, true);
        CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width / 30, canvas.height, 50, 120, 200);
        CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width, canvas.height / 20, 50, 120, 200);
        CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6, 0, canvas.width / 6, canvas.height, 50, 120, 200);
        CanvasUtil.fillRectangle(canvas, 0, canvas.height - canvas.height / 20, canvas.width, canvas.height / 20, 50, 120, 200);
        CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6.5, canvas.height / 20, canvas.width / 5 - canvas.width / 18, canvas.height / 1.111, 255, 255, 255, 0.2);
    }
}
//# sourceMappingURL=GeneticRace.js.map