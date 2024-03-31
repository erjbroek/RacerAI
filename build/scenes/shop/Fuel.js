import HandleStats from '../../ui/HandleStats.js';
import CanvasUtil from '../../utilities/CanvasUtil.js';
import ShopTile from './ShopTile.js';
export default class Fuel extends ShopTile {
    constructor() {
        super();
        this.tier = HandleStats.boostFuelTier;
        this.maxTier = 5;
        this.title = 'Fuel amount';
        this.description = 'This upgrades the efficiency of the jetpack, so you can boost longer';
        this.blueValue = 0;
        this.opacity = 0.6;
        this.upgradeCost = 50;
        this.upgradeMultiplier *= 2.5;
        this.tileSize = window.innerWidth / 7.5;
        this.posX = window.innerWidth / 10 + 30 + (this.tileSize + 30) * 2;
        this.posY = window.innerHeight / 3.3 + 30;
    }
    level() {
        if (this.tier <= this.maxTier) {
            HandleStats.boostFuelTier += 1;
            this.tier += 1;
            this.blueValue += 50;
            this.upgradeCost *= this.upgradeMultiplier;
        }
    }
    render(canvas) {
        CanvasUtil.fillRectangle(canvas, this.posX, this.posY, this.tileSize, this.tileSize, 30, 175, this.blueValue, this.opacity);
        CanvasUtil.fillRectangle(canvas, this.posX + 30, this.posY + 30, this.tileSize - 60, this.tileSize - 60, 255, 255, 255, this.opacity);
        CanvasUtil.writeText(canvas, 'fuel', this.posX, this.posY);
    }
}
//# sourceMappingURL=Fuel.js.map