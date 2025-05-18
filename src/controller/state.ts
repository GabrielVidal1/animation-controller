import { Animation } from "../animation/index";
import { AnimationType } from "../animation/types";

/**
 * A single animation state.
 */
export type State<StateName extends string, AnimType extends AnimationType> = {
  name: StateName;
  animation?: Animation<AnimType>;
};

export type StateParams<
  StateName extends string,
  AnimType extends AnimationType
> = {
  name: StateName;
  animation?: Animation<AnimType>;
  startingState?: boolean;
};
