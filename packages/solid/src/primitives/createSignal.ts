import type { Accessor, Setter } from 'solid-js';
import { createSignal as createSolidSignal } from 'solid-js';

/**
 * Value type of signal object.
 */
export type Signal<T> = { get: Accessor<T>; set: Setter<T> };

/**
 * Creates a simple reactive state with a getter and setter.
 */
export function createSignal<T>(): Signal<T | undefined>;
export function createSignal<T>(value: T): Signal<T>;
export function createSignal<T>(value?: T) {
  const [get, set] = createSolidSignal(value);
  return { get, set };
}
