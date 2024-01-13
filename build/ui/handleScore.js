import CanvasUtil from "../utilities/CanvasUtil.js";
export default class HandleScore {
    height = 0;
    distance = 0;
    maxHeight = 0;
    maxSpeed = 0;
    coins = 0;
    enemiesHit = 0;
    score = 0;
    calculateDistances(xSpeed, ySpeed, height) {
        this.distance += xSpeed / 100;
        this.height = height / 100;
        if (this.height >= this.maxHeight) {
            this.maxHeight = this.height;
        }
    }
    calculateScore() {
        this.score = (this.distance / 2) * ((this.maxHeight / 10) + 1);
    }
    render(canvas) {
        CanvasUtil.writeTextToCanvas(canvas, `distance: ${(Math.round(this.distance * 10) / 10).toString()}m`, 100, 100, 'left', 'arial', 20, 'black');
        CanvasUtil.writeTextToCanvas(canvas, `height: ${(Math.round(this.height * 10) / 10).toString()}m`, 100, 150, 'left', 'arial', 20, 'black');
        CanvasUtil.writeTextToCanvas(canvas, `maxheight: ${(Math.round(this.maxHeight * 10) / 10).toString()}m`, 100, 200, 'left', 'arial', 20, 'black');
    }
}
//# sourceMappingURL=handleScore.js.map