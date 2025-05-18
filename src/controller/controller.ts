import { Animation } from "../animation/index";
import { AnimationType } from "../animation/types";
import { State, StateParams } from "./state";
import { Transition } from "./transition";

export class AnimationController<
  StateName extends string,
  Trigger extends string,
  Flag extends string,
  AnimType extends AnimationType = AnimationType
> {
  private _currentStateName: StateName;
  private readonly _states: State<StateName, AnimType>[];
  private readonly _transitions: Transition<
    StateName,
    Trigger,
    Flag,
    AnimType
  >[];

  private _flags: Record<Flag, boolean>;
  private triggersValues: Record<Trigger, boolean> = {} as Record<
    Trigger,
    boolean
  >;

  private _currentAnimation: Animation<AnimType> | null = null;

  private _speed: number = 1;

  constructor(
    states: StateParams<StateName, AnimType>[],
    transitions: Transition<StateName, Trigger, Flag, AnimType>[],
    flagNames: Flag[],
    speed: number = 1
  ) {
    if (states.length === 0) {
      throw new Error("AnimationController requires at least one state");
    }
    this._states = states;
    this._transitions = transitions;
    this._currentStateName =
      states.find((s) => s.startingState)?.name ?? states[0].name;
    this._speed = speed;

    // initialize all flags to false
    this._flags = Object.fromEntries(
      flagNames.map((f) => [f, false])
    ) as Record<Flag, boolean>;

    // initialize all triggers to false
    this.triggersValues = Object.fromEntries(
      transitions
        .flatMap((tr) => Object.keys(tr.triggers ?? {}))
        .map((trigger) => [trigger, false])
    ) as Record<Trigger, boolean>;
  }

  // #region Getters
  public get states() {
    return this._states;
  }
  public get transitions() {
    return this._transitions;
  }
  public get flags() {
    return this._flags;
  }
  public get triggers() {
    return this.triggersValues;
  }
  public get currentStateName() {
    return this._currentStateName;
  }
  public get currentState() {
    const state = this._states.find((s) => s.name === this._currentStateName);
    if (!state) {
      throw new Error(
        `AnimationController: State "${this._currentStateName}" not found`
      );
    }
    return state;
  }
  // #endregion

  // #region Set Triggers and Flags

  private triggerTransitionsWrapper() {
    if (this._currentAnimation) {
      this._currentAnimation.setOnEnd(() => {
        this.triggerTransitions();
      });
    } else {
      this.triggerTransitions();
    }
  }

  /**
   *
   */
  public setTrigger(trigger: Trigger): void {
    if (!(trigger in this.triggersValues)) {
      throw new Error(`Unknown trigger "${trigger}"`);
    }
    this.triggersValues[trigger] = true;
    this.triggerTransitionsWrapper();
  }

  /**
   * set a boolean flag (e.g. “isHover”)
   */
  public setFlag(flag: Flag, value: boolean): void {
    if (!(flag in this._flags)) {
      throw new Error(`Unknown flag "${flag}"`);
    }
    this._flags[flag] = value;
    this.triggerTransitionsWrapper();
  }

  // #endregion

  private playAnimation(animation: Animation<AnimType>) {
    console.debug(
      `AnimationController: Playing animation "${animation.name}" for state "${this._currentStateName}"`
    );
    if (this._currentAnimation) {
      console.warn(
        `AnimationController: Animation "${this._currentAnimation.name}" is already playing.`
      );
      return;
    }

    this._currentAnimation = animation.clone();
    this._currentAnimation.setOnEnd(() => {
      this.stopCurrentAnimation();
    });
    this._currentAnimation.speedMultiplier = this._speed;
    return this._currentAnimation.play();
  }

  private stopCurrentAnimation() {
    if (!this._currentAnimation) {
      console.warn(`AnimationController: No animation is currently playing.`);
      return;
    }
    this._currentAnimation.stop();
    this._currentAnimation = null;
  }

  private async triggerTransitions() {
    // loop through all transitions and find the first one that matches
    const transitionsFromCurrentState = this._transitions.filter(
      (tr) =>
        tr.from === this._currentStateName && (!tr.condition || tr.condition())
    );

    const transitionsFromFlag = transitionsFromCurrentState.filter(
      (tr) =>
        !tr.flagConditions ||
        Object.entries(tr.flagConditions).every(
          ([f, v]) => this._flags[f as Flag] === v
        )
    );

    const triggeredTransitions = transitionsFromCurrentState.filter(
      (tr) =>
        Object.keys(tr.triggers ?? {}).filter(
          (trigger) => this.triggersValues[trigger as Trigger] === true
        ).length > 0
    );

    const transition = triggeredTransitions[0] ?? transitionsFromFlag[0];
    if (!transition) return;

    // reset triggered triggers
    Object.keys(transition?.triggers ?? {})?.forEach((trigger) => {
      if (this.triggersValues[trigger as Trigger] === true) {
        this.triggersValues[trigger as Trigger] = false;
      }
    });

    // Stop the current animation
    this.stopCurrentAnimation();

    // Play the transition animation (if any)
    if (transition.animation) {
      await this.playAnimation(transition.animation);
    }

    // change the current state
    this._currentStateName = transition.to;

    // Play the new animation
    if (this.currentState?.animation) {
      await this.playAnimation(this.currentState.animation);
    }
  }

  /**
   *
   */
  public start() {
    if (!this.currentState) {
      throw new Error(`Unknown state "${this._currentStateName}"`);
    }

    const playRoutine = async () => {
      if (!this.currentState?.animation) return;
      await this.playAnimation(this.currentState.animation);
    };
    playRoutine();
  }

  /**
   * Stop the current looping playback (if any)
   */
  public stop(): void {
    this.stopCurrentAnimation();
  }

  /** Set the speed of the current animation */
  public setSpeed(speed: number): void {
    this._speed = speed;
    this._currentAnimation?.setSpeed(speed);
  }
}
