import type { FieldValues } from '@modular-forms/shared';
import type {
  FieldArrayPath,
  FieldArrayStore,
  FieldValue,
  InitialFieldArrayState,
} from '../types';

/**
 * Returns the initial store of a field array.
 *
 * @param initialState The initial state.
 *
 * @returns The initial store.
 */
export function getInitialFieldArrayStore<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  name: TFieldArrayName,
  { items, initialItems = items, error = '' }: InitialFieldArrayState
): FieldArrayStore<TFieldValues, TFieldArrayName> {
  const dirty = initialItems.join() !== items.join();
  return {
    internal: {
      initialItems: [...initialItems],
      startItems: [...initialItems],
      validate: [],
      consumers: [],
    },
    name,
    items,
    error,
    active: false,
    touched: dirty,
    dirty,
  };
}
