import Drawable from "../drawables/Drawable.js";
import Player from "../drawables/Player.js";

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
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (ctx === null) throw new Error("Canvas Rendering Context is null");
    return ctx;
  }

  /**
   * Fill the canvas with a colour
   *
   * @param canvas canvas that requires filling
   * @param colour the colour that the canvas will be filled with
   */
  public static fillCanvas(canvas: HTMLCanvasElement, colour: string = "#FF10F0"): void {
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
   * @param sources the sources of multiple images
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

  public static drawImage(canvas: HTMLCanvasElement, image: HTMLImageElement, dx: number, dy: number, width: number = 0, height: number = 0, rotation: number = 0, opacity: number = 1): void {
    const ctx: CanvasRenderingContext2D = CanvasUtil.getCanvasContext(canvas);

    if (width === 0) width = image.width;
    if (height === 0) height = image.height;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(dx + width / 2, dy + height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(image, -width / 2, -height / 2, width, height);
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
  public static writeText(canvas: HTMLCanvasElement, text: string, xCoordinate: number, yCoordinate: number, alignment: CanvasTextAlign = "center", fontFamily: string = "sans-serif", fontSize: number = 20, color: string = "red"): void {
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
  public static drawCircle(canvas: HTMLCanvasElement, centerX: number, centerY: number, radius: number, red: number = 255, green: number = 255, blue: number = 255, opacity: number = 1): void {
    const ctx: CanvasRenderingContext2D = CanvasUtil.getCanvasContext(canvas);
    ctx.beginPath();
    ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }

  /**
   * Draw a rectangle outline with optional border radius to the canvas
   *
   * @param canvas the canvas to draw to
   * @param dx the x-coordinate of the rectangle's top-left corner
   * @param dy the y-coordinate of the rectangle's top-left corner
   * @param width the width of the rectangle
   * @param height the height of the rectangle
   * @param red is the red color value of the rectangle
   * @param green is the green color value of the rectangle
   * @param blue is the blue color value of the rectangle
   * @param opacity is the opacity of the rectangle
   * @param lineWidth is the width of the border
   * @param borderRadius is the border radius of the rectangle
   */
  public static drawRectangle(canvas: HTMLCanvasElement, dx: number, dy: number, width: number, height: number, red: number = 255, green: number = 255, blue: number = 255, opacity: number = 1, lineWidth: number = 1, borderRadius: number = 0): void {
    const ctx: CanvasRenderingContext2D = CanvasUtil.getCanvasContext(canvas);
    ctx.beginPath();
    ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
    ctx.lineWidth = lineWidth;

    // Top left corner
    ctx.moveTo(dx + borderRadius, dy);
    ctx.arcTo(dx + width, dy, dx + width, dy + height, borderRadius);

    // Top right corner
    ctx.arcTo(dx + width, dy + height, dx, dy + height, borderRadius);

    // Bottom right corner
    ctx.arcTo(dx, dy + height, dx, dy, borderRadius);

    // Bottom left corner
    ctx.arcTo(dx, dy, dx + borderRadius, dy, borderRadius);

    ctx.closePath();
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
   * @param red the red color value of the line
   * @param green the green color value of the line
   * @param blue the blue color value of the line
   * @param opacity the opacity of the line
   */
  public static drawLine(canvas: HTMLCanvasElement, x1: number, y1: number, x2: number, y2: number, red: number = 255, green: number = 255, blue: number = 255, opacity: number = 1, lineWidth: number = 1): void {
    const ctx: CanvasRenderingContext2D = CanvasUtil.getCanvasContext(canvas);
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
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
   * @param red the red color value
   * @param green the green color value
   * @param blue the blue color value
   * @param opacity the opacity
   */
  public static fillCircle(canvas: HTMLCanvasElement, centerX: number, centerY: number, radius: number, red: number = 255, green: number = 255, blue: number = 255, opacity: number = 1): void {
    const ctx: CanvasRenderingContext2D = CanvasUtil.getCanvasContext(canvas);
    ctx.beginPath();
    ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
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
   * @param red is the red color value of the rectangle
   * @param green is the green color value of the rectangle
   * @param blue is the blue color value of the rectangle
   * @param opacity is the opacity of the rectangle
   * @param borderRadius is the border radius of the rectangle
   */
  public static fillRectangle(canvas: HTMLCanvasElement, dx: number, dy: number, width: number, height: number, red: number = 255, green: number = 255, blue: number = 255, opacity: number = 1, borderRadius: number = 0): void {
    const ctx: CanvasRenderingContext2D = CanvasUtil.getCanvasContext(canvas);
    ctx.beginPath();

    ctx.moveTo(dx + borderRadius, dy);
    ctx.lineTo(dx + width - borderRadius, dy);
    ctx.arcTo(dx + width, dy, dx + width, dy + borderRadius, borderRadius);
    ctx.lineTo(dx + width, dy + height - borderRadius);
    ctx.arcTo(dx + width, dy + height, dx + width - borderRadius, dy + height, borderRadius);
    ctx.lineTo(dx + borderRadius, dy + height);
    ctx.arcTo(dx, dy + height, dx, dy + height - borderRadius, borderRadius);
    ctx.lineTo(dx, dy + borderRadius);
    ctx.arcTo(dx, dy, dx + borderRadius, dy, borderRadius);
    ctx.closePath();
    ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
    ctx.fill();
  }

  /**
   * Rotate an image on an HTML5 canvas.
   *
   * @param canvas the canvas to draw to
   * @param image the image to rotate
   * @param degrees the degrees to rotate the image
   */
  public static rotateImage(canvas: HTMLCanvasElement, image: HTMLImageElement, degrees: number): void {
    const ctx: CanvasRenderingContext2D = CanvasUtil.getCanvasContext(canvas);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((degrees * Math.PI) / 180);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.restore();
  }

  /**
   * @returns boolean
   * @param player is the player that the collision is checked for
   * @param item is the item that is checked for if the player collides with
   */
  public static collidesWith(player: Player, item: Drawable): boolean {
    if (player.posX < item.posX + item.image.width && player.posX + player.image.width > item.posX + item.image.width / 3 && player.posY < item.posY + item.image.height && player.posY + player.image.height > item.posY) {
      return true;
    }
    return false;
  }
}
