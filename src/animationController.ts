import { State as StateDef, Transition as TransitionDef } from "./types";

export class AnimationController<
  StateName extends string,
  Trigger extends string,
  Flag extends string
> {
  public currentState: StateName;
  public readonly states: StateDef<StateName>[];
  public readonly transitions: TransitionDef<StateName, Trigger, Flag>[];
  private flags: Record<Flag, boolean>;

  private speed: number = 1;

  private triggersValues: Record<Trigger, boolean> = {} as Record<
    Trigger,
    boolean
  >;

  constructor(
    states: StateDef<StateName>[],
    transitions: TransitionDef<StateName, Trigger, Flag>[],
    flagNames: Flag[],
    speed: number = 1
  ) {
    if (states.length === 0) {
      throw new Error("AnimationController requires at least one state");
    }
    this.states = states;
    this.transitions = transitions;
    this.currentState = states[0].name;
    this.speed = speed;

    // initialize all flags to false
    this.flags = Object.fromEntries(flagNames.map((f) => [f, false])) as Record<
      Flag,
      boolean
    >;
  }

  private get currentStateDef(): StateDef<StateName> | null {
    const state = this.states.find((s) => s.name === this.currentState);
    return state ?? null;
  }

  /** set a boolean flag (e.g. “isHover”) */
  public setFlag(flag: Flag, value: boolean): void {
    if (!(flag in this.flags)) {
      throw new Error(`Unknown flag "${flag}"`);
    }
    this.flags[flag] = value;
  }

  /** read a boolean flag’s value */
  public getFlag(flag: Flag): boolean {
    if (!(flag in this.flags)) {
      throw new Error(`Unknown flag "${flag}"`);
    }
    return this.flags[flag];
  }

  /**
   * Fire a named trigger (e.g. “click” or “talk”).
   * Finds the first transition matching:
   *  - from === currentState
   *  - trigger === passed trigger
   *  - all flagConditions match
   *  - optional condition() returns true
   * Then updates currentState.
   */
  public fireTrigger(trigger: Trigger): void {
    const transition = this.transitions.find(
      (tr) =>
        tr.from === this.currentState &&
        tr.triggers?.includes(trigger) &&
        (!tr.flagConditions ||
          Object.entries(tr.flagConditions).every(
            ([f, v]) => this.flags[f as Flag] === v
          )) &&
        (!tr.condition || tr.condition())
    );
    if (!transition) {
      console.warn(`No transition from "${this.currentState}" on "${trigger}"`);
      return;
    }
    if (transition.triggers?.includes(trigger)) {
      this.triggersValues[trigger] = false;
    }

    this.currentState = transition.to;
  }

  /**
   * Loop through the frames of the current state at the given frameDuration.
   * @param onFrame callback invoked with each frame (e.g. a URL or Image)
   */
  public play(): void {
    const state = this.states.find((s) => s.name === this.currentState);
    if (!state) {
      throw new Error(`Unknown state "${this.currentState}"`);
    }
    this.currentStateDef?.animation.stop();
    state.animation.play();
  }

  /** Stop the current looping playback (if any) */
  public stop(): void {
    this?.currentStateDef?.animation.stop();
  }
}
