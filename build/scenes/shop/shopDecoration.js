import GrassDark from '../../background items/GrassDark.js';
import GrassLight from '../../background items/GrassLight.js';
import Mushroom from '../../drawables/Mushroom.js';
import Player from '../../drawables/Player.js';
import CanvasUtil from '../../utilities/CanvasUtil.js';
export default class ShopDecoration {
    player = new Player();
    bottom = window.innerHeight / 6;
    lightGrass = [];
    darkGrass = [];
    mushrooms = [];
    red = 120;
    green = 220;
    blue = 300;
    totalTime = 0;
    sunHeight = this.bottom + window.innerWidth / 3.7;
    sunSpeed = 0;
    darkness = 0;
    daySpeed = 0.2;
    posY = 0;
    ySpeed = 0;
    constructor() {
        this.player.image.width /= 2;
        this.player.image.height /= 2;
        this.player.posX = 0 - this.player.image.width;
        this.player.posY = this.bottom - this.player.image.height;
        this.player.angle = 0;
        this.lightGrass.push(new GrassLight(0, this.bottom));
        this.darkGrass.push(new GrassDark(0, this.bottom));
        for (let i = 0; i < 2; i++) {
            this.lightGrass.push(new GrassLight(this.lightGrass[this.lightGrass.length - 1].posX / 2 + this.lightGrass[this.lightGrass.length - 1].getWidth() / 2, this.bottom));
            this.darkGrass.push(new GrassDark(this.darkGrass[this.darkGrass.length - 1].posX / 2 + this.darkGrass[this.darkGrass.length - 1].getWidth() / 2, this.bottom));
        }
        for (let i = 0; i < 2; i++) {
            this.mushrooms.push(new Mushroom(Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1, window.innerHeight / 4));
            this.mushrooms[i].image.height /= 2;
            this.mushrooms[i].image.width /= 2;
        }
        this.lightGrass.forEach((grass) => {
            grass.image.width /= 2;
            grass.image.height /= 2;
            grass.posY -= grass.image.height;
        });
        this.darkGrass.forEach((grass) => {
            grass.image.width /= 2;
            grass.image.height /= 2;
            grass.posY -= grass.image.height;
        });
    }
    update(frameTime) {
        this.player.posX += 1;
        this.player.angle += 3.141592653;
        if (this.player.posX >= window.innerWidth) {
            this.player.posX = 0 - this.player.image.width * 3;
        }
        this.totalTime += frameTime;
        const cycleDuration = 10000 / this.daySpeed;
        const phaseDuration = cycleDuration / 5;
        const currentPhase = Math.floor((this.totalTime % cycleDuration) / phaseDuration);
        const phaseProgress = (this.totalTime % phaseDuration) / phaseDuration;
        switch (currentPhase) {
            case 0:
                this.red = 120;
                this.green = 220;
                this.blue = 300;
                this.sunSpeed = 0;
                this.darkness = 0;
                break;
            case 1:
                this.red = Math.floor(120 - phaseProgress * 120);
                this.green = Math.floor(220 - phaseProgress * 220);
                this.blue = Math.floor(300 - phaseProgress * 250);
                this.sunSpeed = 1 * this.daySpeed;
                this.darkness += 0.006 * this.daySpeed;
                break;
            case 2:
                this.red = 0;
                this.green = 0;
                this.blue = 50;
                this.sunSpeed = 0;
                break;
            case 3:
                this.red = Math.floor(phaseProgress * 255);
                this.green = Math.floor(phaseProgress * 135);
                this.blue = 0;
                this.sunSpeed = -0.5 * this.daySpeed;
                this.darkness -= 0.003 * this.daySpeed;
                break;
            case 4:
                this.red = Math.floor(255 - phaseProgress * 135);
                this.green = Math.floor(135 + phaseProgress * 85);
                this.blue = Math.floor(phaseProgress * 250);
                this.darkness -= 0.003 * this.daySpeed;
                this.sunSpeed = -0.5 * this.daySpeed;
                break;
            default:
                break;
        }
        this.sunHeight += this.sunSpeed;
        this.gravitate();
    }
    gravitate() {
        this.mushrooms.forEach((mushroom) => {
            if (CanvasUtil.collidesWith(this.player, mushroom)) {
                this.ySpeed = -4;
            }
        });
        this.ySpeed += 0.08;
        if (this.player.posY + this.player.image.height >= this.bottom) {
            this.player.posY = this.bottom - this.player.image.height;
            this.ySpeed *= -0.5;
            this.ySpeed -= 0.001;
        }
        this.player.posY += this.ySpeed;
    }
    render(canvas) {
        CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width, canvas.height / 6, this.red, this.green, this.blue, 1);
        CanvasUtil.fillCircle(canvas, canvas.width / 2, this.sunHeight, canvas.width / 3, 237, 233, 157, 1);
        this.lightGrass.forEach((grass) => {
            grass.render(canvas);
        });
        this.player.render(canvas);
        this.mushrooms.forEach((mushroom) => {
            mushroom.render(canvas);
        });
        this.darkGrass.forEach((grass) => {
            grass.render(canvas);
        });
        CanvasUtil.fillRectangle(canvas, 0, 0, canvas.width, canvas.height / 6, 0, 0, 0, this.darkness);
    }
}
//# sourceMappingURL=shopDecoration.js.map