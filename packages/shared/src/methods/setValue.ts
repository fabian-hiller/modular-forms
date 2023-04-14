import type {
  FieldArrayPath,
  FieldPath,
  FieldPathValue,
  FieldStore,
  FieldValues,
  FormStore,
  ResponseData,
} from '../types';
import { updateFieldDirty, validateIfRequired } from '../utils';

/**
 * Value type of the value options.
 */
export type ValueOptions = Partial<{
  shouldTouched: boolean;
  shouldDirty: boolean;
  shouldValidate: boolean;
  shouldFocus: boolean;
}>;

/**
 * Sets the value of the specified field.
 *
 * @param initialize The initialize function.
 * @param form The form of the field.
 * @param name The name of the field.
 * @param value The value to bet set.
 * @param options The value options.
 */
export function setValue<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  initialize: (
    form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
    name: TFieldName
  ) => FieldStore<TFieldValues, TFieldName>,
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldName,
  value: FieldPathValue<TFieldValues, TFieldName>,
  {
    shouldTouched = true,
    shouldDirty = true,
    shouldValidate = true,
    shouldFocus = true,
  }: ValueOptions = {}
): void {
  // Initialize store of specified field
  const field = initialize(form, name);

  // Set new value
  field.value = value;

  // Update touched if set to "true"
  if (shouldTouched) {
    field.touched = true;
    form.touched = true;
  }

  // Update dirty if set to "true"
  if (shouldDirty) {
    updateFieldDirty(form, field);
  }

  // Validate if set to "true" and necessary
  if (shouldValidate) {
    validateIfRequired(form, field, name, {
      on: ['touched', 'input'],
      shouldFocus,
    });
  }
}
