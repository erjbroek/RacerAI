import Drawable from './Drawable.js';
export default class Obstacle extends Drawable {
    speedModifierX;
    speedModifierY;
    scoreMultipler;
    move(xSpeed, ySpeed) {
        this.posX -= xSpeed;
        this.posY -= ySpeed;
    }
    collides(player) {
        player.xSpeed -= this.speedModifierX;
        player.ySpeed -= this.speedModifierY;
    }
    bounce(player) {
        player.ySpeed *= -1;
        player.ySpeed -= this.speedModifierY;
    }
}
//# sourceMappingURL=Obstacle.js.map