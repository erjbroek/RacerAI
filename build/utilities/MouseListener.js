export default class MouseListener {
    static BUTTON_LEFT = 0;
    static BUTTON_MIDDLE = 1;
    static BUTTON_RIGHT = 2;
    static mouseCoordinates = { x: 0, y: 0 };
    static buttonDown = {};
    static buttonQueried = {};
    constructor(canvas, disableContextMenu = false) {
        canvas.addEventListener('mousemove', (ev) => {
            MouseListener.mouseCoordinates = {
                x: ev.offsetX,
                y: ev.offsetY,
            };
        });
        canvas.addEventListener('mousedown', (ev) => {
            MouseListener.buttonDown[ev.button] = true;
        });
        canvas.addEventListener('mouseup', (ev) => {
            MouseListener.buttonDown[ev.button] = false;
            MouseListener.buttonQueried[ev.button] = false;
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
    static buttonPressed(buttonCode = 0) {
        if (MouseListener.buttonQueried[buttonCode] === true)
            return false;
        if (this.buttonDown[buttonCode] === true) {
            this.buttonQueried[buttonCode] = true;
            return true;
        }
        return false;
    }
    static areaPressed(posX, posY, width, height) {
        if (MouseListener.isButtonDown(0)
            && MouseListener.mouseCoordinates.x > posX
            && MouseListener.mouseCoordinates.y > posY
            && MouseListener.mouseCoordinates.x < posX + width
            && MouseListener.mouseCoordinates.y < posY + height) {
            return true;
        }
        return false;
    }
    static mouseHover(posX, posY, width, height) {
        if (MouseListener.mouseCoordinates.x > posX
            && MouseListener.mouseCoordinates.y > posY
            && MouseListener.mouseCoordinates.x < posX + width
            && MouseListener.mouseCoordinates.y < posY + height) {
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=MouseListener.js.map