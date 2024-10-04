export default class MouseListener {
    static BUTTON_LEFT = 0;
    static BUTTON_MIDDLE = 1;
    static BUTTON_RIGHT = 2;
    static mouseCoordinates = { x: 0, y: 0 };
    static buttonDown = {};
    static buttonQueried = {};
    static buttonUp = {};
    static mouseUp = false;
    constructor(canvas, disableContextMenu = false) {
        canvas.addEventListener('mousemove', (ev) => {
            MouseListener.mouseCoordinates = {
                x: ev.offsetX,
                y: ev.offsetY,
            };
        });
        canvas.addEventListener('mousedown', (ev) => {
            MouseListener.buttonDown[ev.button] = true;
            MouseListener.mouseUp = false;
        });
        canvas.addEventListener('mouseup', (ev) => {
            MouseListener.buttonDown[ev.button] = false;
            MouseListener.buttonQueried[ev.button] = false;
            MouseListener.buttonUp[ev.button] = true;
            MouseListener.mouseUp = true;
        });
        if (disableContextMenu) {
            canvas.addEventListener('contextmenu', (ev) => {
                ev.preventDefault();
            });
        }
    }
    static isButtonDown(buttonCode = 0) {
        return this.buttonDown[buttonCode];
    }
    static buttonPressed(buttonCode) {
        if (MouseListener.buttonQueried[buttonCode] === true)
            return false;
        if (this.buttonDown[buttonCode] === true) {
            this.buttonQueried[buttonCode] = true;
            return true;
        }
        return false;
    }
    static areaPressed(buttonCode, posX, posY, width, height) {
        if (MouseListener.buttonPressed(buttonCode) && MouseListener.mouseCoordinates.x > posX && MouseListener.mouseCoordinates.y > posY && MouseListener.mouseCoordinates.x < posX + width && MouseListener.mouseCoordinates.y < posY + height) {
            return true;
        }
        return false;
    }
    static circlePressed(buttonCode, posX, posY, radius) {
        if (MouseListener.buttonPressed(buttonCode)) {
            const dx = MouseListener.mouseCoordinates.x - posX;
            const dy = MouseListener.mouseCoordinates.y - posY;
            return Math.sqrt(dx ** 2 + dy ** 2) < radius;
        }
        return false;
    }
    static circleDown(buttonCode, posX, posY, radius) {
        if (MouseListener.isButtonDown(buttonCode)) {
            const dx = MouseListener.mouseCoordinates.x - posX;
            const dy = MouseListener.mouseCoordinates.y - posY;
            return Math.sqrt(dx ** 2 + dy ** 2) < radius;
        }
        return false;
    }
    static circleCollision(posX, posY, radius) {
        const dx = MouseListener.mouseCoordinates.x - posX;
        const dy = MouseListener.mouseCoordinates.y - posY;
        return Math.sqrt(dx ** 2 + dy ** 2) < radius;
    }
    static areaDown(buttonCode, posX, posY, width, height) {
        if (MouseListener.isButtonDown(buttonCode) && MouseListener.mouseCoordinates.x > posX && MouseListener.mouseCoordinates.y > posY && MouseListener.mouseCoordinates.x < posX + width && MouseListener.mouseCoordinates.y < posY + height) {
            return true;
        }
        return false;
    }
    static mouseHover(posX, posY, width, height) {
        if (MouseListener.mouseCoordinates.x > posX && MouseListener.mouseCoordinates.y > posY && MouseListener.mouseCoordinates.x < posX + width && MouseListener.mouseCoordinates.y < posY + height) {
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=MouseListener.js.map