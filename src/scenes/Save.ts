import Cookies from '../ui/Cookies.js';
import { Stats } from '../ui/Cookies.js'
import HandleScore from '../ui/HandleScore.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import KeyListener from '../utilities/KeyListener.js';
import MouseListener from '../utilities/MouseListener.js';
import Scene from './Scene.js';
import StartingScene from './StartingScene.js';

export default class Save extends Scene {
  private background: HTMLImageElement;

  private logo: HTMLImageElement;

  private slotWidth: number = window.innerWidth / 4;

  private slot1Stats: Stats | null = Cookies.getStatsFromSlot(1);

  private slot2Stats: Stats | null = Cookies.getStatsFromSlot(2);

  private slot3Stats: Stats | null = Cookies.getStatsFromSlot(3);

  private startTimer: boolean = false;

  private time: number = 2000;

  private renderLoad: boolean = false;

  public constructor() {
    super();
    this.background = CanvasUtil.loadNewImage('./assets/backMountains.png');
  }

  /**
   * tracks all player inputs
   *
   * @param keyListener tracks the players key inputs
   * @param mouseListener tracks the players mouse inputs
   */
  public processInput(keyListener: KeyListener, mouseListener: MouseListener): void {
    if (!this.startTimer) {
      // slot 1
      if (Cookies.checkCookieForSlot(1)) {
        if (MouseListener.areaDown(0, window.innerWidth / 12, window.innerHeight / 1.25, window.innerWidth / 11, window.innerHeight / 20)) {
          Cookies.loadStatsFromCookieSlot(1);
          this.slot1Stats = Cookies.getStatsFromSlot(1);
          this.startTimer = true;
        }
        if (MouseListener.areaDown(0, window.innerWidth / 8 + window.innerWidth / 7.8, window.innerHeight / 5.5, window.innerWidth / 20, window.innerHeight / 25)) {
          Cookies.removeCookie(1);
        }
        if (MouseListener.areaDown(0, window.innerWidth / 12 + window.innerWidth / 8.8, window.innerHeight / 1.25, window.innerWidth / 11, window.innerHeight / 20)) {
          Cookies.saveStatsToCookies(1);
          this.slot1Stats = Cookies.getStatsFromSlot(1);
        }
      } else if (MouseListener.areaDown(0, window.innerWidth / 12 + window.innerWidth / 8.8, window.innerHeight / 1.25, window.innerWidth / 11, window.innerHeight / 20)) {
        Cookies.saveStatsToCookies(1);
        Cookies.loadStatsFromCookieSlot(1);
        this.slot1Stats = Cookies.getStatsFromSlot(1);
        this.startTimer = true;
      }

      // slot 2
      if (Cookies.checkCookieForSlot(2)) {
        if (MouseListener.areaDown(0, window.innerWidth / 2.52, window.innerHeight / 1.25, window.innerWidth / 11, window.innerHeight / 20)) {
          Cookies.loadStatsFromCookieSlot(2);
          this.slot2Stats = Cookies.getStatsFromSlot(2);
          this.startTimer = true;
        }
        if (MouseListener.areaDown(0, window.innerWidth / 8 + window.innerWidth / 2.28, window.innerHeight / 5.5, window.innerWidth / 20, window.innerHeight / 25)) {
          Cookies.removeCookie(2);
        }
        if (MouseListener.areaDown(0, window.innerWidth / 2.52 + window.innerWidth / 8.8, window.innerHeight / 1.25, window.innerWidth / 11, window.innerHeight / 20)) {
          Cookies.saveStatsToCookies(2);
          this.slot2Stats = Cookies.getStatsFromSlot(2);
        }
      } else if (MouseListener.areaDown(0, window.innerWidth / 2.52 + window.innerWidth / 8.8, window.innerHeight / 1.25, window.innerWidth / 11, window.innerHeight / 20)) {
        Cookies.saveStatsToCookies(2);
        Cookies.loadStatsFromCookieSlot(2);
        this.slot2Stats = Cookies.getStatsFromSlot(2);
        this.startTimer = true;
      }

      // slot 3
      if (Cookies.checkCookieForSlot(3)) {
        if (MouseListener.areaDown(0, window.innerWidth / 1.41, window.innerHeight / 1.25, window.innerWidth / 11, window.innerHeight / 20)) {
          Cookies.loadStatsFromCookieSlot(3);
          this.slot3Stats = Cookies.getStatsFromSlot(3);
          this.startTimer = true;
        }
        if (MouseListener.areaDown(0, window.innerWidth / 8 + window.innerWidth / 1.324, window.innerHeight / 5.5, window.innerWidth / 20, window.innerHeight / 25)) {
          Cookies.removeCookie(3);
        }
        if (MouseListener.areaDown(0, window.innerWidth / 1.41 + window.innerWidth / 8.8, window.innerHeight / 1.25, window.innerWidth / 11, window.innerHeight / 20)) {
          Cookies.saveStatsToCookies(3);
          this.slot3Stats = Cookies.getStatsFromSlot(3);
        }
      } else if (MouseListener.areaDown(0, window.innerWidth / 1.41 + window.innerWidth / 8.8, window.innerHeight / 1.25, window.innerWidth / 11, window.innerHeight / 20)) {
        Cookies.saveStatsToCookies(3);
        Cookies.loadStatsFromCookieSlot(3);
        this.slot3Stats = Cookies.getStatsFromSlot(3);
        this.startTimer = true;
      }
    }
  }

  /**
   * updates the scene
   *
   * @param elapsed is the elapsed time each frame takes
   * @returns Scene
   */
  public update(elapsed: number): Scene {
    if (this.startTimer) {
      this.time -= elapsed;
      this.renderLoad = true;
      if (this.time <= 0) {
        return new StartingScene();
      }
    }
    return this;
  }

  /**
   * renders all item on the canvas
   *
   * @param canvas is the canvas the items are rendered to
   */
  public render(canvas: HTMLCanvasElement): void {
    CanvasUtil.drawImage(canvas, this.background, 0, 0, canvas.width, canvas.height, 0);
    CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 50, 0.5);
    CanvasUtil.fillRectangle(canvas, canvas.width * 0.065 - canvas.width / 20, canvas.height / 6 - canvas.height / 8, canvas.width / 1.03, canvas.height / 1.4 + canvas.height / 5, 50, 100, 150, 0.35, 20);
    CanvasUtil.writeText(canvas, 'Save Slots', canvas.width / 2, canvas.height / 8, 'center', 'arial', 60, 'white');

    CanvasUtil.fillRectangle(canvas, canvas.width * 0.0625, canvas.height / 6, this.slotWidth, canvas.height / 1.4, 50, 90, 100, 0.8, 4);
    CanvasUtil.fillRectangle(canvas, canvas.width * 0.0625 + (this.slotWidth + canvas.width * 0.0624), canvas.height / 6, this.slotWidth, canvas.height / 1.4, 30, 120, 90, 0.8, 4);
    CanvasUtil.fillRectangle(canvas, canvas.width * 0.0625 + (canvas.width * 0.125 + this.slotWidth * 2), canvas.height / 6, this.slotWidth, canvas.height / 1.4, 80, 180, 110, 0.8, 4);
    CanvasUtil.fillRectangle(canvas, canvas.width * 0.0625, canvas.height / 6, this.slotWidth, canvas.height / 4, 0, 0, 0, 0.2, 4);
    CanvasUtil.fillRectangle(canvas, canvas.width * 0.0625 + (this.slotWidth + canvas.width * 0.0624), canvas.height / 6, this.slotWidth, canvas.height / 4, 0, 0, 0, 0.2, 4);
    CanvasUtil.fillRectangle(canvas, canvas.width * 0.0625 + (canvas.width * 0.125 + this.slotWidth * 2), canvas.height / 6, this.slotWidth, canvas.height / 4, 0, 0, 0, 0.2, 4);
    CanvasUtil.fillRectangle(canvas, canvas.width * 0.0625, canvas.height / 1.32, this.slotWidth, canvas.height / 8, 0, 0, 0, 0.2, 4);
    CanvasUtil.fillRectangle(canvas, canvas.width * 0.0625 + (this.slotWidth + canvas.width * 0.0624), canvas.height / 1.32, this.slotWidth, canvas.height / 8, 0, 0, 0, 0.2, 4);
    CanvasUtil.fillRectangle(canvas, canvas.width * 0.0625 + (canvas.width * 0.125 + this.slotWidth * 2), canvas.height / 1.32, this.slotWidth, canvas.height / 8, 0, 0, 0, 0.2, 4);

    CanvasUtil.drawRectangle(canvas, canvas.width * 0.0625, canvas.height / 6, this.slotWidth, canvas.height / 1.4, 10, 40, 50, 0.8, 4, 10);
    CanvasUtil.drawRectangle(canvas, canvas.width * 0.0625 + (this.slotWidth + canvas.width * 0.0624), canvas.height / 6, this.slotWidth, canvas.height / 1.4, 31, 40, 50, 0.8, 4, 10);
    CanvasUtil.drawRectangle(canvas, canvas.width * 0.0625 + (canvas.width * 0.125 + this.slotWidth * 2), canvas.height / 6, this.slotWidth, canvas.height / 1.4, 10, 40, 50, 0.8, 4, 10);

    // slot 1
    if (Cookies.checkCookieForSlot(1)) {
      CanvasUtil.writeText(canvas, `Time played ${this.slot1Stats.fPlayTime}`, canvas.width / 5.3, canvas.height / 3, 'center', 'arial', 20, 'white');
      CanvasUtil.writeText(canvas, `- Duck dollars: ${this.slot1Stats.duckDollars}`, canvas.width / 7.4, canvas.height / 2, 'center', 'arial', 20, 'white');
      CanvasUtil.fillRectangle(canvas, canvas.width / 12, canvas.height / 1.25, canvas.width / 11, canvas.height / 20, 255, 255, 255, 0.4, 25);
      CanvasUtil.writeText(canvas, 'load', canvas.width / 8, canvas.height / 1.2, 'center', 'arial', 25, 'white');
      CanvasUtil.fillRectangle(canvas, canvas.width / 8 + canvas.width / 7.8, canvas.height / 5.5, canvas.width / 20, canvas.height / 25, 200, 50, 50, 0.9, 15);
      CanvasUtil.writeText(canvas, 'save', canvas.width / 8 + canvas.width / 8.4, canvas.height / 1.2, 'center', 'arial', 25, 'white');
      CanvasUtil.writeText(canvas, 'Delete', canvas.width / 8 + canvas.width / 7.3, canvas.height / 4.8, 'left', 'Arial', 20, 'white');
    } else {
      CanvasUtil.writeText(canvas, 'No data found', canvas.width / 5.3, canvas.height / 3.5, 'center', 'Arial', 20, 'orange');
      CanvasUtil.writeText(canvas, 'start', canvas.width / 8 + canvas.width / 8.4, canvas.height / 1.2, 'center', 'arial', 25, 'white');
    }
    CanvasUtil.writeText(canvas, 'Slot 1', canvas.width / 5.3, canvas.height / 4, 'center', 'arial', 50, 'white');
    CanvasUtil.fillRectangle(canvas, canvas.width / 12 + canvas.width / 8.8, canvas.height / 1.25, canvas.width / 11, canvas.height / 20, 255, 255, 255, 0.4, 25);

    // slot 2
    if (Cookies.checkCookieForSlot(2)) {
      CanvasUtil.writeText(canvas, `Time played ${this.slot2Stats.fPlayTime}`, canvas.width / 2, canvas.height / 3, 'center', 'arial', 20, 'white');
      CanvasUtil.writeText(canvas, `- Duck dollars: ${this.slot2Stats.duckDollars}`, canvas.width / 2.25, canvas.height / 2, 'center', 'arial', 20, 'white');
      CanvasUtil.fillRectangle(canvas, canvas.width / 2.52, canvas.height / 1.25, canvas.width / 11, canvas.height / 20, 255, 255, 255, 0.4, 25);
      CanvasUtil.writeText(canvas, 'load', canvas.width / 2.28, canvas.height / 1.2, 'center', 'arial', 25, 'white');
      CanvasUtil.fillRectangle(canvas, canvas.width / 8 + canvas.width / 2.28, canvas.height / 5.5, canvas.width / 20, canvas.height / 25, 200, 50, 50, 0.9, 15);
      CanvasUtil.writeText(canvas, 'save', canvas.width / 2.28 + canvas.width / 8.4, canvas.height / 1.2, 'center', 'arial', 25, 'white');
      CanvasUtil.writeText(canvas, 'Delete', canvas.width / 8 + canvas.width / 2.23, canvas.height / 4.8, 'left', 'Arial', 20, 'white');
    } else {
      CanvasUtil.writeText(canvas, 'No data found', canvas.width / 2, canvas.height / 3.5, 'center', 'Arial', 20, 'orange');
      CanvasUtil.writeText(canvas, 'start', canvas.width / 2.28 + canvas.width / 8.4, canvas.height / 1.2, 'center', 'arial', 25, 'white');
    }
    CanvasUtil.writeText(canvas, 'Slot 2', canvas.width / 2, canvas.height / 4, 'center', 'arial', 50, 'white');
    CanvasUtil.fillRectangle(canvas, canvas.width / 2.52 + canvas.width / 8.8, canvas.height / 1.25, canvas.width / 11, canvas.height / 20, 255, 255, 255, 0.4, 25);

    // slot 3
    if (Cookies.checkCookieForSlot(3)) {
      CanvasUtil.writeText(canvas, `Time played ${this.slot3Stats.fPlayTime}`, canvas.width / 1.23, canvas.height / 3, 'center', 'arial', 20, 'white');
      CanvasUtil.writeText(canvas, `- Duck dollars: ${this.slot3Stats.duckDollars}`, canvas.width / 1.31, canvas.height / 2, 'center', 'arial', 20, 'white');
      CanvasUtil.fillRectangle(canvas, canvas.width / 1.41, canvas.height / 1.25, canvas.width / 11, canvas.height / 20, 255, 255, 255, 0.4, 25);
      CanvasUtil.writeText(canvas, 'load ', canvas.width / 1.325, canvas.height / 1.2, 'center', 'arial', 25, 'white');
      CanvasUtil.fillRectangle(canvas, canvas.width / 8 + canvas.width / 1.324, canvas.height / 5.5, canvas.width / 20, canvas.height / 25, 200, 50, 50, 0.9, 15);
      CanvasUtil.writeText(canvas, 'save', canvas.width / 1.325 + canvas.width / 8.4, canvas.height / 1.2, 'center', 'arial', 25, 'white');
      CanvasUtil.writeText(canvas, 'Delete', canvas.width / 8 + canvas.width / 1.306, canvas.height / 4.8, 'left', 'Arial', 20, 'white');
    } else {
      CanvasUtil.writeText(canvas, 'No data found', canvas.width / 1.24, canvas.height / 3.5, 'center', 'Arial', 20, 'orange');
      CanvasUtil.writeText(canvas, 'start', canvas.width / 1.325 + canvas.width / 8.4, canvas.height / 1.2, 'center', 'arial', 25, 'white');
    }
    CanvasUtil.writeText(canvas, 'Slot 3', canvas.width / 1.23, canvas.height / 4, 'center', 'arial', 50, 'white');
    CanvasUtil.fillRectangle(canvas, canvas.width / 1.41 + canvas.width / 8.8, canvas.height / 1.25, canvas.width / 11, canvas.height / 20, 255, 255, 255, 0.4, 25);

    if (this.renderLoad) {
      CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 0, 0.2, 0);
      CanvasUtil.fillRectangle(canvas, canvas.width / 3, canvas.height / 3, canvas.width / 3, canvas.height / 3, 30, 200, 120, 0.6, 40);
      CanvasUtil.drawRectangle(canvas, canvas.width / 3 - 10, canvas.height / 3 - 10, canvas.width / 3 + 20, canvas.height / 3 + 20, 0, 0, 0, 1, 10, 50);
      CanvasUtil.writeText(canvas, 'slot loaded succesfully', canvas.width / 2, canvas.height / 2, 'center', 'arial', 35, 'white')
    }
  }
}
