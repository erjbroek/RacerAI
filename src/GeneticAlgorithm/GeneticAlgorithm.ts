import CanvasUtil from '../utilities/CanvasUtil.js';
import Scene from '../scenes/Scene.js';
import Track from '../Track.js';
import GeneticPopulation from './GeneticPopulation.js';
import MouseListener from '../utilities/MouseListener.js';
import GeneticRace from './GeneticRace.js';
import UI from '../utilities/UI.js';

export default class GeneticAlgorithm extends Scene {
  private track: Track;

  private radius: number;

  private population: GeneticPopulation;

  private startSimulation: boolean = false;

  private startAngle: number;

  private populationSize: number = 100;

  private selectorPos: number[] = [window.innerWidth - window.innerWidth / 7.6, window.innerHeight / 3 + window.innerHeight / 50];

  private populationSizePercentage: number = 1;

  private triggered: boolean = false;

  private startRace: boolean = false;

  public constructor(track: Track, radius: number) {
    super();
    this.track = track;
    this.radius = radius;
    const startAngle = (Math.atan((this.track.lineStart[1] - this.track.lineEnd[1]) / (this.track.lineStart[0] - this.track.lineEnd[0])) * 180) / Math.PI;
    this.startAngle = startAngle;
    this.population = new GeneticPopulation(this.populationSize, this.track.midPoint, startAngle, this.track);
  }

  /**
   * processes player inputs
   */
  public override processInput(): void {
    // if (this.population.beaten) {
    //   if (MouseListener.mouseHover(window.innerWidth - window.innerWidth / 7.8, window.innerHeight / 1.4, window.innerWidth / 10, window.innerHeight / 10)) {
    //     if (MouseListener.isButtonDown(0)) {
    //       this.startRace = true;
    //     }
    //   }
    // }
    if (MouseListener.isButtonDown(0)) {
      if (MouseListener.mouseCoordinates.x >= window.innerWidth - window.innerWidth / 7.6 && MouseListener.mouseCoordinates.x <= window.innerWidth - window.innerWidth / 7 + window.innerWidth / 8.8 && MouseListener.mouseCoordinates.y >= window.innerHeight / 3 && MouseListener.mouseCoordinates.y <= window.innerHeight / 3 + window.innerHeight / 25) {
        this.selectorPos[0] = MouseListener.mouseCoordinates.x;
        const max = window.innerWidth / 7;
        const chosen = this.selectorPos[0] - (window.innerWidth - window.innerWidth / 7);
        this.populationSizePercentage = (chosen / max) * 10;
      }
      if (!this.startSimulation) {
        if (MouseListener.mouseHover(window.innerWidth - window.innerWidth / 7.8, window.innerHeight / 2, window.innerWidth / 10, window.innerHeight / 20)) {
          this.startSimulation = true;
        }
      }
    }
    UI.processInput();
  }

  /**
   * @param elapsed is the elapsed time since the last frame
   * @returns scene
   */
  public override update(elapsed: number): Scene {
    this.populationSize = (this.populationSizePercentage ** 2 + 10) ** 1.9;
    if (!UI.pauzeGame) {
      if (this.startSimulation) {
        if (!this.triggered) {
          this.triggered = true;
          this.population = new GeneticPopulation(this.populationSize, this.track.midPoint, this.startAngle, this.track);
        }
        this.population.update(elapsed);
      }
    }

    if (this.startRace) {
      return new GeneticRace(this.track, this.population.cars[0], GeneticPopulation.startingPoint, this.population.startingRotation);
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
    this.track.render(canvas);
    UI.renderUI(canvas);

    if (this.startSimulation) {
      // pauze button
      if (UI.holdingPauze) {
        CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 5.5, canvas.width / 26, canvas.height / 13, 0, 0, 0, 0.5, 20);
      } else if (UI.hoverPauze) {
        CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 5.5, canvas.width / 26, canvas.height / 13, 0, 0, 0, 0.3, 20);
      } else {
        CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 5.5, canvas.width / 26, canvas.height / 13, 0, 0, 0, 0.2, 20);
      }
      const dashWidth = canvas.width / 240;
      const dashHeight = canvas.height / 30;
      const dashX = canvas.width / 28 + canvas.width - canvas.width / 5 - canvas.width / 22 + (canvas.width / 26 - dashWidth) / 3;
      const dashY = canvas.height / 5.5 + (canvas.height / 13 - dashHeight) / 2;

      CanvasUtil.fillRectangle(canvas, dashX, dashY, dashWidth, dashHeight, 255, 255, 255, 0.7);
      CanvasUtil.fillRectangle(canvas, dashX + dashWidth + dashWidth, dashY, dashWidth, dashHeight, 255, 255, 255, 0.7);

      if (UI.pauzeGame) {
        CanvasUtil.fillRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 5.5, canvas.width / 26, canvas.height / 13, 0, 70, 0, 0.4, 20);
        CanvasUtil.drawRectangle(canvas, canvas.width / 30 + canvas.width - canvas.width / 5 - canvas.width / 22, canvas.height / 5.5, canvas.width / 26, canvas.height / 13, 0, 120, 0, 1, 5, 20);
      }
    }

    if (this.startSimulation) {
      if (!this.population.extinct) {
        this.population.render(canvas);
      }
    }
    if (!this.startSimulation) {
      CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 7, canvas.height / 3, canvas.width / 8, canvas.height / 25, 200, 200, 200, 0.9, canvas.height / 50);
      CanvasUtil.fillCircle(canvas, this.selectorPos[0], this.selectorPos[1], canvas.height / 70, 20, 50, 100, 1);
      CanvasUtil.writeText(canvas, `population size: ${Math.round(this.populationSize)}`, canvas.width / 1.09, canvas.height / 2.4, 'center', 'system-ui', 20, 'white');
      // CanvasUtil.drawLine(canvas, 0, canvas.height / 3, window.innerWidth / 8.8, canvas.height / 3, 255, 255, 0, 1, 10);
      // CanvasUtil.drawLine(canvas, 0, canvas.height / 3, this.selectorPos[0] - (window.innerWidth - window.innerWidth / 7), canvas.height / 3, 0, 255, 0, 1, 10);
      CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 7.8, canvas.height / 2, canvas.width / 10, canvas.height / 20, 20, 190, 80, 1, 10);
      CanvasUtil.writeText(canvas, 'Start simulation', canvas.width - canvas.width / 7.8 + canvas.width / 20, canvas.height / 2 + canvas.height / 35, 'center', 'system-ui', 20, 'white');
    }
    // if (this.population.beaten) {
    //   CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 7.8, canvas.height / 1.4, canvas.width / 10, canvas.height / 10, 20, 210, 100, 1, 10);
    //   CanvasUtil.writeText(canvas, 'Race the AI!', canvas.width - canvas.width / 6 + canvas.width / 10, canvas.height / 1.4 + canvas.height / 20, 'center', 'system-ui', 30, 'white');
    // }
  }
}
