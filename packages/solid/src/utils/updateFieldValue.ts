import { batch } from 'solid-js';
import type {
  FieldPath,
  FieldPathValue,
  FieldValues,
  FormStore,
  InternalFieldStore,
  ResponseData,
} from '../types';
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
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData>,
  field: InternalFieldStore<TFieldValues, TFieldName>,
  name: TFieldName,
  value: FieldPathValue<TFieldValues, TFieldName>
): void {
  batch(() => {
    // Update value state
    field.setValue(() => value);

    // Update touched state
    field.setTouched(true);
    form.internal.setTouched(true);

    // Update dirty state
    updateFieldDirty(form, field);

    // Validate value if necessary
    validateIfRequired(form, field, name, {
      on: ['touched', 'input'],
    });
  });
}
