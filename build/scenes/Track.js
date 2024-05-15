import CanvasUtil from '../utilities/CanvasUtil.js';
export default class Track {
    road;
    radius;
    lineStart = [];
    lineEnd = [];
    midPoint = [];
    gridSize;
    grid;
    constructor(track, radius) {
        this.road = track;
        this.radius = radius;
        this.road.forEach((trackPiece) => {
            trackPiece[2] = 0;
            const found = [];
            this.road.forEach((track2) => {
                if (Math.sqrt((trackPiece[0] - track2[0]) ** 2 + (trackPiece[1] - track2[1]) ** 2) <= this.radius * 1.5 && trackPiece !== track2) {
                    found.push(this.road.indexOf(track2));
                }
            });
            if (found.length <= 4) {
                trackPiece[2] = 1;
                if (this.road.indexOf(trackPiece) <= this.road.length - 2) {
                    this.road[this.road.indexOf(trackPiece) + 1][2] = 1;
                }
            }
        });
        this.gridSize = Math.ceil(window.innerWidth / 10);
        this.grid = new Map();
        this.initializeGrid();
    }
    initializeGrid() {
        this.road.forEach((trackPiece, index) => {
            const [x, y] = trackPiece;
            const cellKey = this.getCellKey(x, y);
            if (!this.grid.has(cellKey)) {
                this.grid.set(cellKey, []);
            }
            this.grid.get(cellKey)?.push(index);
        });
    }
    getCellKey(x, y) {
        const gridX = Math.floor(x / this.gridSize);
        const gridY = Math.floor(y / this.gridSize);
        return `${gridX},${gridY}`;
    }
    getTracksInCell(cellKey) {
        return this.grid.get(cellKey) || [];
    }
    checkCollisionWithTrack(car) {
        const gridX = Math.floor(car.posX / this.gridSize);
        const gridY = Math.floor(car.posY / this.gridSize);
        let collisionOccured = false;
        const checkCollisionInCell = (cellX, cellY) => {
            const cellKey = `${cellX},${cellY}`;
            const tracksInCell = this.getTracksInCell(cellKey);
            tracksInCell.forEach((trackIndex) => {
                const [trackX, trackY] = this.road[trackIndex];
                const distanceSquared = (car.posX - trackX) ** 2 + (car.posY - trackY) ** 2;
                const minDistanceSquared = this.radius ** 2;
                if (distanceSquared < minDistanceSquared) {
                    collisionOccured = true;
                }
            });
        };
        for (let offsetX = -1; offsetX <= 1; offsetX++) {
            for (let offsetY = -1; offsetY <= 1; offsetY++) {
                const cellX = gridX + offsetX;
                const cellY = gridY + offsetY;
                checkCollisionInCell(cellX, cellY);
            }
        }
        if (!collisionOccured) {
            return false;
        }
        return true;
    }
    render(canvas) {
        this.road.forEach((trackPiece) => {
            CanvasUtil.fillCircle(canvas, trackPiece[0], trackPiece[1], this.radius, 20 / (trackPiece[2] + 0.1), 120 * trackPiece[2], 0, 1);
        });
    }
}
//# sourceMappingURL=Track.js.map