import { useSignal, useTask$ } from '@builder.io/qwik';
import { isBrowser } from '@builder.io/qwik/build';

/**
 * Freezes the text for the specified delay to prevent the UI from jumping
 * during animations.
 *
 * @param text The text.
 * @param delay The delay.
 *
 * @returns The frozen text.
 */
export function useFrozenText(
  text: { value: string | undefined },
  delay: number
) {
  // Use frozen text signal
  const frozenText = useSignal<string>();

  // Freeze text specified delay
  useTask$(({ track, cleanup }) => {
    const nextText = track(() => text.value);
    if (isBrowser && !nextText) {
      const timeout = setTimeout(() => (frozenText.value = nextText), delay);
      cleanup(() => clearTimeout(timeout));
    } else {
      frozenText.value = nextText;
    }
  });

  // Return frozen text signal
  return frozenText;
}
