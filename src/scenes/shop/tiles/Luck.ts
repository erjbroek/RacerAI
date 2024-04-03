import HandleStats from '../../../ui/HandleStats.js';
import CanvasUtil from '../../../utilities/CanvasUtil.js';
import ShopTile from './ShopTile.js';

export default class Luck extends ShopTile {
  public constructor() {
    super();
    this.tier = HandleStats.luckTier;
    this.maxTier = 5;
    this.blueValue = 50 * HandleStats.luckTier;
    this.opacity = 0.6;
    this.title = 'Luck';
    this.description = 'An increase in luck means you find more rare coins and less bad obstacles/ enemies';
    this.upgradeCost = 200;
    this.upgradeMultiplier *= 3.5;
    this.tileSize = window.innerWidth / 7.5;
    this.posX = window.innerWidth / 10 + this.tileSize + window.innerWidth / 32;
    this.posY = window.innerHeight / 3.3 + 30;
    this.selectTile = false;
  }

  /**
   * levels up launchpower
   */
  public override level() {
    if (this.tier <= this.maxTier) {
      HandleStats.luckTier += 1;
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
    CanvasUtil.fillRectangle(canvas, this.posX + window.innerWidth / 64, this.posY + window.innerWidth / 64, this.tileSize - window.innerWidth / 32, this.tileSize - window.innerWidth / 32, 255, 255, 255, this.opacity);
    CanvasUtil.writeText(canvas, 'luck', this.posX, this.posY);
  }

  /**
   *
   */
  public renderSelect(canvas: HTMLCanvasElement) {
    CanvasUtil.drawRectangle(canvas, this.posX, this.posY, this.tileSize, this.tileSize, 30, 30, 30, 0.4, 4);
  }
}
