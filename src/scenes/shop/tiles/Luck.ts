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
    this.blueValue = (255 / this.maxTier) * this.tier;
    this.opacity = 0.6;
    this.title = 'Luck';
    this.description = 'An increase in luck means you find better coins and face less obstacles<br>in the way.';
    this.image = CanvasUtil.loadNewImage('./assets/clover1.png');
    this.emptySlot = CanvasUtil.loadNewImage('./assets/emptyslot.png');
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
        HandleStats.luck = this.luckStats[HandleStats.luckTier];
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
    CanvasUtil.fillRectangle(canvas, this.posX, this.posY, this.tileSize, this.tileSize, 30, 175, this.blueValue, this.opacity, 20);
    CanvasUtil.fillRectangle(canvas, this.posX + window.innerWidth / 64, this.posY + window.innerWidth / 64, this.tileSize - window.innerWidth / 32, this.tileSize - window.innerWidth / 32, 255, 255, 255, this.opacity);
    CanvasUtil.writeText(canvas, 'luck', this.posX, this.posY);
    CanvasUtil.drawImage(canvas, this.emptySlot, this.posX + this.tileSize / 2 - this.emptySlot.width / 4, this.posY + this.tileSize / 2 - this.emptySlot.height / 4 + canvas.height / 30, this.emptySlot.width / 2, this.emptySlot.height / 2, 0, 0.3);
    if (HandleStats.luckTier >= 5) {
      this.image = CanvasUtil.loadNewImage('./assets/clover5.png');
      CanvasUtil.drawImage(canvas, this.image, this.posX + this.tileSize / 2 - this.image.width / 4, this.posY + this.tileSize / 2 - this.image.height / 4, this.image.width / 2, this.image.height / 2, 0, 1);
    } else if (HandleStats.luckTier >= 4) {
      this.image = CanvasUtil.loadNewImage('./assets/clover4.png');
      CanvasUtil.drawImage(canvas, this.image, this.posX + this.tileSize / 2 - this.image.width / 4, this.posY + this.tileSize / 2 - this.image.height / 4, this.image.width / 2, this.image.height / 2, 0, 1);
    } else if (HandleStats.luckTier >= 3) {
      this.image = CanvasUtil.loadNewImage('./assets/clover3.png');
      CanvasUtil.drawImage(canvas, this.image, this.posX + this.tileSize / 2 - this.image.width / 4, this.posY + this.tileSize / 2 - this.image.height / 4, this.image.width / 2, this.image.height / 2, 0, 1);
    } else if (HandleStats.luckTier >= 2) {
      this.image = CanvasUtil.loadNewImage('./assets/clover2.png');
      CanvasUtil.drawImage(canvas, this.image, this.posX + this.tileSize / 2 - this.image.width / 4, this.posY + this.tileSize / 2 - this.image.height / 4, this.image.width / 2, this.image.height / 2, 0, 1);
    } else if (HandleStats.luckTier >= 1) {
      this.image = CanvasUtil.loadNewImage('./assets/clover1.png');
      CanvasUtil.drawImage(canvas, this.image, this.posX + this.tileSize / 2 - this.image.width / 4, this.posY + this.tileSize / 2 - this.image.height / 4, this.image.width / 2, this.image.height / 2, 0, 1);
    }
  }
}
