import CanvasUtil from '../utilities/CanvasUtil.js';
export default class Drawable {
    image;
    posX;
    posY;
    angle;
    constructor() {
        this.posX = 0;
        this.posY = 0;
        this.angle = 0;
    }
    render(canvas) {
        CanvasUtil.drawImage(canvas, this.image, this.posX, this.posY, this.image.width, this.image.height, this.angle);
    }
}
//# sourceMappingURL=Drawable.js.map