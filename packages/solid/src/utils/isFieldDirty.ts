import type { FieldValue, Maybe } from '../types/index.js';

/**
 * Returns whether the field is dirty.
 *
 * @param startValue The start value.
 * @param currentValue The current value.
 *
 * @returns Whether is dirty.
 */
export function isFieldDirty<TFieldValue extends FieldValue>(
  startValue: Maybe<TFieldValue>,
  currentValue: Maybe<TFieldValue>
) {
  const toValue = (item: string | File | Blob) =>
    item instanceof Blob ? item.size : item;
  return Array.isArray(startValue) && Array.isArray(currentValue)
    ? startValue.map(toValue).join() !== currentValue.map(toValue).join()
    : startValue instanceof Date && currentValue instanceof Date
    ? startValue.getTime() !== currentValue.getTime()
    : Number.isNaN(startValue) && Number.isNaN(currentValue)
    ? false
    : startValue !== currentValue;
}
