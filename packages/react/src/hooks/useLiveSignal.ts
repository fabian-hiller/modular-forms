import type { ReadonlySignal, Signal } from '@preact/signals-react';
import { useSignal, useComputed } from '@preact/signals-react';

/**
 * Signal hook that updates when the reference of the value argument changes.
 *
 * @param value A signal that may change.
 *
 * @returns A readonly signal.
 */
export function useLiveSignal<T = any>(value: Signal<T>): ReadonlySignal<T> {
  const signal = useSignal(value);
  if (signal.peek() !== value) signal.value = value;
  return useComputed(() => signal.value.value);
}
