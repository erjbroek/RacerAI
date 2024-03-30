import Drawable from '../../drawables/Drawable.js';

export default abstract class ShopTile extends Drawable {
  public tier: number;

  public maxTier: number;

  public upgradeCost: number;

  public upgradeMultiplier: number;

  public blueValue: number;

  public opacity: number;

  public tileSize: number;
}
