import HandleStats from '../../../ui/HandleStats.js';
import HandleScore from '../../../ui/HandleScore.js';
import CanvasUtil from '../../../utilities/CanvasUtil.js';
import ShopTile from './ShopTile.js';

export default class FuelPower extends ShopTile {
  public constructor() {
    super();
    this.tier = HandleStats.fuelPowerTier;
    this.maxTier = 5;
    this.blueValue = (255 / this.maxTier) * this.tier;
    this.opacity = 0.6;
    this.title = 'Jetpack power';
    this.description = "The jetpack makes you fly in the direction you're facing.<br>Upgrading this means you get a better jetpack, resulating in higher speeds!";
    this.emptySlot = CanvasUtil.loadNewImage('./assets/emptyslot.png');
    this.upgradeCost = 250;
    this.upgradeMultiplier = 2.5;
    this.tileSize = window.innerWidth / 7.5;
    this.posX = window.innerWidth / 10 + window.innerWidth / 64;
    this.posY = window.innerHeight / 1.6 + 30;
    this.statTiers = [1, 1.1, 1.2, 1.35, 1.5, 1.6];
  }

  /**
   * levels up launchpower
   */
  public override level() {
    if (HandleScore.duckDollars >= this.upgradeCost) {
      if (this.tier < this.maxTier) {
        HandleStats.fuelPowerTier += 1;
        HandleStats.fuelPower = this.statTiers[HandleStats.fuelPowerTier];
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
    CanvasUtil.writeText(canvas, 'fuelpower', this.posX, this.posY);
    CanvasUtil.drawImage(canvas, this.emptySlot, this.posX + this.tileSize / 2 - this.emptySlot.width / 4, this.posY + this.tileSize / 2 - this.emptySlot.height / 4 + canvas.height / 30, this.emptySlot.width / 2, this.emptySlot.height / 2, 0, 0.3);
  }
}
