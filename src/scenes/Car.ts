export default abstract class Car {
  public posX: number;

  public posY: number;

  public width: number;

  public height: number;

  public rotation: number;

  public xSpeed: number;

  public ySpeed: number;

  public abstract update(elapsed: number): void;
}
