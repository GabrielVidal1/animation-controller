import { Animation } from "../animation/index";
import { AnimationType } from "../animation/types";
import { TriggerParams } from "./trigger";

export type TriggerOptions = Partial<TriggerParams>;

export type TransitionTriggerType<Trigger extends string> = {
  triggers?: Trigger[] | Partial<Record<Trigger, TriggerOptions>>;
  trigger?: Trigger;
};

export type IAnimationControllerTransitionOptions<
  Trigger,
  Flag,
  AnimType extends AnimationType
> =
  | {
      animation?: Animation<AnimType>;
      speed?: number;
      reverse?: boolean;
    }
  | (Flag extends string
      ? { flagConditions?: Partial<Record<Flag, boolean>> }
      : {})
  | (Trigger extends string ? TransitionTriggerType<Trigger> : {});
