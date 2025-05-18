import { describe, expect, test } from "vitest";
import { AnimControllerBuilder } from "../controller/builder";

describe("Animation controller", () => {
  test("build", () => {
    const ac = new AnimControllerBuilder()
      .addState({ name: "idle" })
      .addState({ name: "walk" })
      .addFlag("isMoving")
      .addTransition("idle->walk", {
        flagConditions: { isMoving: true },
        reverse: true,
      })
      .build();

    expect(ac).toBeDefined();
    expect(ac.states).toHaveLength(2);
    expect(ac.transitions).toHaveLength(2);
  });
});
