# Animation Controller

A lightweight, flexible TypeScript-based animation controller for managing complex animation state transitions using flags and triggers. Ideal for games, interactive apps, or any UI/UX scenario that requires structured animation flows.

---

## Features

* Define animation states with associated animation logic
* Use triggers or boolean flags to manage transitions
* Add conditional transitions (including reversible ones)
* Loop animations
* Clone and control individual animations
* Adjustable global speed control
* Built with TypeScript for full type safety

---

## Usage

### Install

```sh
npm install animation-controller
```

### Define Animations

```ts
const idleAnim = new Animation({ name: "idle", play: () => {} });
const walkAnim = new Animation({ name: "walk", play: () => {} });
```

### Build Controller

```ts
const ac = new AnimControllerBuilder()
  .addState({ name: "idle", animation: idleAnim })
  .addState({ name: "walk", animation: walkAnim })
  .addFlag("isMoving")
  .addTransition("idle->walk", {
    flagConditions: { isMoving: true },
    reverse: true,
  })
  .build();

ac.start();
```

### Update State

```ts
ac.setFlag("isMoving", true); // Will trigger idle -> walk
ac.setFlag("isMoving", false); // Will trigger walk -> idle (reverse)
```

---

## Concepts

### States

Each state represents a named condition with an optional animation.

### Flags

Boolean values that influence transitions.

### Triggers

One-shot signals used to initiate transitions.

### Transitions

Define how and when to move between states. Can be:

* Trigger-based
* Flag-based

---

## File Structure

```
src/
├── animation/     # Core animation logic
├── controller/    # State machine logic
├── technical/     # Utility helpers (e.g., sleep)
├── tests/         # Vitest test cases
```
