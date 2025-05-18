import { AnimationType } from "../animation/types";
import { AnimationController } from "./controller";
import { StateParams } from "./state";
import { Transition } from "./transition";
import { buildTriggers } from "./trigger";
import { IAnimationControllerTransitionOptions } from "./types";

export class AnimControllerBuilder<
  State extends string = never,
  Trigger extends string = never,
  Flag extends string = never,
  AnimType extends AnimationType = AnimationType
> {
  private _states: StateParams<State, AnimType>[] = [];
  private _transitions: Transition<State, Trigger, Flag, AnimType>[] = [];
  private _flagNames = new Set<Flag>();
  private _triggerNames = new Set<Trigger>();
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

  public addTrigger<NewTrigger extends string>(
    trigger: NewTrigger
  ): AnimControllerBuilder<State, Trigger | NewTrigger, Flag> {
    if (this._triggerNames.has(trigger as any)) {
      throw new Error(`Trigger "${trigger}" already declared`);
    }
    this._triggerNames.add(trigger as any);
    return this as any;
  }

  /**
   *
   * @param state
   * @returns
   */
  public addState<NewState extends string>(
    state: StateParams<NewState, AnimType>
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
  public addTransition<From extends State, To extends State>(
    transitionKey: `${From}->${To}`,
    optionsRaw?: IAnimationControllerTransitionOptions<Trigger, Flag, AnimType>
  ): AnimControllerBuilder<State, Trigger, Flag> {
    const [from, to] = transitionKey.split("->") as [From, To];

    // Sanity checks
    if (!this._states.find((s) => s.name === from)) {
      throw new Error(`State "${from}" not declared`);
    }
    if (!this._states.find((s) => s.name === to)) {
      throw new Error(`State "${to}" not declared`);
    }

    const options = optionsRaw as any;

    this._transitions.push({
      from,
      to,
      animation: options?.animation,
      triggers: buildTriggers(options),
      flagConditions: options?.flagConditions,
      animationSpeed: options?.speed,
    });
    if (options?.reverse) {
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
