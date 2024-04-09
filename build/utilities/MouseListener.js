export default class MouseListener {
    static BUTTON_LEFT = 0;
    static BUTTON_MIDDLE = 1;
    static BUTTON_RIGHT = 2;
    mouseCoordinates = { x: 0, y: 0 };
    buttonDown = {};
    buttonQueried = {};
    constructor(canvas, disableContextMenu = false) {
        canvas.addEventListener('mousemove', (ev) => {
            this.mouseCoordinates = {
                x: ev.offsetX,
                y: ev.offsetY,
            };
        });
        canvas.addEventListener('mousedown', (ev) => {
            this.buttonDown[ev.button] = true;
        });
        canvas.addEventListener('mouseup', (ev) => {
            this.buttonDown[ev.button] = false;
            this.buttonQueried[ev.button] = false;
        });
        if (disableContextMenu) {
            canvas.addEventListener('contextmenu', (ev) => {
                ev.preventDefault();
            });
        }
    }
    isButtonDown(buttonCode = 0) {
        return this.buttonDown[buttonCode];
    }
    buttonPressed(buttonCode = 0) {
        if (this.buttonQueried[buttonCode] === true)
            return false;
        if (this.buttonDown[buttonCode] === true) {
            this.buttonQueried[buttonCode] = true;
            return true;
        }
        return false;
    }
    getMousePosition() {
        return this.mouseCoordinates;
    }
}
//# sourceMappingURL=MouseListener.js.map