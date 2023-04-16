import type {
  FieldPath,
  FieldPathValue,
  FieldStore,
  FieldValues,
  FormStore,
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
  field: FieldStore<TFieldValues, TFieldName>,
  name: TFieldName,
  value: FieldPathValue<TFieldValues, TFieldName>
): void {
  // Update value state
  field.value = value;

  // Update touched state
  field.touched = true;
  form.touched = true;

  // Update dirty state
  updateFieldDirty(form, field);

  // Validate value if necessary
  validateIfRequired(form, field, name, {
    on: ['touched', 'input'],
  });
}
