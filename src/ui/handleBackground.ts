import Background from '../background items/Background.js';
import BackgroundItems from '../background items/BackgroundItems.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import Player from '../drawables/Player.js';

export default class HandleBackground {
  private space: HTMLImageElement;

  private backgrounds: BackgroundItems[];

  private touchingGround: boolean;

  public touchedGround: boolean = false;

  public constructor() {
    this.backgrounds = [];
    this.backgrounds.push(new Background(0, window.innerHeight - 302 * 4, 1));
    this.space = CanvasUtil.loadNewImage('./assets/space.png');
    this.touchingGround = false;
  }

  /**
   * @param player the character (mister duck) that you play with
   * @param xSpeed horizontal speed
   * @param ySpeed vertical speed
   */
  public moveBackground(player: Player, xSpeed: number, ySpeed: number) {
    if (player.posY >= window.innerHeight / 2
    || this.backgrounds[0].getPosY() + this.backgrounds[0].getHeight() < window.innerHeight) {
      this.backgrounds.forEach((background) => {
        background.move(xSpeed, 0);
      });
      player.move(ySpeed);
    } else {
      this.backgrounds.forEach((background) => {
        background.move(xSpeed, ySpeed);
      });
    }


    if (this.backgrounds.length < 2) {
      if (this.backgrounds[0].getPosX() + this.backgrounds[0].getWidth() <= window.innerWidth) {
        this.backgrounds.push(new Background(this.backgrounds[0].getPosX()
        + this.backgrounds[0].getWidth(), this.backgrounds[0].getPosY(), Math.random()));
      }
    }

    if (this.backgrounds[0].getPosX() + this.backgrounds[0].getWidth() <= 0) {
      this.backgrounds.splice(0, 1);
    }

    if (player.posY + player.image.height > window.innerHeight) {
      this.touchingGround = true;
    } else {
      this.touchingGround = false;
    }
  }

  public getPosY() {
    return this.backgrounds[0].getPosY();
  }

  public setPosY(height: number) {
    return this.backgrounds[0].setPosY(height);
  }

  public getHeight() {
    return this.backgrounds[0].getHeight();
  }

  /**
   * returns true if the player is touching the ground
   * 
   * @returns boolean
   */
  public isTouchingGround(): boolean {
    return this.touchingGround;
  }

  /**
   * renders the objects to the canvas
   * @param canvas the selected canvas objects are rendered to
   */
  public render(canvas: HTMLCanvasElement) {
    this.backgrounds.forEach((item) => {
      item.render(canvas);
    });
    CanvasUtil.drawImage(
      canvas,
      this.space,
      0,
      this.backgrounds[0].getPosY() - window.innerHeight * 5,
      window.innerWidth,
      window.innerHeight * 5,
      0,
    );
  }
}
