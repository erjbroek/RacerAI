import HandleStats from '../../../ui/HandleStats.js';
import CanvasUtil from '../../../utilities/CanvasUtil.js';
import ShopTile from './ShopTile.js';

export default class Luck extends ShopTile {
  public constructor() {
    super();
    this.tier = HandleStats.luckTier;
    this.maxTier = 5;
    this.blueValue = 0;
    this.opacity = 0.6;
    this.title = 'Luck';
    this.description = 'An increase in luck means you find more rare coins and less bad obstacles/ enemies';
    this.upgradeCost = 200;
    this.upgradeMultiplier *= 3.5;
    this.tileSize = window.innerWidth / 7.5;
    this.posX = window.innerWidth / 10 + 30 + this.tileSize + 30;
    this.posY = window.innerHeight / 3.3 + 30;
  }

  /**
   * levels up launchpower
   */
  public level() {
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
    CanvasUtil.fillRectangle(canvas, this.posX + 30, this.posY + 30, this.tileSize - 60, this.tileSize - 60, 255, 255, 255, this.opacity);
    CanvasUtil.writeText(canvas, 'luck', this.posX, this.posY);
  }
}
