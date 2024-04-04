import HandleStats from '../../../ui/HandleStats.js';
import HandleScore from '../../../ui/handleScore.js';
import CanvasUtil from '../../../utilities/CanvasUtil.js';
import ShopTile from './ShopTile.js';
export default class FuelPower extends ShopTile {
    constructor() {
        super();
        this.tier = HandleStats.boostPowerTier;
        this.maxTier = 5;
        this.blueValue = 50 * HandleStats.boostPowerTier;
        this.opacity = 0.6;
        this.title = 'Jetpack power';
        this.description = "The jetpack makes you fly in the direction you're facing.<br>Upgrading this means you get a better jetpack, resulating in higher speeds!";
        this.upgradeCost = 250;
        this.upgradeMultiplier = 2.5;
        this.tileSize = window.innerWidth / 7.5;
        this.posX = window.innerWidth / 10 + window.innerWidth / 64;
        this.posY = window.innerHeight / 1.6 + 30;
        this.statTiers = [1, 1.1, 1.2, 1.35, 1.5, 1.6];
    }
    level() {
        if (HandleScore.duckDollars >= this.upgradeCost) {
            if (this.tier < this.maxTier) {
                HandleStats.boostPowerTier += 1;
                this.tier += 1;
                this.blueValue = (255 / this.maxTier) * this.tier;
                this.upgradeCost *= this.upgradeMultiplier;
            }
        }
    }
    render(canvas) {
        CanvasUtil.fillRectangle(canvas, this.posX, this.posY, this.tileSize, this.tileSize, 30, 175, this.blueValue, this.opacity);
        CanvasUtil.fillRectangle(canvas, this.posX + window.innerWidth / 64, this.posY + window.innerWidth / 64, this.tileSize - window.innerWidth / 32, this.tileSize - window.innerWidth / 32, 255, 255, 255, this.opacity);
        CanvasUtil.writeText(canvas, 'fuelpower', this.posX, this.posY);
    }
}
//# sourceMappingURL=FuelPower.js.map