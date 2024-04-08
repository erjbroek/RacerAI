export default class HandleScore {
    static height = 0;
    static distance = 0;
    static maxHeight = 0;
    static maxSpeed = 0;
    static bronzeCoins = 0;
    static silverCoins = 0;
    static goldCoins = 0;
    static totalCoins = 0;
    static duckDollars = 999999;
    static enemiesHit = 0;
    static score = 0;
    static calculateDistances(xSpeed, height) {
        this.distance += xSpeed / 200;
        this.height = height / 200;
        if (this.height >= this.maxHeight) {
            this.maxHeight = this.height;
        }
    }
    static reset() {
        this.height = 0;
        this.distance = 0;
        this.maxHeight = 0;
        this.maxSpeed = 0;
        this.bronzeCoins = 0;
        this.silverCoins = 0;
        this.goldCoins = 0;
        this.totalCoins = 0;
        this.enemiesHit = 0;
        this.score = 0;
    }
    static calculateScore() {
        this.score = (this.distance / 2) * ((this.maxHeight / 10) + 1);
    }
    static addCoin(coinType) {
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
//# sourceMappingURL=HandleScore.js.map