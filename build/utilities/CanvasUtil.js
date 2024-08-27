export default class CanvasUtil {
    static canvas;
    static ctx;
    static getCanvasContext(canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx === null)
            throw new Error("Canvas Rendering Context is null");
        return ctx;
    }
    static setCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        if (this.ctx === null)
            throw new Error("Canvas Rendering Context is null");
    }
    static getCanvas() {
        if (!this.canvas)
            throw new Error("Canvas is not set");
        return this.canvas;
    }
    static fillCanvas(canvas, colour = "#FF10F0") {
        const ctx = CanvasUtil.getCanvasContext(canvas);
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = colour;
        ctx.fill();
    }
    static loadNewImage(source) {
        const img = new Image();
        img.src = source;
        return img;
    }
    static loadNewImages(sources, folder) {
        const images = [];
        for (const source of sources) {
            images.push(CanvasUtil.loadNewImage(folder ? folder + source : source));
        }
        return images;
    }
    static drawImage(canvas, image, dx, dy, width = 0, height = 0, rotation = 0, opacity) {
        const ctx = CanvasUtil.getCanvasContext(canvas);
        if (width === 0)
            width = image.width;
        if (height === 0)
            height = image.height;
        ctx.save();
        if (opacity !== undefined) {
            ctx.globalAlpha = opacity;
        }
        ctx.translate(dx + width / 2, dy + height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(image, -width / 2, -height / 2, width, height);
        ctx.restore();
    }
    static clearCanvas(canvas) {
        const ctx = CanvasUtil.getCanvasContext(canvas);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    static writeText(canvas, text, xCoordinate, yCoordinate, alignment = "center", fontFamily = "sans-serif", fontSize = 20, color = "red", fontWeight = 10) {
        const ctx = CanvasUtil.getCanvasContext(canvas);
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = color;
        ctx.textAlign = alignment;
        const lines = text.split("<br>");
        let currentY = yCoordinate;
        for (const line of lines) {
            ctx.fillText(line, xCoordinate, currentY);
            currentY += fontSize;
        }
    }
    static drawCircle(canvas, centerX, centerY, radius, red = 255, green = 255, blue = 255, opacity = 1) {
        const ctx = CanvasUtil.getCanvasContext(canvas);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
    static drawRectangle(canvas, dx, dy, width, height, red = 255, green = 255, blue = 255, opacity = 1, lineWidth = 1, borderRadius = 0) {
        const ctx = CanvasUtil.getCanvasContext(canvas);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(dx + borderRadius, dy);
        ctx.arcTo(dx + width, dy, dx + width, dy + height, borderRadius);
        ctx.arcTo(dx + width, dy + height, dx, dy + height, borderRadius);
        ctx.arcTo(dx, dy + height, dx, dy, borderRadius);
        ctx.arcTo(dx, dy, dx + borderRadius, dy, borderRadius);
        ctx.closePath();
        ctx.stroke();
    }
    static drawLine(canvas, x1, y1, x2, y2, red = 255, green = 255, blue = 255, opacity = 1, lineWidth = 1) {
        const ctx = CanvasUtil.getCanvasContext(canvas);
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    static fillCircle(canvas, centerX, centerY, radius, red = 255, green = 255, blue = 255, opacity = 1) {
        const ctx = CanvasUtil.getCanvasContext(canvas);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();
    }
    static fillRectangle(canvas, dx, dy, width, height, red = 255, green = 255, blue = 255, opacity = 1, borderRadius = 0, rotation = 0) {
        const ctx = CanvasUtil.getCanvasContext(canvas);
        ctx.save();
        const centerX = dx + width / 2;
        const centerY = dy + height / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation * (Math.PI / 180));
        ctx.translate(-centerX, -centerY);
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
        ctx.restore();
    }
    static fillRectangleWithGradient(canvas, dx, dy, width, height, colors, angle = 0, borderRadius = 0) {
        const ctx = CanvasUtil.getCanvasContext(canvas);
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
        const radians = angle * (Math.PI / 180);
        const x0 = dx + width / 2 + (width / 2) * Math.cos(radians);
        const y0 = dy + height / 2 - (height / 2) * Math.sin(radians);
        const x1 = dx + width / 2 - (width / 2) * Math.cos(radians);
        const y1 = dy + height / 2 + (height / 2) * Math.sin(radians);
        const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
        colors.forEach(({ red, green, blue, opacity, stop }) => {
            const color = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
            gradient.addColorStop(stop, color);
        });
        ctx.fillStyle = gradient;
        ctx.fill();
    }
    static getPixelColor(canvas, x, y) {
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (context) {
            return context.getImageData(x, y, 1, 1);
        }
        throw new Error("Unable to get canvas context");
    }
    static drawCar(canvas, dx, dy, width, height, rotation, red, green, blue, opacity, isPlayer = false) {
        const ctx = CanvasUtil.getCanvasContext(canvas);
        ctx.save();
        ctx.translate(dx, dy);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.beginPath();
        ctx.rect(-width / 2, -height / 2, width, height);
        ctx.closePath();
        ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
        ctx.globalAlpha = opacity;
        ctx.fill();
        ctx.restore();
    }
    static drawNetCar(canvas, car) {
        const red = ((car.genome[0][2] + car.genome[1][2]) / 2) * 255;
        const green = ((car.genome[4][2] + car.genome[5][2]) / 2) * 255;
        const blue = ((car.genome[8][2] + car.genome[9][2]) / 2) * 255;
        const ctx = CanvasUtil.getCanvasContext(canvas);
        ctx.save();
        ctx.translate(car.posX, car.posY);
        ctx.rotate((car.rotation * Math.PI) / 180);
        ctx.beginPath();
        ctx.rect(-car.width / 2, -car.height / 2, car.width, car.height);
        ctx.closePath();
        ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${0.9})`;
        ctx.globalAlpha = 0.9;
        ctx.fill();
        if (car.laps !== 0) {
            const lapsText = car.laps.toString();
            const textWidth = ctx.measureText(lapsText).width;
            const textHeight = 22;
            const textColor = `rgba(${Math.max(red + 80, 0)}, ${Math.max(green + 80, 0)}, ${Math.max(blue + 80, 0)}, ${1})`;
            ctx.fillStyle = textColor;
            ctx.font = `${textHeight}px Arial`;
            ctx.fillText(lapsText, -textWidth / 20, textHeight / 2);
        }
        ctx.restore();
    }
    static createNetCar(canvas, car, posX = car.posX, posY = car.posY, sizeMultiplier = 1, rotation = car.rotation) {
        const ctx = CanvasUtil.getCanvasContext(canvas);
        ctx.save();
        const red = ((car.genome[0][2] + car.genome[1][2]) / 2) * 300;
        const green = ((car.genome[4][2] + car.genome[5][2]) / 2) * 300;
        const blue = ((car.genome[8][2] + car.genome[9][2]) / 2) * 300;
        const red2 = ((car.genome[18][2] + car.genome[19][2]) / 2) * 300;
        const green2 = ((car.genome[13][2] + car.genome[14][2]) / 2) * 300;
        const blue2 = ((car.genome[10][2] + car.genome[11][2]) / 2) * 300;
        const gradientRotation = car.genome[7][2] * 360;
        const gradient = ctx.createLinearGradient((-car.width / 2 * sizeMultiplier) * Math.cos(gradientRotation * (Math.PI / 180)), (-car.height / 2 * sizeMultiplier) * Math.sin(gradientRotation * (Math.PI / 180)), (car.width / 2 * sizeMultiplier) * Math.cos(gradientRotation * (Math.PI / 180)), (car.height / 2 * sizeMultiplier) * Math.sin(gradientRotation * (Math.PI / 180)));
        gradient.addColorStop(0.2, `rgba(${red}, ${green}, ${blue}, 0.9)`);
        gradient.addColorStop(0.8, `rgba(${red2}, ${green2}, ${blue2}, 0.9)`);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.9;
        const shapeType = Math.floor(car.genome[12][2] * 5) + Math.floor(car.genome[15][2] * 5) / 2;
        ctx.translate(posX, posY);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.beginPath();
        switch (shapeType) {
            case 0:
                ctx.moveTo(-car.width / 2 * sizeMultiplier, car.height / 2 * sizeMultiplier);
                ctx.lineTo(car.width / 2 * sizeMultiplier, car.height / 2 * sizeMultiplier);
                ctx.lineTo(0, -car.height / 2 * sizeMultiplier);
                ctx.closePath();
                break;
            case 1:
                const topWidth = car.width * sizeMultiplier / 1.8;
                const bottomWidth = car.width * sizeMultiplier * 1.2;
                const { height } = car;
                ctx.moveTo(-topWidth / 2, -height / 2);
                ctx.lineTo(topWidth / 2, -height / 2);
                ctx.lineTo(bottomWidth / 2, height / 2);
                ctx.lineTo(-bottomWidth / 2, height / 2);
                ctx.closePath();
                break;
            case 2:
                ctx.rect(-car.width * sizeMultiplier / 2, -car.height / 2 * sizeMultiplier, car.width * sizeMultiplier, car.height * sizeMultiplier);
                ctx.closePath();
                break;
            case 3:
                ctx.moveTo(0, -car.height / 1.45 * sizeMultiplier);
                ctx.lineTo(car.width * sizeMultiplier / 1.45, 0);
                ctx.lineTo(0, car.height / 1.45 * sizeMultiplier);
                ctx.lineTo(-car.width * sizeMultiplier / 1.45, 0);
                ctx.closePath();
                break;
            default:
                ctx.moveTo(-car.width * sizeMultiplier / 2, car.height / 2 * sizeMultiplier);
                ctx.lineTo(car.width * sizeMultiplier / 2, car.height / 2 * sizeMultiplier);
                ctx.lineTo(0, -car.height / 2 * sizeMultiplier);
                ctx.closePath();
        }
        ctx.fill();
        ctx.restore();
    }
    static renderHeatmap(canvas, startX, startY, width, height, deathPositions) {
        const ctx = canvas.getContext('2d');
        deathPositions.forEach((death1) => {
            const death1X = death1[0];
            const death1Y = death1[1];
        });
    }
    static rotateImage(canvas, image, degrees) {
        const ctx = CanvasUtil.getCanvasContext(canvas);
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((degrees * Math.PI) / 180);
        ctx.drawImage(image, -image.width / 2, -image.height / 2);
        ctx.restore();
    }
}
//# sourceMappingURL=CanvasUtil.js.map