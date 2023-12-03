import Drawable from '../drawables/Drawable.js';
import MouseListener from '../ui/MouseListener.js';

/**
 * Helper utlity class for working with the HTML Canvas Element.
 *
 * @version 1.1.1
 * @author Frans Blauw
 */
export default class CanvasUtil {
  /**
   * @param canvas the canvas on which will be drawn
   * @returns the 2D rendering context of the canvas
   */
  private static getCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (ctx === null) throw new Error('Canvas Rendering Context is null');
    return ctx;
  }

  /**
   * Fill the canvas with a colour
   *
   * @param canvas canvas that requires filling
   * @param colour the colour that the canvas will be filled with
   */
  public static fillCanvas(canvas: HTMLCanvasElement, colour: string = '#FF10F0'): void {
    const ctx: CanvasRenderingContext2D = CanvasUtil.getCanvasContext(canvas);
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = colour;
    ctx.fill();
  }

  /**
   * Loads a new image into an HTMLImageElement
   * WARNING: This happens async. Therefor the result might not immediately be visible
   *
   * @param source the path of the image to be loaded
   * @returns the image
   */
  public static loadNewImage(source: string): HTMLImageElement {
    const img = new Image();
    img.src = source;
    return img;
  }

  /**
   * Loads a new images into an HTMLImageElements
   * WARNING: This happens async. Therefor the result might not immediately be visible
   *
   * @param source the paths of the image to be loaded
   * @param sources
   * @param folder the folder in which the images are located, root by default
   * @returns the array of images
   */
  public static loadNewImages(sources: string[], folder?: string) {
    const images: HTMLImageElement[] = [];
    for (const source of sources) {
      images.push(CanvasUtil.loadNewImage(folder ? folder + source : source));
    }
    return images;
  }

  public static drawImage(
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    dx: number,
    dy: number,
    width: number = 0,
    height: number = 0,
    rotation: number = 0,
  ): void {
    const ctx: CanvasRenderingContext2D = CanvasUtil.getCanvasContext(canvas);

    if (width === 0) width = image.width;
    if (height === 0) height = image.height;

    // Save the current state of the canvas
    ctx.save();

    // Move the origin to the center of the image
    ctx.translate(dx + width / 2, dy + height / 2);

    // Rotate the canvas
    ctx.rotate((rotation * Math.PI) / 180);

    // Draw the image back to its original position
    ctx.drawImage(image, -width / 2, -height / 2, width, height);

    // Restore the previous state of the canvas
    ctx.restore();
  }

  /**
   * Clear the canvas, preparing for drawing
   *
   * @param canvas canvas to be cleared
   */
  public static clearCanvas(canvas: HTMLCanvasElement): void {
    const ctx: CanvasRenderingContext2D = CanvasUtil.getCanvasContext(canvas);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /**
   *
   * @param canvas Canvas to write to
   * @param text Text to write
   * @param xCoordinate x-coordinate of the text
   * @param yCoordinate y-coordinate of the text
   * @param alignment align of the text
   * @param fontFamily font family to use when writing text
   * @param fontSize font size in pixels
   * @param color colour of text to write
   */
  public static writeTextToCanvas(
    canvas: HTMLCanvasElement,
    text: string,
    xCoordinate: number,
    yCoordinate: number,
    alignment: CanvasTextAlign = 'center',
    fontFamily: string = 'sans-serif',
    fontSize: number = 20,
    color: string = 'red',
  ): void {
    // eslint-disable-next-line max-len
    CanvasUtil.writeText(canvas, text, xCoordinate, yCoordinate, alignment, fontFamily, fontSize, color);
  }

  /**
   *
   * @param canvas Canvas to write to
   * @param text Text to write
   * @param xCoordinate x-coordinate of the text
   * @param yCoordinate y-coordinate of the text
   * @param alignment align of the text
   * @param fontFamily font family to use when writing text
   * @param fontSize font size in pixels
   * @param color colour of text to write
   */
  public static writeText(
    canvas: HTMLCanvasElement,
    text: string,
    xCoordinate: number,
    yCoordinate: number,
    alignment: CanvasTextAlign = 'center',
    fontFamily: string = 'sans-serif',
    fontSize: number = 20,
    color: string = 'red',
  ): void {
    const ctx: CanvasRenderingContext2D = CanvasUtil.getCanvasContext(canvas);
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = alignment;
    ctx.fillText(text, xCoordinate, yCoordinate);
  }

  /**
   * Draw a circle outline on the canvas
   *
   * @param canvas the canvas to draw to
   * @param centerX the x-coordinate of the center of the circle
   * @param centerY the y-coordinate of the center of the circle
   * @param radius the radius of the circle
   * @param color the color of the circle outline
   */
  public static drawCircle(
    canvas: HTMLCanvasElement,
    centerX: number,
    centerY: number,
    radius: number,
    color: string = 'red',
  ): void {
    const ctx: CanvasRenderingContext2D = CanvasUtil.getCanvasContext(canvas);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }

  /**
   * Draw a rectangle outline to the canvas
   *
   * @param canvas the canvas to draw to
   * @param dx the x-coordinate of the rectangle's left left corner
   * @param dy the y-coordinate of the rectangle's left left corner
   * @param width the width of the rectangle from x to the right
   * @param height the height of the rectrangle from y downwards
   * @param color the color of the rectangle outline
   */
  public static drawRectangle(
    canvas: HTMLCanvasElement,
    dx: number,
    dy: number,
    width: number,
    height: number,
    color: string = 'red',
  ): void {
    const ctx: CanvasRenderingContext2D = CanvasUtil.getCanvasContext(canvas);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.rect(dx, dy, width, height);
    ctx.stroke();
  }

  /**
   * Draw line to the canvas
   *
   * @param canvas selected canvas
   * @param x1 x position of the starting point of drawn line
   * @param y1 y position of the starting point of drawn line
   * @param x2 x position of the ending point of drawn line
   * @param y2 y position of the ennding point of drawn line
   * @param color selected color of the line
   */
  public static drawLine(canvas: HTMLCanvasElement, x1: number, y1: number, x2: number, y2: number, color: string = 'red'): void {
    const ctx: CanvasRenderingContext2D = CanvasUtil.getCanvasContext(canvas);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  /**
   * Draw a filled circle on the canvas
   *
   * @param canvas the canvas to draw to
   * @param centerX the x-coordinate of the center of the circle
   * @param centerY the y-coordinate of the center of the circle
   * @param radius the radius of the circle
   * @param color the color of the circle
   */
  public static fillCircle(
    canvas: HTMLCanvasElement,
    centerX: number,
    centerY: number,
    radius: number,
    color: string = 'red',
  ): void {
    const ctx: CanvasRenderingContext2D = CanvasUtil.getCanvasContext(canvas);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  /**
   * Draw a filled rectangle to the canvas
   *
   * @param canvas the canvas to draw to
   * @param dx the x-coordinate of the rectangle's left left corner
   * @param dy the y-coordinate of the rectangle's left left corner
   * @param width the width of the rectangle from x to the right
   * @param height the height of the rectrangle from y downwards
   * @param color the color of the rectangle
   */
  public static fillRectangle(
    canvas: HTMLCanvasElement,
    dx: number,
    dy: number,
    width: number,
    height: number,
    color: string = 'red',
  ): void {
    const ctx: CanvasRenderingContext2D = CanvasUtil.getCanvasContext(canvas);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.rect(dx, dy, width, height);
    ctx.fill();
  }

  /**
   * Rotate an image on an HTML5 canvas.
   *
   * @param canvas the canvas to draw to
   * @param image the image to rotate
   * @param degrees the degrees to rotate the image
   */
  public static rotateImage(
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    degrees: number,
  ): void {
    const ctx: CanvasRenderingContext2D = CanvasUtil.getCanvasContext(canvas);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((degrees * Math.PI) / 180);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.restore();
  }

  /**
   * @returns boolean
   * @param object1X first object x position
   * @param object1Y first object y position
   * @param object1Width width of the first object
   * @param object1Height height of the first object
   * @param object2X x position of the second object
   * @param object2Y y position of the second object
   * @param object2Width width of the second object
   * @param object2Height height of the second object
   */
  public static collidesWith(object1X: number, object1Y: number, object1Width: number, object1Height: number, object2X: number, object2Y: number, object2Width: number, object2Height: number): boolean {
    if (
      object1X < object2X + object2Width
      && object1X + object1Width > object2X
      && object1Y < object2Y + object2Height
      && object1Y + object1Height > object2Y
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
  public static mouseHover(item: Drawable, mouse: MouseListener): boolean {
    if (
      mouse.getMousePosition().x > item.posX
      && mouse.getMousePosition().y > item.posY
      && mouse.getMousePosition().x < item.posX + item.image.width
      && mouse.getMousePosition().y < item.posY + item.image.height
    ) {
      return true;
    }
    return false;
  }
}
