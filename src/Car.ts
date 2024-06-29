import Track from './Track.js';

export default abstract class Car {
  public posX: number;

  public posY: number;

  public width: number;

  public height: number;

  public rotation: number;

  public xSpeed: number;

  public ySpeed: number;

  public alive: boolean;

  public onFinishLine: boolean;

  public prevPosX: number;

  public prevPosY: number;

  public abstract update(elapsed: number, track: Track): void;
}
