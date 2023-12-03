import CanvasUtil from '../Kudzukrusher/CanvasUtil.js';
export default class Drawable {
    image;
    posX;
    posY;
    constructor() {
        this.image = CanvasUtil.loadNewImage('./assets/hoe_wood.png');
        this.posX = 750;
        this.posY = 400;
    }
    getPosX() {
        return this.posX;
    }
    getPosY() {
        return this.posY;
    }
    getWidth() {
        return this.image.width;
    }
    getHeight() {
        return this.image.height;
    }
    render(canvas) {
        CanvasUtil.drawImage(canvas, this.image, this.getPosX(), this.getPosY());
    }
}
//# sourceMappingURL=Drawable.js.map