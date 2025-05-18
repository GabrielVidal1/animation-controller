import { describe, expect, test } from "vitest";
import { sleep } from "../technical/utils/sleep";
import { Animation } from "../animation";
import { AnimControllerBuilder } from "../controller/builder";

describe("Animation controller flags", () => {
  test("play walking animation on flag change", async () => {
    const idleAnim = new Animation({
      name: "idle",
      play: () => {},
    });

    const walkAnim = new Animation({
      name: "walk",
      play: () => {},
    });

    const idleToWalkAnim = new Animation({
      name: "idle->walk",
      play: () => {},
    });

    const ac = new AnimControllerBuilder()
      .addState({ name: "idle", animation: idleAnim })
      .addState({ name: "walk", animation: walkAnim })
      .addFlag("isMoving")
      .addTransition("idle->walk", {
        animation: idleToWalkAnim,
        flagConditions: { isMoving: true },
        reverse: true,
      })
      .build();

    ac.start();

    expect(ac.currentState.name).toEqual("idle");

    ac.setFlag("isMoving", true);

    await sleep(100);

    expect(ac.currentState.name).toEqual("walk");

    ac.setFlag("isMoving", false);

    await sleep(100);

    expect(ac.currentState.name).toEqual("idle");
  });
});
