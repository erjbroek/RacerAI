import HandleStats from '../../ui/HandleStats.js';
import CanvasUtil from '../../utilities/CanvasUtil.js';
import ShopTile from './ShopTile.js';
export default class FuelPower extends ShopTile {
    constructor() {
        super();
        this.maxTier = 5;
        this.blueValue = 0;
        this.opacity = 0.6;
        this.title = 'Jetpack power';
        this.description = 'The power of the jetpack makes the jetpack more effective, resulting in more speed';
        this.upgradeCost = 250;
        this.upgradeMultiplier *= 3;
        this.tileSize = window.innerWidth / 7.5;
        this.posX = window.innerWidth / 10 + 30;
        this.posY = window.innerHeight / 1.6 + 30;
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
        CanvasUtil.fillRectangle(canvas, this.posX + 30, this.posY + 30, this.tileSize - 60, this.tileSize - 60, 255, 255, 255, this.opacity);
        CanvasUtil.writeText(canvas, 'fuelpower', this.posX, this.posY);
    }
}
//# sourceMappingURL=FuelPower.js.map