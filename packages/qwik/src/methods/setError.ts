import type { FieldValues, Maybe, ResponseData } from '@modular-forms/shared';
import type {
  FieldArrayPath,
  FieldArrayStore,
  FieldPath,
  FieldStore,
  FieldValue,
  FormStore,
} from '../types';
import { getFieldStore, getFieldArrayStore, updateFormInvalid } from '../utils';
import { focus } from './focus';

type ErrorOptions = Partial<{
  shouldActive: boolean;
  shouldTouched: boolean;
  shouldDirty: boolean;
  shouldFocus: boolean;
}>;

/**
 * Sets the error of the specified field or field array.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 * @param error The error message.
 * @param options The error options.
 */
export function setError<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldName | TFieldArrayName,
  error: string,
  options: ErrorOptions = {}
): void {
  // Destructure options and set default values
  const {
    shouldActive = true,
    shouldTouched = false,
    shouldDirty = false,
    shouldFocus = !!error,
  } = options;

  for (const fieldOrFieldArray of [
    getFieldStore(form, name as TFieldName) as Maybe<
      FieldStore<TFieldValues, TFieldName>
    >,
    getFieldArrayStore(form, name as TFieldArrayName) as Maybe<
      FieldArrayStore<TFieldValues, TFieldArrayName>
    >,
  ]) {
    if (
      fieldOrFieldArray &&
      (!shouldActive || fieldOrFieldArray.active) &&
      (!shouldTouched || fieldOrFieldArray.touched) &&
      (!shouldDirty || fieldOrFieldArray.dirty)
    ) {
      // Set error to field or field array
      fieldOrFieldArray.error = error;

      // Focus element if set to "true"
      if (error && 'value' in fieldOrFieldArray && shouldFocus) {
        focus(form, name as TFieldName);
      }
    }
  }

  // Update invalid state of form
  updateFormInvalid(form, !!error);
}
