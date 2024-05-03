import Background from '../background items/Background.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import Tree from '../background items/Tree.js';
import HandleItems from './HandleItems.js';
import GrassDark from '../background items/GrassDark.js';
import GrassLight from '../background items/GrassLight.js';
export default class HandleScenery {
    static space = CanvasUtil.loadNewImage('./assets/space.png');
    static backgrounds = [];
    static trees = [];
    static grassDark = [];
    static grassLight = [];
    static touchingGround = false;
    static touchedGround = false;
    static moveScenery(player, xSpeed, ySpeed) {
        if (player.posY >= window.innerHeight / 2
            || HandleScenery.backgrounds[0].getPosY() + HandleScenery.backgrounds[0].getHeight() < window.innerHeight) {
            HandleScenery.backgrounds.forEach((background) => {
                background.move(xSpeed, 0);
                background.setPosY(window.innerHeight - background.getHeight());
            });
            HandleScenery.trees.forEach((tree) => {
                tree.move(xSpeed * 1.38, 0);
            });
            HandleScenery.grassDark.forEach((grass) => {
                grass.move(xSpeed * 1.32, 0);
                grass.posY = window.innerHeight - grass.getHeight();
            });
            HandleScenery.grassLight.forEach((grass) => {
                grass.move(xSpeed * 1.22, 0);
                grass.posY = window.innerHeight - grass.getHeight() - 20;
            });
        }
        else {
            HandleScenery.backgrounds.forEach((background) => {
                background.move(xSpeed, ySpeed);
            });
            HandleScenery.trees.forEach((tree) => {
                tree.move(xSpeed * 1.38, ySpeed);
            });
            HandleScenery.grassDark.forEach((grass) => {
                grass.move(xSpeed * 1.32, ySpeed);
            });
            HandleScenery.grassLight.forEach((grass) => {
                grass.move(xSpeed * 1.22, ySpeed);
            });
        }
    }
    static addScenery() {
        if (HandleScenery.backgrounds.length < 2) {
            if (HandleScenery.backgrounds[0].getPosX() + HandleScenery.backgrounds[0].getWidth() <= window.innerWidth) {
                HandleScenery.backgrounds.push(new Background(HandleScenery.backgrounds[0].getPosX() + HandleScenery.backgrounds[0].getWidth(), HandleScenery.backgrounds[0].getPosY()));
            }
        }
        while (HandleScenery.trees.length < 2) {
            HandleScenery.trees.push(new Tree(window.innerWidth + window.innerWidth * Math.random(), (HandleScenery.backgrounds[0].getPosY() + HandleScenery.backgrounds[0].getHeight())));
        }
        while (HandleScenery.grassDark.length < 5) {
            HandleScenery.grassDark.push(new GrassDark(HandleScenery.grassDark[HandleScenery.grassDark.length - 1].getPosX() + HandleScenery.grassDark[0].getWidth(), (HandleScenery.backgrounds[0].getPosY() + HandleScenery.backgrounds[0].getHeight()) - 80));
        }
        while (HandleScenery.grassLight.length < 5) {
            HandleScenery.grassLight.push(new GrassLight(HandleScenery.grassLight[HandleScenery.grassLight.length - 1].getPosX() + HandleScenery.grassLight[0].getWidth(), (HandleScenery.backgrounds[0].getPosY() + HandleScenery.backgrounds[0].getHeight()) - 100));
        }
    }
    static removeUnusedScenery() {
        if (HandleScenery.backgrounds[0].getPosX() + HandleScenery.backgrounds[0].getWidth() <= -1000) {
            HandleScenery.backgrounds.splice(0, 1);
        }
        HandleScenery.trees.forEach((tree) => {
            if (tree.getPosX() <= -1000) {
                HandleScenery.trees.splice(HandleScenery.trees.indexOf(tree), 1);
            }
        });
        HandleScenery.grassDark.forEach((grass) => {
            if (grass.getPosX() + grass.getWidth() <= 0) {
                HandleScenery.grassDark.splice(HandleScenery.grassDark.indexOf(grass), 1);
            }
        });
        HandleScenery.grassLight.forEach((grass) => {
            if (grass.getPosX() + grass.getWidth() <= 0) {
                HandleScenery.grassLight.splice(HandleScenery.grassLight.indexOf(grass), 1);
            }
        });
    }
    static render(canvas, player) {
        HandleScenery.backgrounds.forEach((background) => {
            background.render(canvas);
        });
        CanvasUtil.drawImage(canvas, HandleScenery.space, 0, HandleScenery.backgrounds[0].getPosY() - window.innerHeight * 5, window.innerWidth, window.innerHeight * 5, 0);
        HandleScenery.grassLight.forEach((grass) => {
            grass.render(canvas);
        });
        player.render(canvas);
        HandleItems.render(canvas);
        HandleScenery.grassDark.forEach((grass) => {
            grass.render(canvas);
        });
        HandleScenery.trees.forEach((tree) => {
            tree.render(canvas);
        });
    }
    static reset() {
        HandleScenery.trees = [];
        HandleScenery.backgrounds = [];
        HandleScenery.grassDark = [];
        HandleScenery.grassLight = [];
        HandleScenery.touchedGround = false;
        HandleScenery.touchingGround = false;
    }
}
//# sourceMappingURL=HandleScenery.js.map