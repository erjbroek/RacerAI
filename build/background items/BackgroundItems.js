import CanvasUtil from '../utilities/CanvasUtil.js';
export default class BackgroundItems {
    image;
    posX;
    posY;
    angle;
    constructor(posX, posY) {
        this.angle = 0;
    }
    move(xSpeed, ySpeed) {
        this.posX -= xSpeed;
        this.posY -= ySpeed;
    }
    rotate(rotationSpeed) {
        this.angle += rotationSpeed;
    }
    getPosX() {
        return this.posX;
    }
    getPosY() {
        return this.posY;
    }
    setPosY(posY) {
        this.posY = posY;
    }
    getWidth() {
        return this.image.width;
    }
    getHeight() {
        return this.image.height;
    }
    render(canvas) {
        CanvasUtil.drawImage(canvas, this.image, this.posX, this.posY, this.image.width, this.image.height, this.angle);
    }
}
//# sourceMappingURL=BackgroundItems.js.map