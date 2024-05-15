import Scene from './Scene.js';
import KeyListener from '../utilities/KeyListener.js';
import MouseListener from '../utilities/MouseListener.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import SelectStart from './selectStart.js';

export default class StartingScene extends Scene {
  private radius: number = window.innerWidth / 28;

  private allValid: boolean = false;

  private closed: boolean = false;

  private straightPiece: boolean = false;

  private longEnough: boolean = false;

  private flag: boolean = false;

  private draw: boolean = false;

  private finished: boolean = false;

  private drawWarning: boolean = false;

  private track: number[][] = [];

  private valid: boolean = false;

  private checked: boolean = false;

  public constructor() {
    super();
  }

  /**
   *
   * @param keyListener
   */
  public override processInput(keyListener: KeyListener): void {
    if (MouseListener.isButtonDown(0)) {
      if (MouseListener.mouseHover(window.innerWidth / 1.155, window.innerHeight / 1.2, window.innerWidth / 10, window.innerHeight / 12)) {
        if (this.valid) {
          this.finished = true;
        }
      }
    }
    if (MouseListener.isButtonDown(0)) {
      if (MouseListener.mouseHover(window.innerWidth / 1.155, window.innerHeight / 12, window.innerWidth / 10, window.innerHeight / 20)) {
        this.track = [];
        this.straightPiece = false;
        this.closed = false;
        this.allValid = false;
        this.valid = false;
      }
    }
    if (MouseListener.isButtonDown(0) && MouseListener.mouseCoordinates.x <= window.innerWidth - window.innerWidth / 6) {
      if (this.longEnough) {
        let hasCollision = false;
        this.track.forEach((trackPiece) => {
          if (Math.sqrt((MouseListener.mouseCoordinates.x - trackPiece[0]) ** 2 + (MouseListener.mouseCoordinates.y - trackPiece[1]) ** 2) <= this.radius / 2) {
            hasCollision = true;
          }
        });
        if (!hasCollision) {
          this.draw = true;
        } else {
          this.draw = false;
        }
      } else {
        this.draw = true;
        if (this.track.length > 0) {
          if (Math.sqrt((MouseListener.mouseCoordinates.x - this.track[this.track.length - 1][0]) ** 2 + (MouseListener.mouseCoordinates.y - this.track[this.track.length - 1][1]) ** 2) <= this.radius / 2) {
            this.draw = false;
          }
        }
      }
    } else {
      this.draw = false;
    }

    if (MouseListener.isButtonDown(0)) {
      this.checked = false;
      this.drawWarning = false;
    } else {
      this.drawWarning = true;
      this.trackValidation();
    }
  }

  /**
   *
   * @param elapsed
   */
  public update(elapsed: number): Scene {
    this.longEnough = this.track.length >= 20;
    if (this.allValid && this.longEnough && this.closed && this.straightPiece) {
      this.valid = true;
    }
    if (this.finished) {
      return new SelectStart(this.track, this.radius);
    }
    return this;
  }

  /**
   *
   */
  public trackValidation(): void {
    if (!this.checked) {
      this.allValid = true;
      let close = false; // Initialize close to false
      this.flag = false;
      let totalFound = 0;
      this.track.forEach((track1) => {
        const found: number[] = [];
        let hasCollision = false;
        this.track.forEach((track2) => {
          if (Math.sqrt((track1[0] - track2[0]) ** 2 + (track1[1] - track2[1]) ** 2) <= this.radius * 1.4 && track1 !== track2) {
            found.push(this.track.indexOf(track2));
            hasCollision = true;
            track1[2] = 1;
            const index1 = this.track.indexOf(track1);
            const index2 = this.track.indexOf(track2);

            // makes sure user cant cheat and place the final track piece next to the first
            if (Math.abs(index2 - index1) >= 25 && index1 <= 7) {
              close = true;
              let closedAmount = 0;
              for (let i = 0; i < 7; i++) {
                if (Math.sqrt(((this.track[index2 - i][0] - this.track[index2 - 1 - i][0]) ** 2) + ((this.track[index2 - i][1] - this.track[index2 - 1 - i][1]) ** 2)) <= this.radius * 1.4) {
                  closedAmount++;
                }
              }
              if (closedAmount <= 3) {
                close = false;
              }
            }
          }
        });
        if (!hasCollision) {
          this.allValid = false;
        }

        if (found.length <= 5) {
          totalFound++;
          this.straightPiece = true;
        }
      });
      if (totalFound / this.track.length <= 0.7) {
        this.straightPiece = false;
      }
      this.closed = close;
    }
    this.checked = true;
  }

  /**
   * @param canvas is the canvas the element are rendered to
   */
  public render(canvas: HTMLCanvasElement): void {
    this.track.forEach((trackPiece) => {
      CanvasUtil.fillCircle(canvas, trackPiece[0], trackPiece[1], this.radius, 20 / (trackPiece[2] + 0.1), 255 * Number(this.valid), 0);
    });
    if (this.draw) {
      this.track.push([MouseListener.mouseCoordinates.x, MouseListener.mouseCoordinates.y, 0]);
    }
    CanvasUtil.fillCircle(canvas, MouseListener.mouseCoordinates.x, MouseListener.mouseCoordinates.y, this.radius, 0, 0, 30, 0.3);
    CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width / 30, canvas.height, 50, 120, 200);
    CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width, canvas.height / 20, 50, 120, 200);
    CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6, 0, canvas.width / 6, canvas.height, 50, 120, 200);
    CanvasUtil.fillRectangle(canvas, 0, canvas.height - canvas.height / 20, canvas.width, canvas.height / 20, 50, 120, 200);
    CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6.5, canvas.height / 20, canvas.width / 5 - canvas.width / 18, canvas.height / 1.111, 255, 255, 255, 0.2);

    CanvasUtil.fillCircle(canvas, canvas.width / 2.4, canvas.height / 2, 5, 255, 0, 0, 0.4);

    CanvasUtil.fillRectangle(canvas, canvas.width / 1.155, canvas.height / 12, canvas.width / 10, canvas.height / 20, 200, 50, 50, 1, 5);
    CanvasUtil.writeText(canvas, 'Delete track', canvas.width / 1.135, canvas.height / 8.5, 'left', 'arial', 25, 'white');

    if (this.track.length > 2 && this.drawWarning) {
      if (!this.longEnough && !this.allValid && !this.closed) {
        CanvasUtil.fillRectangle(canvas, canvas.width / 19, canvas.height / 12, canvas.width / 1.31, canvas.height / 12, 170, 0, 0, 0.4, 5);
        CanvasUtil.writeText(canvas, 'track too short & please connect all track pieces', canvas.width / 2.2, canvas.height / 7.8, 'center', 'arial', 30, 'red');
      } else if (!this.longEnough) {
        CanvasUtil.fillRectangle(canvas, canvas.width / 19, canvas.height / 12, canvas.width / 1.31, canvas.height / 12, 170, 0, 0, 0.4, 5);
        CanvasUtil.writeText(canvas, 'Track is too short', canvas.width / 2.2, canvas.height / 7.8, 'center', 'arial', 30, 'red');
      } else if (!this.allValid) {
        CanvasUtil.fillRectangle(canvas, canvas.width / 19, canvas.height / 12, canvas.width / 1.31, canvas.height / 12, 170, 0, 0, 0.4, 5);
        CanvasUtil.writeText(canvas, 'Please connect all track pieces', canvas.width / 2.2, canvas.height / 7.8, 'center', 'arial', 30, 'red');
      } else if (!this.closed) {
        this.track[0][2] = 0;
        this.track[this.track.length - 1][2] = 0;
        CanvasUtil.fillRectangle(canvas, canvas.width / 19, canvas.height / 12, canvas.width / 1.31, canvas.height / 12, 170, 0, 0, 0.4, 5);
        CanvasUtil.writeText(canvas, 'Track start and finish must be connected', canvas.width / 2.2, canvas.height / 7.8, 'center', 'arial', 30, 'red');
      } else if (!this.straightPiece) {
        this.track[0][2] = 0;
        this.track[this.track.length - 1][2] = 0;
        CanvasUtil.fillRectangle(canvas, canvas.width / 19, canvas.height / 12, canvas.width / 1.31, canvas.height / 12, 170, 0, 0, 0.4, 5);
        CanvasUtil.writeText(canvas, "come on, that doesn't look like a racetrack does it", canvas.width / 2.2, canvas.height / 7.8, 'center', 'arial', 30, 'red');
      }
    }
    if (this.track.length === 0) {
      CanvasUtil.fillRectangle(canvas, canvas.width / 30, canvas.height / 20, canvas.width - canvas.width / 6.5 - canvas.width / 21.7, canvas.height / 1.11, 0, 0, 0, 0.2);
      CanvasUtil.writeText(canvas, 'Draw your racing track here', canvas.width / 2.4, canvas.height / 2, 'center', 'arial', 60, 'White');
    }
    if (this.valid) {
      CanvasUtil.fillRectangle(canvas, canvas.width / 1.155, canvas.height / 1.2, canvas.width / 10, canvas.height / 12, 40, 200, 100, 1, 5);
      CanvasUtil.writeText(canvas, 'Finish track', canvas.width / 1.09, canvas.height / 1.13, 'center', 'arial', 25, 'white');
    }
  }
}
