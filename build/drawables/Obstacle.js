import Drawable from './Drawable.js';
export default class Obstacle extends Drawable {
    movementModifierX;
    movementModifierY;
    scoreMultipler;
    constructor() {
        super();
        this.posX = 500;
        this.posY = 500;
    }
}
//# sourceMappingURL=Obstacle.js.map