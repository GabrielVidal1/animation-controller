import { State as StateDef, Transition as TransitionDef } from "./types";
import { AnimationController } from "./animationController";
import { Animation } from "./animation";

interface IAnimationControllerTransitionOptions<
  Trigger extends string,
  Flag extends string
> {
  animation: Animation;
  speed?: number;
  triggers?: Trigger[];
  reverse?: boolean;
  flagConditions?: Partial<Record<Flag, boolean>>;
}

export class AnimControllerBuilder<
  State extends string = never,
  Trigger extends string = never,
  Flag extends string = never
> {
  private _states: StateDef<State>[] = [];
  private _transitions: TransitionDef<State, Trigger, Flag>[] = [];
  private _flagNames = new Set<Flag>();
  private _speed: number = 1;

  /**
   *
   * @param flag
   * @returns
   */
  public addFlag<NewFlag extends string>(
    flag: NewFlag
  ): AnimControllerBuilder<State, Trigger, Flag | NewFlag> {
    if (this._flagNames.has(flag as any)) {
      throw new Error(`Flag "${flag}" already declared`);
    }
    this._flagNames.add(flag as any);
    return this as any;
  }

  /**
   *
   * @param state
   * @returns
   */
  public addState<NewState extends string>(
    state: StateDef<NewState>
  ): AnimControllerBuilder<NewState | State, Trigger, Flag> {
    if (this._states.some((s) => s.name === state.name.toString())) {
      throw new Error(`State "${state.name}" already declared`);
    }
    this._states.push(state as any);
    return this as any;
  }

  /**
   *
   * @param transitionKey
   * @param options
   * @returns
   */
  public addTransition<
    From extends State,
    To extends State,
    NF extends Flag,
    T extends Trigger
  >(
    transitionKey: `${From}->${To}`,
    options?: IAnimationControllerTransitionOptions<T, NF>
  ): AnimControllerBuilder<State, Trigger, Flag> {
    const [from, to] = transitionKey.split("->") as [From, To];

    if (!this._states.find((s) => s.name === from)) {
      throw new Error(`State "${from}" not declared`);
    }
    if (!this._states.find((s) => s.name === to)) {
      throw new Error(`State "${to}" not declared`);
    }

    if (this._transitions.some((t) => t.from === from && t.to === to)) {
      throw new Error(`Transition "${from} -> ${to}" already declared`);
    }

    this._transitions.push({
      from,
      to,
      animation: options?.animation,
      triggers: options?.triggers,
      flagConditions: options?.flagConditions as Partial<Record<Flag, boolean>>,
      animationSpeed: options?.speed,
    });
    if (options?.reverse) {
      if (this._transitions.some((t) => t.from === to && t.to === from)) {
        throw new Error(`Transition "${to} -> ${from}" already declared`);
      }

      const reverseFlagConditions = Object.fromEntries(
        Object.entries(options.flagConditions ?? {}).map(([key, value]) => [
          key,
          !value,
        ])
      );

      this._transitions.push({
        from: to,
        to: from,
        animation: options?.animation,
        animationSpeed:
          options?.speed !== undefined ? -options.speed : undefined,
        flagConditions: reverseFlagConditions as Partial<Record<Flag, boolean>>,
      });
    }

    return this as any;
  }

  /**
   *
   * @param speed
   * @returns
   */
  public setSpeed(speed: number): AnimControllerBuilder<State, Trigger, Flag> {
    this._speed = speed;
    return this;
  }

  /**
   *
   * @param state
   * @returns
   */
  public build(): AnimationController<State, Trigger, Flag> {
    return new AnimationController(
      this._states,
      this._transitions,
      Array.from(this._flagNames),
      this._speed
    );
  }
}
