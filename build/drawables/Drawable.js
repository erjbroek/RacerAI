import CanvasUtil from '../utilities/CanvasUtil.js';
export default class Drawable {
    image;
    posX;
    posY;
    angle;
    constructor() {
        this.image = CanvasUtil.loadNewImage('./assets/hoe_wood.png');
        this.posX = 0;
        this.posY = 0;
    }
    render(canvas) {
        CanvasUtil.drawImage(canvas, this.image, this.posX, this.posY, this.image.width, this.image.height, this.angle);
    }
}
//# sourceMappingURL=Drawable.js.map