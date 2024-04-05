import HandleStats from '../../../ui/HandleStats.js';
import HandleScore from '../../../ui/HandleScore.js';
import CanvasUtil from '../../../utilities/CanvasUtil.js';
import ShopTile from './ShopTile.js';

export default class Power extends ShopTile {
  public constructor() {
    super();
    this.tier = HandleStats.launchPowerTier;
    this.maxTier = 5;
    this.blueValue = 50 * HandleStats.launchPowerTier;
    this.opacity = 0.6;
    this.title = 'Launch power';
    this.description = 'Whenever you start flying as a duck, you use your strong wings to launch <br>ourself as fast as possible. Upgrading this will guarantee faster launch<br>speeds!';
    this.upgradeCost = 50;
    this.upgradeMultiplier = 1.9;
    this.tileSize = window.innerWidth / 7.5;
    this.posX = window.innerWidth / 10 + window.innerWidth / 64;
    this.posY = window.innerHeight / 3.3 + 30;
    this.statTiers = [0, 0.1, 0.2, 0.33, 0.5, 0.75];
  }

  /**
   * levels up launchpower
   */
  public override level() {
    if (HandleScore.duckDollars >= this.upgradeCost) {
      if (this.tier < this.maxTier) {
        HandleStats.launchPowerTier += 1;
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
    CanvasUtil.writeText(canvas, 'power', this.posX, this.posY);
  }
}
