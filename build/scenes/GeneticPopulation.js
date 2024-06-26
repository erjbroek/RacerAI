import CanvasUtil from '../utilities/CanvasUtil.js';
import GeneticCar from '../GeneticAlgorithm/GeneticCar.js';
export default class GeneticPopulation {
    cars = [];
    generation = 1;
    size;
    highScore = 0;
    moveNumber = 0;
    amountMoves = 5;
    extinct = false;
    moveDuration = 400;
    track;
    constructor(size, startingLine, startingAngle, track) {
        this.size = size;
        this.track = track;
        for (let i = 0; i < 1; i++) {
            this.cars.push(new GeneticCar(startingLine, startingAngle, 5));
        }
    }
    update(elapsed) {
        if (!this.extinct) {
            this.moveDuration -= elapsed;
            if (this.moveDuration <= 0) {
                this.cars.forEach((car) => {
                    car.processMoves(this.moveNumber);
                });
                this.moveNumber += 1;
                this.moveDuration = 400;
            }
            this.cars.forEach((car) => {
                if (car.alive) {
                    car.update(elapsed);
                    car.alive = this.track.checkCollisionWithTrack(car);
                }
            });
        }
        else {
            console.log('rip');
        }
    }
    render(canvas) {
        this.cars.forEach((car) => {
            CanvasUtil.drawCar(canvas, car.posX, car.posY, car.width, car.height, car.rotation);
        });
    }
}
//# sourceMappingURL=GeneticPopulation.js.map