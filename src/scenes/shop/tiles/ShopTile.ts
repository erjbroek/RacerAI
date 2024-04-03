import Drawable from '../../../drawables/Drawable.js';

export default abstract class ShopTile extends Drawable {
  public tier: number;

  public maxTier: number;

  public title: string;

  public description: string;

  public selected: boolean;

  public upgradeCost: number;

  public upgradeMultiplier: number;

  public blueValue: number;

  public opacity: number;

  public tileSize: number;

  public selectTile: boolean;

  public abstract level(): void;

  public abstract renderSelect(canvas: HTMLCanvasElement): void;
}
