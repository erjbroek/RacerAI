import HandleStats from '../../../ui/HandleStats.js';
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
        this.description = 'The power of the jetpack makes the jetpack more effective, resulting in more speed';
        this.upgradeCost = 250;
        this.upgradeMultiplier *= 3;
        this.tileSize = window.innerWidth / 7.5;
        this.posX = window.innerWidth / 10 + window.innerWidth / 64;
        this.posY = window.innerHeight / 1.6 + 30;
        this.selectTile = false;
    }
    level() {
        if (this.tier <= this.maxTier) {
            HandleStats.boostPowerTier += 1;
            this.tier += 1;
            this.blueValue += 50;
            this.upgradeCost *= this.upgradeMultiplier;
        }
    }
    render(canvas) {
        CanvasUtil.fillRectangle(canvas, this.posX, this.posY, this.tileSize, this.tileSize, 30, 175, this.blueValue, this.opacity);
        CanvasUtil.fillRectangle(canvas, this.posX + window.innerWidth / 64, this.posY + window.innerWidth / 64, this.tileSize - window.innerWidth / 32, this.tileSize - window.innerWidth / 32, 255, 255, 255, this.opacity);
        CanvasUtil.writeText(canvas, 'fuelpower', this.posX, this.posY);
    }
    renderSelect(canvas) {
        CanvasUtil.drawRectangle(canvas, this.posX, this.posY, this.tileSize, this.tileSize, 30, 30, 30, 0.4, 4);
    }
}
//# sourceMappingURL=FuelPower.js.map