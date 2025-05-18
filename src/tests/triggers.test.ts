import { describe, expect, test } from "vitest";
import { AnimControllerBuilder } from "../controller/builder";
import { sleep } from "../technical/utils/sleep";
import { Animation } from "../animation";

describe("Animation controller triggers", () => {
  test('play jump animation on trigger "jump"', async () => {
    let playedJumpCount = 0;

    const idleAnim = new Animation({
      name: "idle",
      play: () => {},
    });

    const jumpAnim = new Animation({
      name: "jump",
      play: () => {
        playedJumpCount += 1;
        return sleep(100);
      },
    });

    const ac = new AnimControllerBuilder()
      .addState({ name: "idle", animation: idleAnim })
      .addTrigger("jump")
      .addTransition("idle->idle", {
        animation: jumpAnim,
        trigger: "jump",
      })
      .build();

    ac.start();

    expect(ac.currentState.name).toEqual("idle");

    ac.setTrigger("jump");

    await sleep(100);

    expect(ac.currentState.name).toEqual("idle");
    expect(playedJumpCount).toEqual(1);
    expect(ac.triggers.jump).toEqual(false);

    ac.setTrigger("jump");

    await sleep(100);

    expect(playedJumpCount).toEqual(2);
    expect(ac.triggers.jump).toEqual(false);
  });
});
