import {
  FieldArrayPath,
  FieldPath,
  FieldPathValue,
  FieldValues,
  ResponseData,
} from '@modular-forms/shared';
import { batch } from 'solid-js';
import { FieldStore, FieldValue, FormStore } from '../types';
import { updateFieldDirty } from './updateFieldDirty';
import { validateIfRequired } from './validateIfRequired';

/**
 * Updates the value state of a field.
 *
 * @param form The form of the field.
 * @param field The store of the field.
 * @param name The name of the field.
 * @param value The new value of the field.
 */
export function updateFieldValue<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  field: FieldStore<TFieldValues, TFieldName>,
  name: TFieldName,
  value: FieldPathValue<TFieldValues, TFieldName, FieldValue>
): void {
  // Sync state updates and prevent unnecessary recalculation
  batch(() => {
    // Update value state
    field.internal.setValue(() => value);

    // Update touched state
    field.internal.setTouched(true);
    form.internal.setTouched(true);

    // Update dirty state
    updateFieldDirty(form, field);

    // Validate value if necessary
    validateIfRequired(form, field, name, {
      on: ['touched', 'input'],
    });
  });
}
