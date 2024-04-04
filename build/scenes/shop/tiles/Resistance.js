import HandleStats from '../../../ui/HandleStats.js';
import HandleScore from '../../../ui/handleScore.js';
import CanvasUtil from '../../../utilities/CanvasUtil.js';
import ShopTile from './ShopTile.js';
export default class Resistance extends ShopTile {
    constructor() {
        super();
        this.tier = HandleStats.airResistanceTier;
        this.maxTier = 4;
        this.blueValue = 50 * HandleStats.airResistanceTier;
        this.opacity = 0.6;
        this.title = 'Air resistance';
        this.description = 'Whenever flying, mister duck will experience ait resistance. Upgrading this<br>makes mister duck more aerodynamic resulting in further flight.';
        this.upgradeCost = 100;
        this.upgradeMultiplier = 1.9;
        this.tileSize = window.innerWidth / 7.5;
        this.posX = window.innerWidth / 10 + this.tileSize + window.innerWidth / 32;
        this.posY = window.innerHeight / 1.6 + 30;
        this.statTiers = [0, 0.1, 0.25, 0.3, 0.45];
    }
    level() {
        if (HandleScore.duckDollars >= this.upgradeCost) {
            if (this.tier < this.maxTier) {
                HandleStats.airResistanceTier += 1;
                this.tier += 1;
                this.blueValue = (255 / this.maxTier) * this.tier;
                this.upgradeCost *= this.upgradeMultiplier;
            }
        }
    }
    render(canvas) {
        CanvasUtil.fillRectangle(canvas, this.posX, this.posY, this.tileSize, this.tileSize, 30, 175, this.blueValue, this.opacity);
        CanvasUtil.fillRectangle(canvas, this.posX + window.innerWidth / 64, this.posY + window.innerWidth / 64, this.tileSize - window.innerWidth / 32, this.tileSize - window.innerWidth / 32, 255, 255, 255, this.opacity);
        CanvasUtil.writeText(canvas, 'air resistance', this.posX, this.posY);
    }
}
//# sourceMappingURL=Resistance.js.map