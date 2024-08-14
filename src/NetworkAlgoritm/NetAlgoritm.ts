import CanvasUtil from '../utilities/CanvasUtil.js';
import Scene from '../scenes/Scene.js';
import Track from '../Track.js';
import MouseListener from '../utilities/MouseListener.js';
import NetPopulation from './NetPopulation.js';
import UI from '../utilities/UI.js';

export default class NetAlgorithm extends Scene {
  private track: Track;

  private radius: number;

  private population: NetPopulation;

  private startSimulation: boolean = false;

  private startAngle: number;

  private populationSize: number = 100;

  private selectorPos: number[] = [window.innerWidth - window.innerWidth / 7.6, window.innerHeight / 3 + window.innerHeight / 50];

  private populationSizePercentage: number = 1;

  private triggered: boolean = false;

  public constructor(track: Track, radius: number) {
    super();
    this.track = track;
    this.radius = radius;
    const startAngle = (Math.atan((this.track.lineStart[1] - this.track.lineEnd[1]) / (this.track.lineStart[0] - this.track.lineEnd[0])) * 180) / Math.PI;
    this.startAngle = startAngle;
    this.population = new NetPopulation(this.populationSize, this.track, this.track.midPoint, startAngle);
  }

  /**
   * processes player inputs
   */
  public override processInput(): void {
    this.population.statistics.processInput();
    if (!this.population.statistics.showAdvancedStats) {
      UI.processInput();
    }
    if (MouseListener.isButtonDown(0)) {
      if (MouseListener.mouseCoordinates.x >= window.innerWidth - window.innerWidth / 7.6 && MouseListener.mouseCoordinates.x <= window.innerWidth - window.innerWidth / 7 + window.innerWidth / 8.8 && MouseListener.mouseCoordinates.y >= window.innerHeight / 3 && MouseListener.mouseCoordinates.y <= window.innerHeight / 3 + window.innerHeight / 25) {
        this.selectorPos[0] = MouseListener.mouseCoordinates.x;
        const max = window.innerWidth / 5;
        const chosen = this.selectorPos[0] - (window.innerWidth - window.innerWidth / 7);
        this.populationSizePercentage = (chosen / max) * 8;
      }
      if (!this.startSimulation) {
        if (MouseListener.mouseHover(window.innerWidth - window.innerWidth / 7.8, window.innerHeight / 2, window.innerWidth / 10, window.innerHeight / 20)) {
          this.startSimulation = true;
        }
      }
    }
  }

  /**
   * @param elapsed is the elapsed time since the last frame
   * @returns scene
   */
  public override update(elapsed: number): Scene {
    // used for the slider to select population size
    this.populationSize = Math.floor(this.populationSizePercentage * 5) + 15;
    if (!UI.pauzeGame) {
      if (this.startSimulation) {
        if (!this.triggered) {
          this.triggered = true;
          this.population = new NetPopulation(this.populationSize, this.track, this.track.midPoint, this.startAngle);
        }
        this.population.update(elapsed);
      }
    }
    return this;
  }

  /**
   * @param canvas is the selected canvas all items are rendered on
   */
  public override render(canvas: HTMLCanvasElement): void {
    canvas.style.cursor = 'default';
    CanvasUtil.fillCanvas(canvas, 'black');
    CanvasUtil.fillRectangle(canvas, canvas.width / 30, canvas.height / 12, canvas.width - canvas.width / 5, canvas.height - canvas.height / 7.5, 255, 255, 255, 1, 20);

    UI.renderUI(canvas);
    this.track.render(canvas);

    if (this.startSimulation) {
      if (!this.population.statistics.showAdvancedStats) {
        UI.renderPauze(canvas);
      }
      if (!this.population.extinct) {
        this.population.render(canvas);
      }
    }
    if (!this.startSimulation) {
      CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 7, canvas.height / 3, canvas.width / 8, canvas.height / 25, 200, 200, 200, 0.9, canvas.height / 50);
      CanvasUtil.fillCircle(canvas, this.selectorPos[0], this.selectorPos[1], canvas.height / 70, 20, 50, 100, 1);
      CanvasUtil.writeText(canvas, `population size: ${Math.round(this.populationSize)}`, canvas.width / 1.09, canvas.height / 2.4, 'center', 'system-ui', 20, 'white');
      CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 7.8, canvas.height / 2, canvas.width / 10, canvas.height / 20, 20, 190, 80, 1, 10);
      CanvasUtil.writeText(canvas, 'Start simulation', canvas.width - canvas.width / 7.8 + canvas.width / 20, canvas.height / 2 + canvas.height / 35, 'center', 'system-ui', 20, 'white');
    }
  }
}
