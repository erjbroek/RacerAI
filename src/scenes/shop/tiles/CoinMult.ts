import HandleStats from '../../../ui/HandleStats.js';
import HandleScore from '../../../ui/HandleScore.js';
import CanvasUtil from '../../../utilities/CanvasUtil.js';
import ShopTile from './ShopTile.js';

export default class CoinMult extends ShopTile {
  public constructor() {
    super();
    this.tier = HandleStats.coinMultTier;
    this.maxTier = 4;
    this.blueValue = (255 / this.maxTier) * this.tier;
    this.opacity = 0.6;
    this.title = 'Coin duplication';
    this.description = 'With the use of advanced technologies, all coins gathered after a run can<br>are able to be duplicated. Upgrading this will increase the amount of coins<br>that will be duplicated';
    this.emptySlot = CanvasUtil.loadNewImage('./assets/emptyslot.png');
    this.upgradeCost = 350;
    this.upgradeMultiplier = 2.5;
    this.tileSize = window.innerWidth / 7.5;
    this.posX = window.innerWidth / 10 + window.innerWidth / 64 + (this.tileSize + window.innerWidth / 64) * 2;
    this.posY = window.innerHeight / 1.6 + 30;
    this.statTiers = [1, 1.4, 1.7, 2.1, 2.8];
  }

  /**
   * levels up launchpower
   */
  public override level() {
    if (HandleScore.duckDollars >= this.upgradeCost) {
      if (this.tier < this.maxTier) {
        HandleScore.duckDollars -= this.upgradeCost;
        HandleStats.coinMultTier += 1;
        HandleStats.coinMult = this.statTiers[HandleStats.coinMultTier];
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
    if (this.selectTile) {
      CanvasUtil.drawRectangle(canvas, this.posX, this.posY, this.tileSize, this.tileSize, 30, 30, 30, 0.4, 4);
    }
    CanvasUtil.fillRectangle(canvas, this.posX + window.innerWidth / 64, this.posY + window.innerWidth / 64, this.tileSize - window.innerWidth / 32, this.tileSize - window.innerWidth / 32, 255, 255, 255, this.opacity);
    CanvasUtil.writeText(canvas, 'coin multiplier', this.posX, this.posY);
    CanvasUtil.drawImage(canvas, this.emptySlot, this.posX + this.tileSize / 2 - this.emptySlot.width / 4, this.posY + this.tileSize / 2 - this.emptySlot.height / 4 + canvas.height / 30, this.emptySlot.width / 2, this.emptySlot.height / 2, 0, 0.3);
  }
}
