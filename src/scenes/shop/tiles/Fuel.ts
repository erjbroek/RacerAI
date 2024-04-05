import HandleStats from '../../../ui/HandleStats.js';
import HandleScore from '../../../ui/HandleScore.js';
import CanvasUtil from '../../../utilities/CanvasUtil.js';
import ShopTile from './ShopTile.js';

export default class Fuel extends ShopTile {
  public constructor() {
    super();
    this.tier = HandleStats.fuelTier;
    this.maxTier = 4;
    this.blueValue = 50 * HandleStats.fuelTier;
    this.opacity = 0.6;
    this.title = 'Fuel capacity';
    this.description = 'The quality of the fuel makes it more efficient to use with your backpack.<br>Upgrading the fuel means you can boost for longer.';
    this.upgradeCost = 50;
    this.upgradeMultiplier = 2.3;
    this.tileSize = window.innerWidth / 7.5;
    this.posX = window.innerWidth / 10 + window.innerWidth / 64 + (this.tileSize + window.innerWidth / 64) * 2;
    this.posY = window.innerHeight / 3.3 + 30;
    this.statTiers = [100, 120, 150, 180, 230];
  }

  /**
   * levels up launchpower
   */
  public override level() {
    if (HandleScore.duckDollars >= this.upgradeCost) {
      if (this.tier < this.maxTier) {
        HandleScore.duckDollars -= this.upgradeCost;
        HandleStats.fuelTier += 1;
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
    if (this.selectTile) {
      CanvasUtil.drawRectangle(canvas, this.posX, this.posY, this.tileSize, this.tileSize, 30, 30, 30, 0.4, 4);
    }
    CanvasUtil.fillRectangle(canvas, this.posX + window.innerWidth / 64, this.posY + window.innerWidth / 64, this.tileSize - window.innerWidth / 32, this.tileSize - window.innerWidth / 32, 255, 255, 255, this.opacity);
    CanvasUtil.writeText(canvas, 'fuel', this.posX, this.posY);
  }
}
