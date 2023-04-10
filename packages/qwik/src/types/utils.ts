import type { QRL } from '@builder.io/qwik';

/**
 * Returns an optional QRL type.
 */
export type MaybeQRL<T> = T | QRL<T>;
