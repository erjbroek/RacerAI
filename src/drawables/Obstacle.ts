import Drawable from './Drawable.js';
import Player from './Player.js';

export default abstract class Obstacle extends Drawable {
  private speedModifierX: number;

  public speedModifierY: number;

  private scoreMultipler: number;

  /**
   * @param xSpeed horizontal speed the item will move at
   * @param ySpeed vertical speed the item will move at
   */
  public move(xSpeed: number, ySpeed: number) {
    this.posX -= xSpeed;
    this.posY -= ySpeed;
  }

  /**
   *@param player is the player it collided with
   */
  public collides(player: Player) {
    player.xSpeed -= this.speedModifierX;
    player.ySpeed -= this.speedModifierY;
  }

  /**
   * @param player is the player that bounces if the item is touched
   *
   * bounces the player upwards if this player touches the item
   */
  public bounce(player: Player) {
    player.ySpeed *= -1;
    player.ySpeed -= this.speedModifierY;
  }
}
