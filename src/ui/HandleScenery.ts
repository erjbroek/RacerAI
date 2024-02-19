import Background from '../background items/Background.js';
import BackgroundItems from '../background items/BackgroundItems.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import Player from '../drawables/Player.js';
import Coin from '../drawables/Coin.js';
import HandleScore from './handleScore.js';
import Tree from '../background items/Tree.js';
import HandleItems from './HandleItems.js';

export default class HandleScenery {
  public static space: HTMLImageElement = CanvasUtil.loadNewImage('./assets/space.png');;

  public static backgrounds: BackgroundItems[] = [];

  public static trees: Tree[] = [];

  public static touchingGround: boolean = false;

  public static touchedGround: boolean = false;

  /**
   * moves all items rendered.
   *
   * @param player the character (mister duck) that you play with
   * @param xSpeed horizontal speed
   * @param ySpeed vertical speed
   */
  public static moveScenery(player: Player, xSpeed: number, ySpeed: number) {
    // if the player should move up or down
    if (player.posY >= window.innerHeight / 2
    || HandleScenery.backgrounds[0].getPosY() + HandleScenery.backgrounds[0].getHeight() < window.innerHeight) {
      HandleScenery.backgrounds.forEach((background) => {
        background.move(xSpeed, 0);
        background.setPosY(window.innerHeight - background.getHeight());
      });
      HandleScenery.trees.forEach((tree) => {
        tree.move(xSpeed * 1.3, 0);
      });
    } else {
      // just the background moves
      HandleScenery.backgrounds.forEach((background) => {
        background.move(xSpeed, ySpeed);
      });
      HandleScenery.trees.forEach((tree) => {
        tree.move(xSpeed * 1.3, ySpeed);
      });
    }
  }

  /**
   *
   */
  public static addScenery() {
    if (HandleScenery.backgrounds.length < 2) {
      if (HandleScenery.backgrounds[0].getPosX() + HandleScenery.backgrounds[0].getWidth() <= window.innerWidth) {
        HandleScenery.backgrounds.push(new Background(HandleScenery.backgrounds[0].getPosX()
        + HandleScenery.backgrounds[0].getWidth(), HandleScenery.backgrounds[0].getPosY(), Math.random()));
      }
    }

    while (HandleScenery.trees.filter((obj) => obj instanceof Tree).length < 2) {
      HandleScenery.trees.push(new Tree(
        window.innerWidth + window.innerWidth * Math.random(),
        (HandleScenery.backgrounds[0].getPosY() + HandleScenery.backgrounds[0].getHeight()),
      ));
    }
  }

  /**
   *
   */
  public static removeUnusedScenery() {
    if (HandleScenery.backgrounds[0].getPosX() + HandleScenery.backgrounds[0].getWidth() <= 0) {
      HandleScenery.backgrounds.splice(0, 1);
    }

    HandleScenery.trees.forEach((tree) => {
      if (tree.getPosX() <= -1000) {
        HandleScenery.trees.splice(HandleScenery.trees.indexOf(tree), 1);
      }
    });
  }

  /**
   * renders the objects to the canvas
   * @param canvas the selected canvas objects are rendered to
   */
  public static render(canvas: HTMLCanvasElement, player: Player) {
    HandleScenery.backgrounds.forEach((background) => {
      background.render(canvas);
    });
    CanvasUtil.drawImage(canvas, HandleScenery.space, 0, HandleScenery.backgrounds[0].getPosY() - window.innerHeight * 5, window.innerWidth, window.innerHeight * 5, 0);
    player.render(canvas);
    HandleItems.render(canvas);
    HandleScenery.trees.forEach((tree) => {
      tree.render(canvas);
    });
  }

  public static reset() {
    HandleScenery.trees = [];
    HandleScenery.backgrounds = [];
    HandleScenery.touchedGround = false;
    HandleScenery.touchingGround = false;
  }
}
