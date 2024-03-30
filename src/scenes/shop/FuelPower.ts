import HandleStats from '../../ui/HandleStats.js';
import CanvasUtil from '../../utilities/CanvasUtil.js';
import ShopTile from './ShopTile.js';

export default class FuelPower extends ShopTile {
  public constructor() {
    super();
    this.maxTier = 5;
    this.blueValue = 0;
    this.opacity = 0.6;
    this.upgradeCost = 250;
    this.upgradeMultiplier *= 3;
    this.tileSize = window.innerWidth / 7.5;
    this.posX = window.innerWidth / 10 + 30;
    this.posY = window.innerHeight / 1.6 + 30;
  }

  /**
   * levels up launchpower
   */
  public level() {
    if (this.tier <= this.maxTier) {
      HandleStats.boostPowerTier += 1;
      this.tier += 1;
      this.blueValue += 50;
      this.upgradeCost *= this.upgradeMultiplier;
    }
  }

  /**
   * renders the shape and image
   * @param canvas is the selected canvas to render to
   */
  public override render(canvas: HTMLCanvasElement) {
    CanvasUtil.fillRectangle(canvas, this.posX, this.posY, this.tileSize, this.tileSize, 30, 175, this.blueValue, this.opacity);
    CanvasUtil.writeText(canvas, 'fuelpower', this.posX, this.posY);
  }
}
