import { Animation } from "./animation";

/**
 * A single state in your controller.
 */
export interface State<StateName extends string> {
  name: StateName;
  animation: Animation;
}

/**
 * A transition from one state to another.
 */
export interface Transition<
  StateName extends string,
  TriggerName extends string = string,
  FlagName extends string = string
> {
  from: StateName;
  to: StateName;

  animation?: Animation;

  animationSpeed?: number;

  /** Optional event or trigger name */
  triggers?: TriggerName[];

  /** Optional flag name(s) to check before performing the transition */
  flagConditions?: Partial<Record<FlagName, boolean>>;

  /** Optional guard‐condition; only perform the transition if this returns true */
  condition?: () => boolean;
}
