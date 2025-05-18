export type AnimationType = () => void | Promise<void>;

export interface AnimationContructorParams<AP extends AnimationType> {
  /** The name of the animation */
  name: string;
  speed?: number;

  loop?: boolean;

  play: AP;
  stop?: () => void;
}
