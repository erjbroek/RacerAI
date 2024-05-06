import Background from '../background items/Background.js';
import HandleScore from '../ui/HandleScore.js';
import CanvasUtil from '../utilities/CanvasUtil.js';

export default class DistanceMeter {
  private playerPosX: number = 0;

  private playerPosY: number = 0;

  private space: HTMLImageElement = CanvasUtil.loadNewImage('./assets/space.png');

  private playerImage: HTMLImageElement = CanvasUtil.loadNewImage('./assets/player.png');

  private backgrounds: HTMLImageElement[] = [];

  private red: number = 255;

  private green: number = 255;

  private blue: number = 255;

  private launchSpeed: number;

  private startPoint: number[] = [0, 0];

  private time: number = 0;

  private route: number[][] = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];

  private mapSize: number = 3

  private lineThickness: number = 0;

  public constructor(launchSpeed: number) {
    this.playerPosX = 0;
    this.playerPosY = 0;
    this.launchSpeed = launchSpeed;

    for (let i = 0; i <= 9; i++) {
      this.backgrounds.push(this.addBackground());
    }
  }

  /**
   * @param random is used to determine what image is added
   * @returns background image
   */
  private addBackground(random: number = Math.random()): HTMLImageElement {
    if (random <= 0.15) {
      return CanvasUtil.loadNewImage('./assets/backMountains.png');
    }
    if (random <= 0.4) {
      return CanvasUtil.loadNewImage('./assets/backHills.png');
    }
    if (random <= 0.7) {
      return CanvasUtil.loadNewImage('./assets/background.png');
    }
    return CanvasUtil.loadNewImage('./assets/backForest.png');
  }

  public update(elapsed: number, speed: number) {
    this.playerPosX = HandleScore.distance * 200;
    this.playerPosY = HandleScore.height * 200;
    const speedDivider: number = speed / this.launchSpeed;
    this.lineThickness = (speedDivider * 1.8);

    if (speedDivider <= 0.4) {
      this.red = 255;
      this.green = Math.round(255 * speedDivider * 2.5); // green increases as speedDivider approaches 0.4
      this.blue = 0;
    } else if (speedDivider <= 0.8) {
      this.red = Math.round(255 * (1 - (speedDivider - 0.4) * 2.5)); // red decreases as speedDivider approaches 0.8
      this.green = 255;
      this.blue = 0;
    } else if (speedDivider <= 1.2) {
      this.red = 0;
      this.green = Math.round(255 * (1 - (speedDivider - 0.8) * 2.5)); // green decreases as speedDivider approaches 1.2
      this.blue = Math.round(255 * (speedDivider - 0.8) * 2.5); // blue increases as speedDivider approaches 1.2
    } else {
      this.red = Math.round(255 * (speedDivider - 1.2)); // red increases as speedDivider increases
      this.green = 0;
      this.blue = 255;
    }

    this.time += elapsed;
    if (this.time >= 100) {
      // 0.0386.. is de standaard schaal voor de meter. dus 1 echt achtergrond staat voor 1 achtergrond op de meter
      this.startPoint = [this.playerPosX * (0.03864 / this.mapSize), this.playerPosY * 0.03864, this.red, this.green, this.blue, this.lineThickness * 2];
      this.route.push(this.startPoint);
      this.time = 0;
    }
  }

  /**
   * @param canvas is the canvas things are rendered on
   */
  public render(canvas: HTMLCanvasElement, angle: number) {
    CanvasUtil.fillRectangle(canvas, canvas.width / 120, canvas.height / 35, canvas.width / 1.128, canvas.height / 9, 0, 0, 60, 0.5, 10);
    for (let i = 0; i <= 9; i++) {
      CanvasUtil.drawImage(canvas, this.backgrounds[i], canvas.width / 60 + (canvas.width / 11.5) * i, canvas.height / 23 + canvas.height / 30, canvas.width / 11.5, canvas.height / 20, 0);
    }
    CanvasUtil.drawImage(canvas, this.space, canvas.width / 60, canvas.height / 100 + canvas.height / 30, canvas.width / 1.15, canvas.height / 30);
    CanvasUtil.drawRectangle(canvas, canvas.width / 60, canvas.height / 100 + canvas.height / 30, canvas.width / 1.15, canvas.height / 12, 255, 255, 255, 1, 2, 0);
    if (this.route.length >= 2) {
      for (let i = 0; i <= this.route.length - 2; i++) {
        CanvasUtil.drawLine(canvas, this.route[i][0] + canvas.width / 60, canvas.height - canvas.height / 1.14 - this.route[i][1], this.route[i + 1][0] + canvas.width / 60, canvas.height - canvas.height / 1.14 - this.route[i + 1][1], this.route[i][2], this.route[i][3], this.route[i][4], 1, this.route[i][5]);
      }
      CanvasUtil.drawImage(canvas, this.playerImage, this.route[this.route.length - 1][0] + canvas.width / 100, canvas.height - canvas.height / 1.12 - this.route[this.route.length - 1][1], canvas.width / 40, canvas.height / 30, angle);
    }
    CanvasUtil.fillRectangle(canvas, canvas.width / 40 + HandleScore.maxDistance * 200 * (0.03864 / this.mapSize), canvas.height / 100 + canvas.height / 30, 1, canvas.height / 12, 200, 0, 0, 0.5);
    CanvasUtil.writeText(canvas, 'record', canvas.width / 40 + HandleScore.maxDistance * 200 * (0.03864 / this.mapSize), canvas.height / 100 + canvas.height / 33, 'center', 'arial', 10, 'pink');
  }
}
