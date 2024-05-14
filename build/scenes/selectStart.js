import CanvasUtil from "../utilities/CanvasUtil.js";
import MouseListener from "../utilities/MouseListener.js";
import GeneticAlgorithm from './GeneticAlgorithm.js';
import Scene from "./Scene.js";
export default class SelectStart extends Scene {
    track;
    radius;
    flag = CanvasUtil.loadNewImage("./assets/flag.png");
    flagPos = [];
    draw = false;
    startScene = false;
    point1 = [];
    point2 = [];
    timeThreshold = 500;
    warning = false;
    midPoint = [];
    finished = false;
    showWarning = false;
    lineStart = [];
    lineEnd = [];
    constructor(track, radius) {
        super();
        this.track = track;
        this.radius = radius;
        this.track.forEach((track1) => {
            track1[2] = 0;
            const found = [];
            this.track.forEach((track2) => {
                if (Math.sqrt((track1[0] - track2[0]) ** 2 + (track1[1] - track2[1]) ** 2) <= this.radius * 1.5 && track1 !== track2) {
                    found.push(this.track.indexOf(track2));
                }
            });
            if (found.length <= 4) {
                track1[2] = 1;
                if (this.track.indexOf(track1) <= this.track.length - 2) {
                    this.track[this.track.indexOf(track1) + 1][2] = 1;
                }
            }
        });
    }
    processInput(keyListener) {
        if (this.startScene) {
            if (MouseListener.areaDown(0, window.innerWidth / 1.155, window.innerHeight / 1.2, window.innerWidth / 10, window.innerHeight / 12)) {
                console.log("finish");
                this.finished = true;
            }
            else {
                const found = [];
                if (MouseListener.isButtonDown(0)) {
                    const totalFound = [];
                    this.track.forEach((trackPiece) => {
                        if (Math.sqrt((MouseListener.mouseCoordinates.x - trackPiece[0]) ** 2 + (MouseListener.mouseCoordinates.y - trackPiece[1]) ** 2) <= this.radius) {
                            this.flagPos = [MouseListener.mouseCoordinates.x, MouseListener.mouseCoordinates.y];
                            if (trackPiece[2]) {
                                found.push(trackPiece);
                            }
                            totalFound.push(trackPiece);
                            this.draw = true;
                        }
                    });
                    if (found.length === 1) {
                        this.track.forEach((trackPiece) => {
                            if (Math.sqrt((found[0][0] - trackPiece[0]) ** 2 + (found[0][1] - trackPiece[1]) ** 2) <= this.radius * 2 && found[0] !== trackPiece) {
                                found.push(trackPiece);
                                this.draw = true;
                            }
                        });
                    }
                    for (let i = 0; i < found.length - 1; i++) {
                        const found1Index = this.track.indexOf(found[i]);
                        const found2Index = this.track.indexOf(found[i + 1]);
                        if (Math.abs(found2Index - found1Index) >= 3) {
                            found.splice(i + 1, 1);
                            i--;
                        }
                    }
                    if (found.length > 1) {
                        this.warning = false;
                        [this.point1, this.point2] = [found[0], found[1]];
                        const dx = this.point2[0] - this.point1[0];
                        const dy = this.point2[1] - this.point1[1];
                        let rotatedVector = [-dy * 1.5, dx * 1.5];
                        const length = Math.sqrt(rotatedVector[0] ** 2 + rotatedVector[1] ** 2);
                        rotatedVector = [rotatedVector[0] / length, rotatedVector[1] / length];
                        rotatedVector = [rotatedVector[0] * this.radius, rotatedVector[1] * this.radius];
                        this.midPoint = [(this.point1[0] + this.point2[0]) / 2, (this.point1[1] + this.point2[1]) / 2];
                        this.lineEnd = [this.midPoint[0] + rotatedVector[0], this.midPoint[1] + rotatedVector[1]];
                        this.lineStart = [this.midPoint[0] - rotatedVector[0], this.midPoint[1] - rotatedVector[1]];
                    }
                    else {
                        this.lineStart = [];
                        this.lineEnd = [];
                        this.midPoint = [];
                        this.warning = true;
                    }
                }
                if (this.lineStart.length === 0) {
                    console.log("invalid");
                }
            }
        }
    }
    update(elapsed) {
        this.timeThreshold -= elapsed;
        if (this.timeThreshold <= 0) {
            this.startScene = true;
        }
        if (this.point1.length > 0) {
            this.draw = true;
        }
        const found = [];
        this.track.forEach((trackPiece) => {
            if (Math.sqrt((MouseListener.mouseCoordinates.x - trackPiece[0]) ** 2 + (MouseListener.mouseCoordinates.y - trackPiece[1]) ** 2) <= this.radius) {
                if (MouseListener.buttonPressed(0)) {
                    found.push(trackPiece);
                }
            }
        });
        if (this.finished) {
            return new GeneticAlgorithm(this.track, this.radius, this.lineStart, this.lineEnd);
        }
        return this;
    }
    render(canvas) {
        canvas.style.cursor = "none";
        this.track.forEach((trackPiece) => {
            CanvasUtil.fillCircle(canvas, trackPiece[0], trackPiece[1], this.radius, 20 / (trackPiece[2] + 0.1), 120 * trackPiece[2], 0, 1);
        });
        CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width / 30, canvas.height, 50, 120, 200);
        CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width, canvas.height / 20, 50, 120, 200);
        CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6, 0, canvas.width / 6, canvas.height, 50, 120, 200);
        CanvasUtil.fillRectangle(canvas, 0, canvas.height - canvas.height / 20, canvas.width, canvas.height / 20, 50, 120, 200);
        CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6.5, canvas.height / 20, canvas.width / 5 - canvas.width / 18, canvas.height / 1.111, 255, 255, 255, 0.2);
        CanvasUtil.fillCircle(canvas, canvas.width / 2.4, canvas.height / 2, 5, 255, 0, 0, 0.4);
        CanvasUtil.fillRectangle(canvas, canvas.width / 1.155, canvas.height / 12, canvas.width / 10, canvas.height / 20, 200, 50, 50, 1, 5);
        CanvasUtil.writeText(canvas, "Delete track", canvas.width / 1.135, canvas.height / 8.5, "left", "arial", 25, "white");
        CanvasUtil.drawLine(canvas, this.lineStart[0], this.lineStart[1], this.lineEnd[0], this.lineEnd[1], 0, 255, 0, 1, 3);
        CanvasUtil.drawImage(canvas, this.flag, MouseListener.mouseCoordinates.x - this.flag.width / 20, MouseListener.mouseCoordinates.y - this.flag.height / 20, this.flag.width / 10, this.flag.height / 10, 0, 0.6);
        if (this.draw) {
            CanvasUtil.drawImage(canvas, this.flag, this.midPoint[0] - this.flag.width / 20, this.midPoint[1] - this.flag.height / 20, this.flag.width / 10, this.flag.height / 10, 0);
        }
        else {
            CanvasUtil.fillRectangle(canvas, canvas.width / 30, canvas.height / 20, canvas.width - canvas.width / 6.5 - canvas.width / 21.7, canvas.height / 1.11, 0, 0, 0, 0.2);
            CanvasUtil.writeText(canvas, "Select a valid starting line", canvas.width / 2.4, canvas.height / 2, "center", "arial", 60, "White");
            CanvasUtil.drawImage(canvas, this.flag, this.midPoint[0] - this.flag.width / 20, this.midPoint[1] - this.flag.height / 20, this.flag.width / 10, this.flag.height / 10, 0);
        }
        if (this.warning && this.startScene) {
            CanvasUtil.fillRectangle(canvas, canvas.width / 30, canvas.height / 20, canvas.width - canvas.width / 6.5 - canvas.width / 21.7, canvas.height / 1.11, 100, 0, 0, 0.2);
            CanvasUtil.writeText(canvas, "Not a valid position", canvas.width / 2.4, canvas.height / 2, "center", "arial", 60, "White");
        }
        if (this.lineStart.length > 0) {
            CanvasUtil.fillRectangle(canvas, canvas.width / 1.155, canvas.height / 1.2, canvas.width / 10, canvas.height / 12, 40, 200, 100, 1, 5);
            CanvasUtil.writeText(canvas, "Finish track", canvas.width / 1.09, canvas.height / 1.13, "center", "arial", 25, "white");
        }
        CanvasUtil.fillCircle(canvas, MouseListener.mouseCoordinates.x, MouseListener.mouseCoordinates.y, 5, 0, 255, 0);
    }
}
//# sourceMappingURL=selectStart.js.map