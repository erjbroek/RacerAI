import HandleStats from '../../../ui/HandleStats.js';
import HandleScore from '../../../ui/HandleScore.js';
import CanvasUtil from '../../../utilities/CanvasUtil.js';
import ShopTile from './ShopTile.js';
export default class Power extends ShopTile {
    constructor() {
        super();
        this.tier = HandleStats.launchPowerTier;
        this.maxTier = 5;
        this.blueValue = (255 / this.maxTier) * this.tier;
        this.opacity = 0.6;
        this.title = 'Launch power';
        this.description = 'Whenever you start flying as a duck, you use your strong wings to launch <br>ourself as fast as possible. Upgrading this will guarantee faster launch<br>speeds!';
        this.emptySlot = CanvasUtil.loadNewImage('./assets/emptyslot.png');
        this.image = CanvasUtil.loadNewImage('./assets/player.png');
        this.upgradeCost = 50;
        this.upgradeMultiplier = 1.9;
        this.tileSize = window.innerWidth / 7.5;
        this.posX = window.innerWidth / 10 + window.innerWidth / 64;
        this.posY = window.innerHeight / 3.3 + 30;
        this.statTiers = [1, 1.1, 1.25, 1.35, 1.45, 1.6];
    }
    level() {
        if (HandleScore.duckDollars >= this.upgradeCost) {
            if (this.tier < this.maxTier) {
                HandleStats.launchPowerTier += 1;
                HandleStats.launchPower = this.statTiers[HandleStats.launchPowerTier];
                this.tier += 1;
                this.blueValue = (255 / this.maxTier) * this.tier;
                this.upgradeCost *= this.upgradeMultiplier;
            }
        }
    }
    render(canvas) {
        CanvasUtil.fillRectangle(canvas, this.posX, this.posY, this.tileSize, this.tileSize, 30, 175, this.blueValue, this.opacity, 20);
        CanvasUtil.fillRectangle(canvas, this.posX + window.innerWidth / 64, this.posY + window.innerWidth / 64, this.tileSize - window.innerWidth / 32, this.tileSize - window.innerWidth / 32, 255, 255, 255, this.opacity);
        CanvasUtil.writeText(canvas, 'power', this.posX, this.posY);
        CanvasUtil.drawImage(canvas, this.emptySlot, this.posX + this.tileSize / 2 - this.emptySlot.width / 4, this.posY + this.tileSize / 2 - this.emptySlot.height / 4 + canvas.height / 30, this.emptySlot.width / 2, this.emptySlot.height / 2, 0, 0.3);
        if (HandleStats.launchPowerTier > 0) {
            this.image = CanvasUtil.loadNewImage(`./assets/player${HandleStats.launchPowerTier}.png`);
        }
        else {
            this.image = CanvasUtil.loadNewImage('./assets/player.png');
        }
        console.log('draw');
        CanvasUtil.drawImage(canvas, this.image, this.posX + this.tileSize / 2 - this.image.width / 6, this.posY + this.tileSize / 2 - this.image.height / 6, this.image.width / 3, this.image.height / 3, 0, 1);
    }
}
//# sourceMappingURL=Power.js.map