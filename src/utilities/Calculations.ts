import MouseListener from './MouseListener.js';

export default class Calculations {

  public static mouseCircleCollision(posX: number, posY: number, radius: number) {
    if (Math.sqrt(((MouseListener.mouseCoordinates.x - posX) ** 2) + ((MouseListener.mouseCoordinates.y - posY) ** 2)) <= radius) {
      return true;
    } return false;
  }
}
