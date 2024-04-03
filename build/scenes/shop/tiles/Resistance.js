import HandleStats from '../../../ui/HandleStats.js';
import HandleScore from '../../../ui/handleScore.js';
import CanvasUtil from '../../../utilities/CanvasUtil.js';
import ShopTile from './ShopTile.js';
export default class Resistance extends ShopTile {
    constructor() {
        super();
        this.tier = HandleStats.launchPower;
        this.maxTier = 5;
        this.blueValue = 50 * HandleStats.airResistanceTier;
        this.opacity = 0.6;
        this.title = 'Air resistance';
        this.description = 'Upgrading this means mister duck will face less are, which means he wont be slowed down and fly further';
        this.upgradeCost = 100;
        this.upgradeMultiplier *= 2.3;
        this.tileSize = window.innerWidth / 7.5;
        this.posX = window.innerWidth / 10 + this.tileSize + window.innerWidth / 32;
        this.posY = window.innerHeight / 1.6 + 30;
        this.selectTile = false;
    }
    level(canvas, canAfford) {
        if (HandleScore.duckDollars >= this.upgradeCost) {
            if (this.tier <= this.maxTier) {
                HandleStats.airResistanceTier += 1;
                this.tier += 1;
                this.blueValue += 50;
                this.upgradeCost *= this.upgradeMultiplier;
            }
        }
        else {
            CanvasUtil.drawRectangle(canvas, this.posX, this.posY, this.tileSize, this.tileSize, 255 * canAfford, 30, 30, 0.4, 8);
        }
    }
    render(canvas) {
        CanvasUtil.fillRectangle(canvas, this.posX, this.posY, this.tileSize, this.tileSize, 30, 175, this.blueValue, this.opacity);
        CanvasUtil.fillRectangle(canvas, this.posX + window.innerWidth / 64, this.posY + window.innerWidth / 64, this.tileSize - window.innerWidth / 32, this.tileSize - window.innerWidth / 32, 255, 255, 255, this.opacity);
        CanvasUtil.writeText(canvas, 'air resistance', this.posX, this.posY);
    }
}
//# sourceMappingURL=Resistance.js.map