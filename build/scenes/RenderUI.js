import CanvasUtil from '../utilities/CanvasUtil.js';
export default class RenderUI {
    static renderUI(canvas) {
        CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width / 30, canvas.height, 30, 30, 30);
        CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width, canvas.height / 12, 30, 30, 30);
        CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6, 0, canvas.width / 6, canvas.height, 30, 30, 30);
        CanvasUtil.fillRectangle(canvas, 0, canvas.height - canvas.height / 20, canvas.width, canvas.height / 20, 30, 30, 30);
        CanvasUtil.fillRectangle(canvas, canvas.width - canvas.width / 6.5, canvas.height / 20, canvas.width / 5 - canvas.width / 18, canvas.height / 1.111, 255, 255, 255, 0.2, 20);
    }
    static renderTrack(canvas, track, radius) {
        CanvasUtil.fillCanvas(canvas, 'black');
        CanvasUtil.fillRectangle(canvas, canvas.width / 30, canvas.height / 12, canvas.width - canvas.width / 5, canvas.height - canvas.height / 7.5, 255, 255, 255, 1, 20);
        track.forEach((trackPiece) => {
            CanvasUtil.fillCircle(canvas, trackPiece[0], trackPiece[1], radius, 20 / (trackPiece[2] + 0.1), 0, 0);
        });
    }
}
//# sourceMappingURL=RenderUI.js.map