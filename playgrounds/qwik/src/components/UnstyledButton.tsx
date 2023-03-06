import {
  component$,
  type PropFunction,
  Slot,
  useSignal,
} from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import clsx from "clsx";
import { Spinner } from "./Spinner";

type LinkProps = {
  type: "link";
  href: string;
  download?: boolean | string;
  target?: "_blank";
};

type ButtonProps = {
  type: "button";
  onClick$: PropFunction<() => unknown>;
};

type SubmitProps = {
  type: "submit";
  loading?: boolean;
};

export type DefaultButtonProps = LinkProps | ButtonProps | SubmitProps;

type UnstyledButtonProps = DefaultButtonProps & {
  class?: string;
  "aria-label"?: string;
};

/**
 * Basic button component that contains important functionality and is used to
 * build more complex components on top of it.
 */
export const UnstyledButton = component$((props: UnstyledButtonProps) => {
  // Use loading signal
  const loading = useSignal(false);

  return (
    <>
      {/* Link button */}
      {props.type === "link" && (
        <Link
          class={props.class}
          href={props.href}
          download={props.download}
          target={props.target}
          rel={props.target === "_blank" ? "noreferrer" : undefined}
          aria-label={props["aria-label"]}
        >
          <Slot />
        </Link>
      )}

      {/* Normal button */}
      {props.type === "button" && (
        <button
          type="button"
          class={props.class}
          disabled={loading.value}
          aria-label={props["aria-label"]}
          // Start and stop loading if function is async
          onClick$={async () => {
            loading.value = true;
            await props.onClick$();
            loading.value = false;
          }}
        >
          <ButtonContent loading={loading.value}>
            <Slot />
          </ButtonContent>
        </button>
      )}

      {/* Submit button */}
      {props.type === "submit" && (
        <button
          type="submit"
          class={props.class}
          disabled={props.loading}
          aria-label={props["aria-label"]}
        >
          <ButtonContent loading={props.loading}>
            <Slot />
          </ButtonContent>
        </button>
      )}
    </>
  );
});

type ContentProps = {
  loading?: boolean;
};

/**
 * Content of the button that displays a loading animation when an action is
 * performed.
 */
export const ButtonContent = component$(({ loading }: ContentProps) => (
  <>
    <div
      class={clsx(
        "transition-[opacity,transform,visibility] duration-200",
        loading ? "invisible translate-x-5 opacity-0" : "visible delay-300"
      )}
    >
      <Slot />
    </div>
    <div
      class={clsx(
        "absolute duration-200",
        loading ? "visible delay-300" : "invisible -translate-x-5 opacity-0"
      )}
    >
      <Spinner />
    </div>
  </>
));
