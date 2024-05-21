import MouseListener from './MouseListener.js';
export default class Calculations {
    static mouseCircleCollision(posX, posY, radius) {
        if (Math.sqrt(((MouseListener.mouseCoordinates.x - posX) ** 2) + ((MouseListener.mouseCoordinates.y - posY) ** 2)) <= radius) {
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=Calculations.js.map