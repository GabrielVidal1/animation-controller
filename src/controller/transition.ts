import { Animation } from "../animation/index";
import { AnimationType } from "../animation/types";
import { TriggerParams } from "./trigger";

/**
 * A transition from one state to another.
 */
export interface Transition<
  StateName extends string,
  TriggerName extends string,
  FlagName extends string,
  AnimType extends AnimationType
> {
  from: StateName;
  to: StateName;

  animation?: Animation<AnimType>;

  animationSpeed?: number;

  /** Optional event or trigger name */
  triggers?: Partial<Record<TriggerName, TriggerParams>>;

  /** Optional flag name(s) to check before performing the transition */
  flagConditions?: Partial<Record<FlagName, boolean>>;

  /** Optional guard‐condition; only perform the transition if this returns true */
  condition?: () => boolean;
}
