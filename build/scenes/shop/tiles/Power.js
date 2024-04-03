import HandleStats from '../../../ui/HandleStats.js';
import CanvasUtil from '../../../utilities/CanvasUtil.js';
import ShopTile from './ShopTile.js';
export default class Power extends ShopTile {
    constructor() {
        super();
        this.tier = HandleStats.launchPower;
        this.maxTier = 5;
        this.blueValue = 50 * HandleStats.launchPowerTier;
        this.opacity = 0.6;
        this.title = 'Launch power';
        this.description = 'The launch power increases the distance mister duck gets launched';
        this.upgradeCost = 50;
        this.upgradeMultiplier = 3.5;
        this.tileSize = window.innerWidth / 7.5;
        this.posX = window.innerWidth / 10 + window.innerWidth / 64;
        this.posY = window.innerHeight / 3.3 + 30;
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
        CanvasUtil.writeText(canvas, 'power', this.posX, this.posY);
    }
    renderSelect(canvas) {
        CanvasUtil.drawRectangle(canvas, this.posX, this.posY, this.tileSize, this.tileSize, 30, 30, 30, 0.4, 4);
    }
}
//# sourceMappingURL=Power.js.map