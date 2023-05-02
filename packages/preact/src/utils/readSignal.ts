import type { Signal } from '@preact/signals';

/**
 * It reads the value of a signal via .value or .peek().
 *
 * @param signal The signal to be read.
 * @param peek Whether to subscribe.
 *
 * @returns The value of the signal.
 */
export function readSignal<T>(signal: Signal<T>, peek: boolean): T {
  return peek ? signal.peek() : signal.value;
}
