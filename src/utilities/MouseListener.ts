import Drawable from '../drawables/Drawable.js';

export interface MouseCoordinates {
  x: number;
  y: number;
}

export default class MouseListener {
  public static readonly BUTTON_LEFT = 0;

  public static readonly BUTTON_MIDDLE = 1;

  public static readonly BUTTON_RIGHT = 2;

  public static mouseCoordinates: MouseCoordinates = { x: 0, y: 0 };

  private static buttonDown: Record<number, boolean> = {};

  private static buttonQueried: Record<number, boolean> = {};

  /**
   *
   * @param canvas the canvas element to which the relative coordinates should given
   * @param disableContextMenu true to disable the context (right click) menu. Default: false
   */
  public constructor(canvas: HTMLCanvasElement, disableContextMenu: boolean = false) {
    canvas.addEventListener('mousemove', (ev: MouseEvent) => {
      MouseListener.mouseCoordinates = {
        x: ev.offsetX,
        y: ev.offsetY,
      };
    });
    canvas.addEventListener('mousedown', (ev: MouseEvent) => {
      MouseListener.buttonDown[ev.button] = true;
    });
    canvas.addEventListener('mouseup', (ev: MouseEvent) => {
      MouseListener.buttonDown[ev.button] = false;
      MouseListener.buttonQueried[ev.button] = false;
    });
    if (disableContextMenu) {
      canvas.addEventListener('contextmenu', (ev: MouseEvent) => {
        ev.preventDefault();
      });
    }
  }

  /**
   * Checks whether a mouse button is currently down.
   *
   * @param buttonCode the mouse button to check
   * @returns `true` when the specified button is currently down
   */
  public static isButtonDown(buttonCode: number = 0): boolean {
    return this.buttonDown[buttonCode];
  }

  /**
   *
   * @param buttonCode the mouse button to check
   * @returns `true` when the specified button was pressed
   */
  public static buttonPressed(buttonCode: number = 0): boolean {
    if (MouseListener.buttonQueried[buttonCode] === true) return false;
    if (this.buttonDown[buttonCode] === true) {
      this.buttonQueried[buttonCode] = true;
      return true;
    }
    return false;
  }

  /**
   * Returns the current mouse coordinates in an object
   *
   * @returns MouseCoordinates object with current position of mouse
   */
  /**
   * @returns boolean if the mouse clicks between the specified positions
   * @param mouse the mouselistener used to check mouse position and button press
   * @param posX the x-coordinate of the top-left corner of the rectangle
   * @param posY the y-coordinate of the top-left corner of the rectangle
   * @param width the width of the rectangle
   * @param height the height of the rectangle
   */
  public static areaPressed(posX: number, posY: number, width: number, height: number): boolean {
    if (
      MouseListener.buttonPressed(0)
      && MouseListener.mouseCoordinates.x > posX
      && MouseListener.mouseCoordinates.y > posY
      && MouseListener.mouseCoordinates.x < posX + width
      && MouseListener.mouseCoordinates.y < posY + height
    ) {
      return true;
    }
    return false;
  }

  /**
   * @returns boolean
   * @param item the selected item to check for hovering
   * @param mouse mouselistener used to check mouse position
   */
  public static mouseHover(posX: number, posY: number, width: number, height: number): boolean {
    if (
      MouseListener.mouseCoordinates.x > posX
      && MouseListener.mouseCoordinates.y > posY
      && MouseListener.mouseCoordinates.x < posX + width
      && MouseListener.mouseCoordinates.y < posY + height
    ) {
      return true;
    }
    return false;
  }
}
