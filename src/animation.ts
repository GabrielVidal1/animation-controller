export interface IAnimation {
  /** The name of the animation */
  name: string;
  speed?: number;

  play: () => void;
  stop: () => void;
}

export class Animation implements IAnimation {
  public name: string;
  public speed?: number;

  private _play: () => void;
  private _stop: () => void;

  constructor({ name, play, stop, speed }: IAnimation) {
    this.name = name;
    this.speed = speed;
    this._play = play;
    this._stop = stop;
  }

  public play(speed?: number): void {
    if (speed) {
      this.speed = speed;
    }
    this._play();
  }

  public stop(): void {
    this._stop();
  }
}
