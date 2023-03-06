import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { isBrowser } from "@builder.io/qwik/build";
import { Expandable } from "./Expandable";

type InputErrorProps = {
  name: string;
  error?: string;
};

/**
 * Input error that tells the user what to do to fix the problem.
 */
export const InputError = component$(({ name, error }: InputErrorProps) => {
  // Use frozen error signal
  const frozenError = useSignal<string>();

  // Freeze error while element collapses to prevent UI from jumping
  useTask$(({ track }) => {
    const nextError = track(() => error);
    if (isBrowser && !nextError) {
      setTimeout(() => (frozenError.value = nextError), 200);
    } else {
      frozenError.value = nextError;
    }
  });

  return (
    <Expandable expanded={!!error}>
      <div
        class="pt-4 text-sm text-red-500 dark:text-red-400 md:text-base lg:pt-5 lg:text-lg"
        id={`${name}-error`}
      >
        {frozenError.value}
      </div>
    </Expandable>
  );
});
