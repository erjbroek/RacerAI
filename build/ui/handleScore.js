export default class HandleScore {
    height = 0;
    distance = 0;
    maxHeight = 0;
    maxSpeed = 0;
    bronzeCoins = 0;
    silverCoins = 0;
    goldCoins = 0;
    totalCoins = 0;
    enemiesHit = 0;
    score = 0;
    calculateDistances(xSpeed, height) {
        this.distance += xSpeed / 150;
        this.height = height / 150;
        if (this.height >= this.maxHeight) {
            this.maxHeight = this.height;
        }
    }
    calculateScore() {
        this.score = (this.distance / 2) * ((this.maxHeight / 10) + 1);
    }
    addCoin(coinType) {
        if (coinType === 1) {
            this.bronzeCoins += 1;
        }
        else if (coinType === 2) {
            this.silverCoins += 1;
        }
        else {
            this.goldCoins += 1;
        }
    }
}
//# sourceMappingURL=handleScore.js.map