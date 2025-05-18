import { AnimationType, AnimationConstructorParams } from "./types";

export class Animation<AP extends AnimationType> {
  public name: string;
  public speed: number = 1;
  public speedMultiplier: number = 1;

  private _play: AP;
  private _stop: () => void;
  private _onEnd?: () => void;
  private _onStart?: () => void;
  private _loop: boolean;

  constructor({
    name,
    play,
    stop,
    speed = 1,
    loop = false,
  }: AnimationConstructorParams<AP>) {
    this.name = name;
    this._play = play;
    this._stop = stop ?? (() => {});
    this._loop = loop;
    this.speed = speed;
  }

  public setSpeed(speed: number): void {
    this.speed = speed;
  }

  public play() {
    return this.playAnimation() as ReturnType<AP>;
  }

  private async playAnimation() {
    this._onStart?.();
    await this._play();
    this._onEnd?.();
    if (this._loop) {
      await this.playAnimation();
    }
  }

  public setOnEnd(callback: () => void): void {
    this._onEnd = callback;
  }
  public setOnStart(callback: () => void): void {
    this._onStart = callback;
  }

  public stop(): void {
    this._stop();
  }

  public clone(): Animation<AP> {
    const copy = new (this.constructor as {
      new (params: AnimationConstructorParams<AP>): Animation<AP>;
    })({} as any);
    Object.assign(copy, this);
    return copy;
  }
}
