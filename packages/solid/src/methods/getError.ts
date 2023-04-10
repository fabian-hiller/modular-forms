import { FieldArrayPath, FieldPath, FieldValues } from '@modular-forms/shared';
import { FieldValue, FormState } from '../types';
import { getField, getFieldArray } from '../utils';

type ErrorOptions = Partial<{
  shouldActive: boolean;
  shouldTouched: boolean;
  shouldDirty: boolean;
}>;

/**
 * Returns the error of the specified field or field array.
 *
 * @param form The form that contains the field.
 * @param name The name of the field to get the error from.
 *
 * @returns The error of the field.
 */
export function getError<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(
  form: FormState<TFieldValues>,
  name: TFieldName | TFieldArrayName,
  options: ErrorOptions = {}
): string | undefined {
  // Destructure options and set default values
  const {
    shouldActive = true,
    shouldTouched = false,
    shouldDirty = false,
  } = options;

  // Get specified field or field array
  const fieldOrFieldArray = form.internal.fieldArrays.has(name)
    ? getFieldArray(form, name as TFieldArrayName)
    : getField(form, name as TFieldName);

  // Continue if field corresponds to filter options
  if (
    (!shouldActive || fieldOrFieldArray.getActive()) &&
    (!shouldTouched || fieldOrFieldArray.getTouched()) &&
    (!shouldDirty || fieldOrFieldArray.getDirty())
  ) {
    // Return error of field
    return fieldOrFieldArray.getError();
  }

  // Otherwise return undefined
  return undefined;
}
