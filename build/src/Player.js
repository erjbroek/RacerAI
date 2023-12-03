import Drawable from './Drawable.js';
export default class Player extends Drawable {
    xSpeed;
    ySpeed;
    constructor() {
        super();
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.posX = 0;
        this.posY = window.innerHeight;
        this.image = null;
    }
}
//# sourceMappingURL=Player.js.map