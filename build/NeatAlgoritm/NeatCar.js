import Car from '../Car.js';
export default class NeatCar extends Car {
    fitness = 0;
    checkAlive = 800;
    position = 0;
    parentPosition;
    distance = 0;
    collided = false;
    finished = false;
    rayLength = 100;
    numRays = 5;
    raySpread = 90;
    constructor(midPoint, startAngle, parentPosition = null) {
        super();
        this.width = window.innerHeight / 40;
        this.height = window.innerHeight / 25;
        this.alive = true;
        [this.posX, this.posY] = [midPoint[0], midPoint[1]];
        this.rotation = startAngle;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.parentPosition = parentPosition;
    }
    castRays(track) {
        const rayAngles = this.calculateRayAngles();
        const distances = rayAngles.map((angle) => this.castRay(angle, track));
        return distances;
    }
    calculateRayAngles() {
        const angles = [];
        for (let i = 0; i < this.numRays; i++) {
            const angle = (i / (this.numRays - 1)) * this.raySpread - (this.raySpread / 2);
            angles.push(this.rotation + angle);
        }
        return angles;
    }
    castRay(angle, track) {
        const radianAngle = (angle * Math.PI) / 180;
        const rayX = this.posX + this.rayLength * Math.cos(radianAngle);
        const rayY = this.posY + this.rayLength * Math.sin(radianAngle);
        let closestDistance = this.rayLength;
        track.road.forEach(([trackX, trackY]) => {
            const distance = this.getRayIntersectionDistance(this.posX, this.posY, rayX, rayY, trackX, trackY, track.radius);
            if (distance < closestDistance) {
                closestDistance = distance;
            }
        });
        return closestDistance;
    }
    getRayIntersectionDistance(rayStartX, rayStartY, rayEndX, rayEndY, trackX, trackY, radius) {
        const dx = rayEndX - rayStartX;
        const dy = rayEndY - rayStartY;
        const fx = rayStartX - trackX;
        const fy = rayStartY - trackY;
        const a = dx * dx + dy * dy;
        const b = 2 * (fx * dx + fy * dy);
        const c = (fx * fx + fy * fy) - radius * radius;
        const discriminant = b * b - 4 * a * c;
        if (discriminant >= 0) {
            const discriminantSqrt = Math.sqrt(discriminant);
            const t1 = (-b - discriminantSqrt) / (2 * a);
            const t2 = (-b + discriminantSqrt) / (2 * a);
            if (t1 >= 0 && t1 <= 1) {
                return t1 * Math.sqrt(dx * dx + dy * dy);
            }
            if (t2 >= 0 && t2 <= 1) {
                return t2 * Math.sqrt(dx * dx + dy * dy);
            }
        }
        return this.rayLength;
    }
    mutate() {
    }
    rotateLeft() {
        const deltaRotation = (this.rotation * Math.PI) / 180;
        const deltaX = Math.sin(deltaRotation);
        const deltaY = Math.cos(deltaRotation);
        this.xSpeed += deltaX / 13;
        this.ySpeed -= deltaY / 13;
        if (this.xSpeed !== 0 || this.ySpeed !== 0) {
            this.rotation -= 1.2;
            this.updateSpeedWithRotation();
        }
    }
    rotateRight() {
        const deltaRotation = (this.rotation * Math.PI) / 180;
        const deltaX = Math.sin(deltaRotation);
        const deltaY = Math.cos(deltaRotation);
        this.xSpeed += deltaX / 13;
        this.ySpeed -= deltaY / 13;
        if (this.xSpeed !== 0 || this.ySpeed !== 0) {
            this.rotation += 1.2;
            this.updateSpeedWithRotation();
        }
    }
    updateSpeedWithRotation() {
        const radians = ((this.rotation - 90) * Math.PI) / 180;
        const speedMagnitude = Math.sqrt(this.xSpeed * this.xSpeed + this.ySpeed * this.ySpeed);
        this.xSpeed = speedMagnitude * Math.cos(radians);
        this.ySpeed = speedMagnitude * Math.sin(radians);
    }
    accelerate() {
        const deltaRotation = (this.rotation * Math.PI) / 180;
        const deltaX = Math.sin(deltaRotation);
        const deltaY = Math.cos(deltaRotation);
        this.xSpeed += deltaX / 7;
        this.ySpeed -= deltaY / 7;
    }
    brake() {
        const brakeFactor = 1 - (1 - 0.6) / 13;
        this.xSpeed *= brakeFactor;
        this.ySpeed *= brakeFactor;
    }
    updateDistance() {
        const distance = Math.abs(this.xSpeed) + Math.abs(this.ySpeed);
        this.distance += distance;
    }
    update(elapsed) {
        this.xSpeed *= 0.96;
        this.ySpeed *= 0.96;
        if (Math.abs(this.xSpeed) + Math.abs(this.ySpeed) <= 0.01) {
            this.checkAlive -= elapsed;
        }
        if (this.checkAlive <= 0) {
            this.alive = false;
        }
        this.posX += this.xSpeed / 5 * (elapsed);
        this.posY += this.ySpeed / 5 * (elapsed);
    }
}
//# sourceMappingURL=NeatCar.js.map