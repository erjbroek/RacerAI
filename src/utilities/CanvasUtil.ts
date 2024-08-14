import DisplayCar from '../NetworkAlgoritm/DisplayCar.js';
import Car from '../Car.js';
import NetCar from '../NetworkAlgoritm/NetCar.js';

/**
 * Helper utlity class for working with the HTML Canvas Element.
 *
 * @version 1.1.1
 * @author Frans Blauw
 */
export default class CanvasUtil {
  private static canvas: HTMLCanvasElement;

  private static ctx: CanvasRenderingContext2D;

  /**
   * @param canvas the canvas on which will be drawn
   * @returns the 2D rendering context of the canvas
   */
  private static getCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (ctx === null) throw new Error('Canvas Rendering Context is null');
    return ctx;
  }

  public static setCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    if (this.ctx === null) throw new Error('Canvas Rendering Context is null');
  }

  public static getCanvas(): HTMLCanvasElement {
    if (!this.canvas) throw new Error('Canvas is not set');
    return this.canvas;
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

  public static drawImage(canvas: HTMLCanvasElement, image: HTMLImageElement, dx: number, dy: number, width: number = 0, height: number = 0, rotation: number = 0, opacity?: number): void {
    const ctx: CanvasRenderingContext2D = CanvasUtil.getCanvasContext(canvas);

    if (width === 0) width = image.width;
    if (height === 0) height = image.height;

    ctx.save();

    // Check if opacity is explicitly provided
    if (opacity !== undefined) {
      ctx.globalAlpha = opacity;
    }

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
   * Write text to the canvas, with line breaks for each occurrence of "<br>"
   *
   * @param canvas Canvas to write to
   * @param text Text to write
   * @param xCoordinate x-coordinate of the text
   * @param yCoordinate y-coordinate of the text
   * @param alignment align of the text
   * @param fontFamily font family to use when writing text
   * @param fontSize font size in pixels
   * @param color colour of text to write
   * @param fontWeight
   */
  public static writeText(canvas: HTMLCanvasElement, text: string, xCoordinate: number, yCoordinate: number, alignment: CanvasTextAlign = 'center', fontFamily: string = 'sans-serif', fontSize: number = 20, color: string = 'red', fontWeight: number = 10): void {
    const ctx: CanvasRenderingContext2D = CanvasUtil.getCanvasContext(canvas);
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = alignment;

    // each time <br> is found in the text, a line break is made
    const lines = text.split('<br>');
    let currentY = yCoordinate;

    for (const line of lines) {
      ctx.fillText(line, xCoordinate, currentY);
      currentY += fontSize;
    }
  }

  /**
   * Draw a circle outline on the canvas
   *
   * @param canvas the canvas to draw to
   * @param centerX the x-coordinate of the center of the circle
   * @param centerY the y-coordinate of the center of the circle
   * @param radius the radius of the circle
   * @param red red value of color
   * @param green green value of color
   * @param blue blue value of volor
   * @param opacity opacity of the circle
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
   * @param lineWidth the width of the line
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
   * Draw a filled rectangle with a gradient to the canvas
   *
   * @param canvas the canvas to draw to
   * @param dx the x-coordinate of the rectangle's left left corner
   * @param dy the y-coordinate of the rectangle's left left corner
   * @param width the width of the rectangle from x to the right
   * @param height the height of the rectrangle from y downwards
   * @param colors an array of color stops for the gradient, each color stop is an object with properties `color` and `stop`
   * @param angle the angle of the gradient in degrees (0 is top to bottom, 180 is bottom to top, etc.)
   * @param borderRadius the border radius of the rectangle
   */
  public static fillRectangleWithGradient(canvas: HTMLCanvasElement, dx: number, dy: number, width: number, height: number, colors: { red: number; green: number; blue: number; opacity: number; stop: number }[], angle: number = 0, borderRadius: number = 0): void {
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

    // Calculate gradient start and end points based on angle
    const radians = angle * (Math.PI / 180);
    const x0 = dx + width / 2 + (width / 2) * Math.cos(radians);
    const y0 = dy + height / 2 - (height / 2) * Math.sin(radians);
    const x1 = dx + width / 2 - (width / 2) * Math.cos(radians);
    const y1 = dy + height / 2 + (height / 2) * Math.sin(radians);

    const gradient = ctx.createLinearGradient(x0, y0, x1, y1);

    colors.forEach(({
      red, green, blue, opacity, stop,
    }) => {
      const color = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
      gradient.addColorStop(stop, color);
    });

    ctx.fillStyle = gradient;
    ctx.fill();
  }

  public static getPixelColor(canvas: HTMLCanvasElement, x: number, y: number): ImageData {
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (context) {
      return context.getImageData(x, y, 1, 1);
    }
    throw new Error('Unable to get canvas context');
  }

  public static drawCar(canvas: HTMLCanvasElement, dx: number, dy: number, width: number, height: number, rotation: number, red: number, green: number, blue: number, opacity: number, isPlayer: boolean = false) {
    const ctx = CanvasUtil.getCanvasContext(canvas);
    ctx.save();

    ctx.translate(dx, dy); // Render at dx, dy without adjusting for the center
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.beginPath();
    ctx.rect(-width / 2, -height / 2, width, height);
    ctx.closePath();
    ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
    ctx.globalAlpha = opacity;
    ctx.fill();

    ctx.restore();
  }

  public static drawNetCar(canvas: HTMLCanvasElement, car: NetCar) {
    const red = ((car.genome[0][2] + car.genome[1][2]) / 2) * 255;
    const green = ((car.genome[4][2] + car.genome[5][2]) / 2) * 255;
    const blue = ((car.genome[8][2] + car.genome[9][2]) / 2) * 255;

    const ctx = CanvasUtil.getCanvasContext(canvas);
    ctx.save();

    ctx.translate(car.posX, car.posY); // Render at dx, dy without adjusting for the center
    ctx.rotate((car.rotation * Math.PI) / 180);
    ctx.beginPath();
    ctx.rect(-car.width / 2, -car.height / 2, car.width, car.height);
    ctx.closePath();
    ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${0.9})`;
    ctx.globalAlpha = 0.9;
    ctx.fill();

    if (car.laps !== 0) {
      // Draw laps in the middle of the car
      const lapsText = car.laps.toString();
      const textWidth = ctx.measureText(lapsText).width;
      const textHeight = 22; // Adjust the height as needed
      const textColor = `rgba(${Math.max(red + 80, 0)}, ${Math.max(green + 80, 0)}, ${Math.max(blue + 80, 0)}, ${1})`; // Darker color for better readability

      ctx.fillStyle = textColor;
      ctx.font = `${textHeight}px Arial`;
      ctx.fillText(lapsText, -textWidth / 20, textHeight / 2);
    }

    ctx.restore();
  }

  public static drawNetCarCustomize(canvas: HTMLCanvasElement, car: NetCar | DisplayCar, posX: number = car.posX, posY: number = car.posY, rotation: number = car.rotation) {
    const ctx = CanvasUtil.getCanvasContext(canvas);
    ctx.save();

    // genes left: 2, 3, 6, 7, 16, 17
    // color genes 0, 1, 4, 5, 8, 9
    const red = ((car.genome[0][2] + car.genome[1][2]) / 2) * 300;
    const green = ((car.genome[4][2] + car.genome[5][2]) / 2) * 300;
    const blue = ((car.genome[8][2] + car.genome[9][2]) / 2) * 300;

    // color genes 2: 10, 11, 13, 14, 18, 19
    const red2 = ((car.genome[18][2] + car.genome[19][2]) / 2) * 300;
    const green2 = ((car.genome[13][2] + car.genome[14][2]) / 2) * 300;
    const blue2 = ((car.genome[10][2] + car.genome[11][2]) / 2) * 300;

    // Gradient direction based on a gene
    const gradientRotation = Math.floor(car.genome[7][2] * 3) * 360;

    // Create the gradient
    const gradient = ctx.createLinearGradient(
      (-car.width / 2) * Math.cos(gradientRotation * (Math.PI / 180)),
      (-car.height / 2) * Math.sin(gradientRotation * (Math.PI / 180)),
      (car.width / 2) * Math.cos(gradientRotation * (Math.PI / 180)),
      (car.height / 2) * Math.sin(gradientRotation * (Math.PI / 180)),
    );

    // Add the two colors to the gradient
    gradient.addColorStop(0.2, `rgba(${red}, ${green}, ${blue}, 0.9)`);
    gradient.addColorStop(0.8, `rgba(${red2}, ${green2}, ${blue2}, 0.9)`);

    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.9;

    // shape gene 12 and 15
    const shapeType = Math.floor(car.genome[12][2] * 5) + Math.floor(car.genome[15][2] * 5) / 2;
    ctx.translate(posX, posY);
    ctx.rotate((rotation * Math.PI) / 180);

    ctx.beginPath();
    switch (shapeType) {
      case 0: // Triangle
        ctx.moveTo(-car.width / 2, car.height / 2);
        ctx.lineTo(car.width / 2, car.height / 2);
        ctx.lineTo(0, -car.height / 2);
        ctx.closePath();
        break;
      case 1: // Trapezoid / half triangle or whatever its called
        const topWidth = car.width / 1.8;
        const bottomWidth = car.width * 1.2;
        const { height } = car;

        ctx.moveTo(-topWidth / 2, -height / 2);
        ctx.lineTo(topWidth / 2, -height / 2);
        ctx.lineTo(bottomWidth / 2, height / 2);
        ctx.lineTo(-bottomWidth / 2, height / 2);
        ctx.closePath();
        break;
      case 2: // Square
        ctx.rect(-car.width / 2, -car.height / 2, car.width, car.height);
        ctx.closePath();
        break;
      case 3: // Diamond
        ctx.moveTo(0, -car.height / 1.45);
        ctx.lineTo(car.width / 1.45, 0);
        ctx.lineTo(0, car.height / 1.45);
        ctx.lineTo(-car.width / 1.45, 0);
        ctx.closePath();
        break;
      default: // another triangle
        ctx.moveTo(-car.width / 2, car.height / 2);
        ctx.lineTo(car.width / 2, car.height / 2);
        ctx.lineTo(0, -car.height / 2);
        ctx.closePath();
    }

    ctx.fill();
    ctx.restore();
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
}
