import HandleStats from '../../../ui/HandleStats.js';
import HandleScore from '../../../ui/HandleScore.js';
import CanvasUtil from '../../../utilities/CanvasUtil.js';
import ShopTile from './ShopTile.js';

export default class Resistance extends ShopTile {
  public constructor() {
    super();
    this.tier = HandleStats.airResistanceTier;
    this.maxTier = 4;
    this.blueValue = (255 / this.maxTier) * this.tier;
    this.opacity = 0.6;
    this.title = 'Air resistance';
    this.description = 'Whenever flying, mister duck will experience ait resistance. Upgrading this<br>makes mister duck more aerodynamic resulting in further flight.';
    this.upgradeCost = 100;
    this.upgradeMultiplier = 1.9;
    this.tileSize = window.innerWidth / 7.5;
    this.posX = window.innerWidth / 10 + this.tileSize + window.innerWidth / 32;
    this.posY = window.innerHeight / 1.6 + 30;
    this.statTiers = [1, 0.9, 0.75, 0.65, 0.5];
  }

  /**
   * levels up launchpower
   */
  public override level() {
    if (HandleScore.duckDollars >= this.upgradeCost) {
      if (this.tier < this.maxTier) {
        HandleStats.airResistanceTier += 1;
        HandleStats.airResistance = this.statTiers[HandleStats.airResistanceTier];
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
    CanvasUtil.writeText(canvas, 'air resistance', this.posX, this.posY);
  }
}
