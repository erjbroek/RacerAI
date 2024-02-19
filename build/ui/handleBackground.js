import Background from '../background items/Background.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import Tree from '../background items/Tree.js';
import HandleItems from './HandleItems.js';
export default class HandleBackground {
    static space = CanvasUtil.loadNewImage('./assets/space.png');
    ;
    static backgrounds = [];
    static trees = [];
    static touchingGround = false;
    static touchedGround = false;
    static moveScenery(player, xSpeed, ySpeed) {
        if (player.posY >= window.innerHeight / 2
            || HandleBackground.backgrounds[0].getPosY() + HandleBackground.backgrounds[0].getHeight() < window.innerHeight) {
            HandleBackground.backgrounds.forEach((background) => {
                background.move(xSpeed, 0);
                background.setPosY(window.innerHeight - background.getHeight());
            });
            player.move(ySpeed);
        }
        else {
            HandleBackground.backgrounds.forEach((background) => {
                background.move(xSpeed, ySpeed);
            });
        }
        if (player.posY + player.image.height > window.innerHeight) {
            HandleBackground.touchingGround = true;
        }
        else {
            HandleBackground.touchingGround = false;
        }
    }
    static addScenery() {
        if (HandleBackground.backgrounds.length < 2) {
            if (HandleBackground.backgrounds[0].getPosX() + HandleBackground.backgrounds[0].getWidth() <= window.innerWidth) {
                HandleBackground.backgrounds.push(new Background(HandleBackground.backgrounds[0].getPosX()
                    + HandleBackground.backgrounds[0].getWidth(), HandleBackground.backgrounds[0].getPosY(), Math.random()));
            }
        }
        while (HandleBackground.trees.filter((obj) => obj instanceof Tree).length < 5) {
            HandleBackground.trees.push(new Tree(window.innerWidth + window.innerWidth * Math.random(), (HandleBackground.backgrounds[0].getPosY() + HandleBackground.backgrounds[0].getHeight())));
        }
    }
    static removeUnusedScenery() {
        if (HandleBackground.backgrounds[0].getPosX() + HandleBackground.backgrounds[0].getWidth() <= 0) {
            HandleBackground.backgrounds.splice(0, 1);
        }
        HandleBackground.trees.forEach((tree) => {
            if (tree.posX <= -1000) {
                HandleBackground.trees.splice(HandleBackground.trees.indexOf(tree), 1);
            }
        });
    }
    static render(canvas, player) {
        HandleBackground.backgrounds.forEach((background) => {
            background.render(canvas);
        });
        player.render(canvas);
        HandleItems.render(canvas);
        HandleBackground.trees.forEach((tree) => {
            tree.render(canvas);
        });
        CanvasUtil.drawImage(canvas, HandleBackground.space, 0, HandleBackground.backgrounds[0].getPosY() - window.innerHeight * 5, window.innerWidth, window.innerHeight * 5, 0);
    }
}
//# sourceMappingURL=HandleBackground.js.map