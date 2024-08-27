export default class KeyListener {
    static KEY_ENTER = 'Enter';
    static KEY_SHIFT_LEFT = 'ShiftLeft';
    static KEY_SHIFT_RIGHT = 'ShiftRight';
    static KEY_CTRL_LEFT = 'ControlLeft';
    static KEY_CTRL_RIGHT = 'ControlRight';
    static KEY_ALT_LEFT = 'AltLeft';
    static KEY_ALT_RIGHT = 'AltRight';
    static KEY_ESC = 'Escape';
    static KEY_SPACE = 'Space';
    static KEY_LEFT = 'ArrowLeft';
    static KEY_UP = 'ArrowUp';
    static KEY_RIGHT = 'ArrowRight';
    static KEY_DOWN = 'ArrowDown';
    static KEY_DEL = 'Delete';
    static KEY_1 = 'Digit1';
    static KEY_2 = 'Digit2';
    static KEY_3 = 'Digit3';
    static KEY_4 = 'Digit4';
    static KEY_5 = 'Digit5';
    static KEY_6 = 'Digit6';
    static KEY_7 = 'Digit7';
    static KEY_8 = 'Digit8';
    static KEY_9 = 'Digit9';
    static KEY_0 = 'Digit0';
    static KEY_A = 'KeyA';
    static KEY_B = 'KeyB';
    static KEY_C = 'KeyC';
    static KEY_D = 'KeyD';
    static KEY_E = 'KeyE';
    static KEY_F = 'KeyF';
    static KEY_G = 'KeyG';
    static KEY_H = 'KeyH';
    static KEY_I = 'KeyI';
    static KEY_J = 'KeyJ';
    static KEY_K = 'KeyK';
    static KEY_L = 'KeyL';
    static KEY_M = 'KeyM';
    static KEY_N = 'KeyN';
    static KEY_O = 'KeyO';
    static KEY_P = 'KeyP';
    static KEY_Q = 'KeyQ';
    static KEY_R = 'KeyR';
    static KEY_S = 'KeyS';
    static KEY_T = 'KeyT';
    static KEY_U = 'KeyU';
    static KEY_V = 'KeyV';
    static KEY_W = 'KeyW';
    static KEY_X = 'KeyX';
    static KEY_Y = 'KeyY';
    static KEY_Z = 'KeyZ';
    static keyDown = {};
    static keyPressedQueried = {};
    constructor() {
        window.addEventListener('keydown', (ev) => {
            KeyListener.keyDown[ev.code] = true;
        });
        window.addEventListener('keyup', (ev) => {
            KeyListener.keyDown[ev.code] = false;
            KeyListener.keyPressedQueried[ev.code] = false;
        });
    }
    static isKeyDown(keyCode) {
        return this.keyDown[keyCode] === true;
    }
    static keyPressed(keyCode) {
        if (this.keyPressedQueried[keyCode] === true)
            return false;
        if (this.keyDown[keyCode] === true) {
            this.keyPressedQueried[keyCode] = true;
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=KeyListener.js.map