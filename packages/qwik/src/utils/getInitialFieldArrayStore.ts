import type {
  FieldArrayPath,
  FieldArrayStore,
  FieldValues,
} from '@modular-forms/shared';

/**
 * Value type of the initial field array state.
 */
type InitialFieldArrayState = {
  items: number[];
  initialItems: number[];
  error: string;
};

/**
 * Returns the initial store of a field array.
 *
 * @param name The name of the field array.
 * @param state The initial state.
 *
 * @returns The initial store.
 */
export function getInitialFieldArrayStore<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  name: TFieldArrayName,
  { items, initialItems, error }: InitialFieldArrayState = {
    items: [],
    initialItems: [],
    error: '',
  }
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
