import { FieldValues } from '@modular-forms/shared';
import { batch } from 'solid-js';
import {
  FieldPath,
  FieldPathValue,
  FieldStore,
  FieldValue,
  FormState,
} from '../types';
import { updateFieldDirty } from './updateFieldDirty';
import { validateIfNecessary } from './validateIfNecessary';

/**
 * Updates the input state of a field.
 *
 * @param form The form that contains the field.
 * @param field The field to be updated.
 */
export function updateFieldInput<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldName extends FieldPath<TFieldValues>
>(
  form: FormState<TFieldValues>,
  field: FieldStore<TFieldValues, TFieldName>,
  name: TFieldName,
  input: FieldPathValue<TFieldValues, TFieldName>
): void {
  // Sync state updates and prevent unnecessary recalculation
  batch(() => {
    // Update input state
    field.setInput(() => input);

    // Update touched state
    field.setTouched(true);
    form.internal.setTouched(true);

    // Update dirty state
    updateFieldDirty(form, field);

    // Validate value if necessary
    validateIfNecessary(form, field, name, { on: ['touched', 'input'] });
  });
}
