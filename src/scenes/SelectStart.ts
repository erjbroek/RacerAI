import CanvasUtil from '../utilities/CanvasUtil.js';
import KeyListener from '../utilities/KeyListener.js';
import MouseListener from '../utilities/MouseListener.js';
import GeneticAlgorithm from '../GeneticAlgorithm/GeneticAlgorithm.js';
import Scene from './Scene.js';
import Track from '../Track.js';
import NetAlgorithm from '../NetworkAlgoritm/NetAlgoritm.js';
import ChooseAlgoritm from './ChooseAlgoritm.js';
import DrawTrack from './DrawTrack.js';

export default class SelectStart extends Scene {
  private track: Track;

  private radius: number;

  private flag: HTMLImageElement = CanvasUtil.loadNewImage('./assets/flag.png');

  private flagPos: number[] = [];

  private draw: boolean = false;

  private startScene: boolean = false;

  private point1: number[] = [];

  private point2: number[] = [];

  private timeThreshold: number = 500;

  private warning: boolean = false;

  private finished: boolean = false;

  public constructor(track: number[][], radius: number) {
    super();
    this.radius = radius;
    console.log(this.radius)
    this.track = new Track(track, radius);
  }

  /**
   *
   * @param keyListener
   */
  public override processInput(keyListener: KeyListener): void {
    if (this.startScene) {
      if (MouseListener.areaPressed(0, window.innerWidth / 1.155, window.innerHeight / 1.2, window.innerWidth / 10, window.innerHeight / 12)) {
        this.finished = true;
      } else {
        const found: number[][] = [];
        if (MouseListener.isButtonDown(0)) {
          const totalFound: number[][] = [];
          this.track.road.forEach((trackPiece) => {
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
            this.track.road.forEach((trackPiece) => {
              if (Math.sqrt((found[0][0] - trackPiece[0]) ** 2 + (found[0][1] - trackPiece[1]) ** 2) <= this.radius * 2 && found[0] !== trackPiece) {
                found.push(trackPiece);
                this.draw = true;
              }
            });
          }
          for (let i = 0; i < found.length - 1; i++) {
            const found1Index = this.track.road.indexOf(found[i]);
            const found2Index = this.track.road.indexOf(found[i + 1]);
            if (Math.abs(found2Index - found1Index) >= 3) {
              found.splice(i + 1, 1);
              i -= 1;
            }
          }
          if (found.length > 1) {
            this.warning = false;
            [this.point1, this.point2] = [found[0], found[1]];

            const dx: number = this.point2[0] - this.point1[0];
            const dy: number = this.point2[1] - this.point1[1];

            let rotatedVector: number[] = [-dy * 1.5, dx * 1.5];
            const length = Math.sqrt(rotatedVector[0] ** 2 + rotatedVector[1] ** 2);

            rotatedVector = [rotatedVector[0] / length, rotatedVector[1] / length];
            rotatedVector = [rotatedVector[0] * this.radius, rotatedVector[1] * this.radius];

            this.track.midPoint = [(this.point1[0] + this.point2[0]) / 2, (this.point1[1] + this.point2[1]) / 2];

            this.track.lineEnd = [this.track.midPoint[0] + rotatedVector[0], this.track.midPoint[1] + rotatedVector[1]];
            this.track.lineStart = [this.track.midPoint[0] - rotatedVector[0], this.track.midPoint[1] - rotatedVector[1]];
          } else {
            this.track.lineStart = [];
            this.track.lineEnd = [];
            this.track.midPoint = [];
            this.warning = true;
          }
        }
      }
    }
  }

  /**
   *
   * @returns scene
   * @param elapsed
   */
  public override update(elapsed: number): Scene {
    this.timeThreshold -= elapsed;
    if (this.timeThreshold <= 0) {
      this.startScene = true;
    }
    if (this.point1.length > 0) {
      this.draw = true;
    }
    const found: any[] = [];
    this.track.road.forEach((trackPiece) => {
      if (Math.sqrt((MouseListener.mouseCoordinates.x - trackPiece[0]) ** 2 + (MouseListener.mouseCoordinates.y - trackPiece[1]) ** 2) <= this.radius) {
        if (MouseListener.buttonPressed(0)) {
          found.push(trackPiece);
        }
      }
    });
    if (this.finished) {
      console.log(this.radius);
      if (DrawTrack.racing) {
        return new NetAlgorithm(this.track, this.radius);
      }
      return new ChooseAlgoritm(this.track, this.radius);
    }
    return this;
  }

  /**
   * @param canvas is the canvas the element are rendered to
   */
  public render(canvas: HTMLCanvasElement): void {
    canvas.style.cursor = 'none';
    CanvasUtil.fillCanvas(canvas, 'black');
    CanvasUtil.fillRectangle(canvas, canvas.width / 30, canvas.height / 12, canvas.width - canvas.width / 5, canvas.height - canvas.height / 7.5, 255, 255, 255, 1, 20);
    this.track.render(canvas);
    CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width / 30, canvas.height, 30, 30, 30);
    CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width, canvas.height / 12, 30, 30, 30);
    CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6, 0, canvas.width / 6, canvas.height, 30, 30, 30);
    CanvasUtil.fillRectangle(canvas, 0, canvas.height - canvas.height / 20, canvas.width, canvas.height / 20, 30, 30, 30);
    CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6.5, canvas.height / 20, canvas.width / 5 - canvas.width / 18, canvas.height / 1.111, 255, 255, 255, 0.2, 20);

    CanvasUtil.fillCircle(canvas, canvas.width / 2.4, canvas.height / 2, 5, 255, 0, 0, 0.4);

    CanvasUtil.fillRectangle(canvas, canvas.width / 1.155, canvas.height / 12, canvas.width / 10, canvas.height / 20, 200, 50, 50, 1, 5);
    CanvasUtil.writeText(canvas, 'Delete track', canvas.width / 1.135, canvas.height / 8.5, 'left', 'system-ui', 25, 'white');

    CanvasUtil.drawImage(canvas, this.flag, MouseListener.mouseCoordinates.x - this.flag.width / 20, MouseListener.mouseCoordinates.y - this.flag.height / 20, this.flag.width / 10, this.flag.height / 10, 0, 0.6);
    if (this.draw) {
      CanvasUtil.drawImage(canvas, this.flag, this.track.midPoint[0] - this.flag.width / 20, this.track.midPoint[1] - this.flag.height / 20, this.flag.width / 10, this.flag.height / 10, 0);
    } else {
      CanvasUtil.fillRectangle(canvas, canvas.width / 30, canvas.height / 20, canvas.width - canvas.width / 6.5 - canvas.width / 21.7, canvas.height / 1.11, 0, 0, 0, 0.2);
      CanvasUtil.writeText(canvas, 'Select a valid starting line', canvas.width / 2.4, canvas.height / 2, 'center', 'system-ui', 60, 'White');
      CanvasUtil.drawImage(canvas, this.flag, this.track.midPoint[0] - this.flag.width / 20, this.track.midPoint[1] - this.flag.height / 20, this.flag.width / 10, this.flag.height / 10, 0);
    }
    if (this.warning && this.startScene) {
      CanvasUtil.fillRectangle(canvas, canvas.width / 30, canvas.height / 20, canvas.width - canvas.width / 6.5 - canvas.width / 21.7, canvas.height / 1.11, 100, 0, 0, 0.2);
      CanvasUtil.writeText(canvas, 'Not a valid position', canvas.width / 2.4, canvas.height / 2, 'center', 'system-ui', 60, 'White');
    }
    if (this.track.lineStart.length > 0) {
      CanvasUtil.fillRectangle(canvas, canvas.width / 1.155, canvas.height / 1.2, canvas.width / 10, canvas.height / 12, 40, 200, 100, 1, 5);
      CanvasUtil.writeText(canvas, 'Finish track', canvas.width / 1.09, canvas.height / 1.13, 'center', 'system-ui', 25, 'white');
    }
    CanvasUtil.fillCircle(canvas, MouseListener.mouseCoordinates.x, MouseListener.mouseCoordinates.y, 5, 0, 255, 0);
  }
}
