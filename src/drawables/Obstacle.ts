import Drawable from './Drawable.js';

export default class Obstacle extends Drawable {
  private speedModifierX: number;

  private speedModifierY: number;

  private scoreMultipler: number;

  private constructor() {
    super();
    this.posX = 500;
    this.posY = 500;
  }
}
