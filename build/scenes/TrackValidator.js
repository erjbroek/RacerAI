export default class TrackValidator {
    track;
    radius;
    loopPart;
    constructor(track, radius) {
        this.track = track;
        this.radius = radius;
        this.loopPart = new Array(track.length).fill(false);
    }
    isTrackValid() {
        const visited = new Array(this.track.length).fill(false);
        if (this.dfs(0, -1, visited)) {
            this.setLoopPartValues(visited);
            return true;
        }
        for (let i = 0; i < visited.length; i++) {
            if (!visited[i]) {
                if (this.dfs(i, -1, visited)) {
                    this.setLoopPartValues(visited);
                    return true;
                }
            }
        }
        return false;
    }
    dfs(current, parent, visited) {
        if (visited[current]) {
            return true;
        }
        visited[current] = true;
        for (const neighbor of this.getNeighbors(current)) {
            if (neighbor !== parent) {
                if (this.dfs(neighbor, current, visited)) {
                    return true;
                }
            }
        }
        return false;
    }
    getNeighbors(current) {
        const neighbors = [];
        const [x1, y1] = this.track[current];
        for (let i = 0; i < this.track.length; i++) {
            if (i !== current) {
                const [x2, y2] = this.track[i];
                if (Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) <= this.radius * 1.4) {
                    neighbors.push(i);
                }
            }
        }
        return neighbors;
    }
    setLoopPartValues(visited) {
        visited.forEach((value, index) => {
            this.loopPart[index] = value;
        });
    }
    getLoopPart() {
        return this.loopPart;
    }
}
//# sourceMappingURL=TrackValidator.js.map