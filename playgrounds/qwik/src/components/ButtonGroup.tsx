import { component$, Slot } from "@builder.io/qwik";
import clsx from "clsx";

type ButtonGroupProps = {
  class?: string;
};

/**
 * Button group displays multiple related actions side-by-side and helps with
 * arrangement and spacing.
 */
export const ButtonGroup = component$((props: ButtonGroupProps) => (
  <div class={clsx("flex flex-wrap gap-6 px-8 lg:gap-8 lg:px-10", props.class)}>
    <Slot />
  </div>
));
