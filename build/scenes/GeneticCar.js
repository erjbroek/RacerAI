import Car from './Car.js';
export default class GeneticCar extends Car {
    constructor(midPoint, startAngle) {
        super();
        this.width = window.innerHeight / 40;
        this.height = window.innerHeight / 25;
        [this.posX, this.posY] = [midPoint[0], midPoint[1]];
        this.rotation = startAngle;
        this.xSpeed = 0;
        this.ySpeed = 0;
    }
    rotateLeft() {
        if (this.xSpeed !== 0 || this.ySpeed !== 0) {
            this.rotation -= 1;
        }
    }
    rotateRight() {
        if (this.xSpeed !== 0 || this.ySpeed !== 0) {
            this.rotation += 1;
        }
    }
    accelerate() {
        const deltaRotation = (this.rotation * Math.PI) / 180;
        const deltaX = Math.sin(deltaRotation);
        const deltaY = Math.cos(deltaRotation);
        this.xSpeed += deltaX;
        this.ySpeed -= deltaY;
    }
    brake() {
        this.xSpeed *= 0.9;
        this.ySpeed *= 0.9;
    }
    update(elapsed) {
        this.posX += this.xSpeed;
        this.posY += this.ySpeed;
    }
    render(canvas) {
    }
}
//# sourceMappingURL=GeneticCar.js.map