import CanvasUtil from '../utilities/CanvasUtil.js';
import Car from '../Car.js';
export default class DisplayCar extends Car {
    genome;
    constructor(genome) {
        super();
        this.width = window.innerHeight / 40;
        this.height = window.innerHeight / 25;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.genome = genome;
    }
    update(elapsed) {
    }
    render(canvas) {
        CanvasUtil.createNetCar(canvas, this);
    }
}
//# sourceMappingURL=DisplayCar.js.map