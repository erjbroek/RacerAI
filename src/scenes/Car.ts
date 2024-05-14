export default abstract class Car {
  public posX: number;

  public posY: number;

  public width: number;

  public height: number;

  public rotation: number;

  public abstract update(elapsed: number): void

  public abstract render(canvas: HTMLCanvasElement): void;
}
