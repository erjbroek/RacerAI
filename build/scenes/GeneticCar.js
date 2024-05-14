import Car from './Car.js';
export default class GeneticCar extends Car {
    constructor(midPoint) {
        super();
        this.width = window.innerHeight / 40;
        this.height = window.innerHeight / 25;
        [this.posX, this.posY] = [midPoint[0], midPoint[1]];
    }
    update(elapsed) {
    }
    render(canvas) {
    }
}
//# sourceMappingURL=GeneticCar.js.map