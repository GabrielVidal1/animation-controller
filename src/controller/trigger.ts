import { TransitionTriggerType } from "./types";

export type TriggerParams = {
  interrupt?: boolean;
};

export const buildTriggers = <Trigger extends string>(
  transitionTrigger?: TransitionTriggerType<Trigger>
): Partial<Record<Trigger, TriggerParams>> => {
  if (!transitionTrigger) {
    return {};
  }

  if (transitionTrigger.trigger) {
    return {
      [transitionTrigger.trigger]: {},
    } as Partial<Record<Trigger, TriggerParams>>;
  }

  if (Array.isArray(transitionTrigger.triggers)) {
    return Object.fromEntries(
      transitionTrigger.triggers.map((trigger) => [trigger, {}])
    ) as Partial<Record<Trigger, TriggerParams>>;
  }

  return transitionTrigger.triggers ?? {};
};
