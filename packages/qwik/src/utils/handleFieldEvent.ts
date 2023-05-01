import type {
  FieldElement,
  FieldEvent,
  FieldPath,
  FieldPathValue,
  FieldStore,
  FieldValues,
  FormStore,
  ResponseData,
  ValidationMode,
} from '../types';
import { updateFieldDirty } from './updateFieldDirty';
import { validateIfRequired } from './validateIfRequired';

/**
 * Handles the input, change and blur event of a field.
 *
 * @param form The form of the field.
 * @param field The store of the field.
 * @param name The name of the field.
 * @param event The event of the field.
 * @param element The element of the field.
 * @param validationModes The modes of the validation.
 * @param inputValue The value of the input.
 */
export async function handleFieldEvent<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData>,
  field: FieldStore<TFieldValues, TFieldName>,
  name: TFieldName,
  event: FieldEvent,
  element: FieldElement,
  validationModes: Exclude<ValidationMode, 'submit'>[],
  inputValue?: FieldPathValue<TFieldValues, TFieldName>
) {
  // Update value state
  if (inputValue !== undefined) {
    field.value = inputValue;
  }

  // Transform value state
  for (const transformation of field.internal.transform) {
    field.value = await transformation(field.value, event, element);
  }

  // Update touched state
  field.touched = true;
  form.touched = true;

  // Update dirty state
  updateFieldDirty(form, field);

  // Validate value if required
  validateIfRequired(form, field, name, { on: validationModes });
}
