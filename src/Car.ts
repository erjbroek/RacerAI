import Track from './Track.js';

export default abstract class Car {
  public posX: number = 0;

  public posY: number = 0;

  public width: number = 0;

  public height: number = 0;

  public rotation: number = 0;

  public xSpeed: number = 0;

  public ySpeed: number = 0;

  public alive: boolean = true;

  public onFinishLine: boolean;

  public prevPosX: number;

  public prevPosY: number;

  public abstract update(elapsed: number, track: Track): void;
}
