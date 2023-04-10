import type { FieldValues, Maybe } from '@modular-forms/shared';
import type {
  FieldPath,
  FieldStore,
  FieldValue,
  InitialFieldState,
} from '../types';
import { isFieldDirty } from './isFieldDirty';

/**
 * Returns the initial store of a field.
 *
 * @param initialState The initial state.
 *
 * @returns The initial store.
 */
export function getInitialFieldStore<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldName extends FieldPath<TFieldValues>
>(
  name: TFieldName,
  {
    value,
    initialValue = value,
    error = '',
  }: InitialFieldState<TFieldValues, TFieldName>
): FieldStore<TFieldValues, TFieldName> {
  const dirty = isFieldDirty(
    initialValue as Maybe<FieldValue>,
    value as Maybe<FieldValue>
  );
  return {
    internal: {
      initialValue,
      startValue: initialValue,
      validate: [],
      elements: [],
      consumers: [],
    },
    name,
    value,
    error,
    active: false,
    touched: dirty,
    dirty,
  };
}
