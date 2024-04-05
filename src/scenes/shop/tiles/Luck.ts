import HandleStats from '../../../ui/HandleStats.js';
import HandleScore from '../../../ui/HandleScore.js';
import CanvasUtil from '../../../utilities/CanvasUtil.js';
import ShopTile from './ShopTile.js';

export default class Luck extends ShopTile {
  public luckStats: number[][] = [[], [], [], [], [], []];

  public constructor() {
    super();
    this.tier = HandleStats.luckTier;
    this.maxTier = 5;
    this.blueValue = 50 * HandleStats.luckTier;
    this.opacity = 0.6;
    this.title = 'Luck';
    this.description = 'An increase in luck means you find better coins and face less obstacles<br>in the way.';
    this.upgradeCost = 150;
    this.upgradeMultiplier = 2.6;
    this.tileSize = window.innerWidth / 7.5;
    this.posX = window.innerWidth / 10 + this.tileSize + window.innerWidth / 32;
    this.posY = window.innerHeight / 3.3 + 30;
    this.luckStats = [[0.0, 0.0], [0.07, 0.05], [0.15, 0.1], [0.25, 0.20], [0.36, 0.27], [0.5, 0.35]];
  }

  /**
   * levels up launchpower
   */
  public override level() {
    if (HandleScore.duckDollars >= this.upgradeCost) {
      if (this.tier < this.maxTier) {
        HandleScore.duckDollars -= this.upgradeCost;
        HandleStats.luckTier += 1;
        this.tier += 1;
        this.blueValue = (255 / this.maxTier) * this.tier;
        this.upgradeCost *= this.upgradeMultiplier;
      }
    }
  }

  /**
   * renders the shape and image
   *
   * @param canvas is the selected canvas to render to
   */
  public override render(canvas: HTMLCanvasElement) {
    CanvasUtil.fillRectangle(canvas, this.posX, this.posY, this.tileSize, this.tileSize, 30, 175, this.blueValue, this.opacity);
    CanvasUtil.fillRectangle(canvas, this.posX + window.innerWidth / 64, this.posY + window.innerWidth / 64, this.tileSize - window.innerWidth / 32, this.tileSize - window.innerWidth / 32, 255, 255, 255, this.opacity);
    CanvasUtil.writeText(canvas, 'luck', this.posX, this.posY);
  }
}
