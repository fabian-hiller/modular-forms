import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormErrors,
  Maybe,
  ResponseData,
} from '@modular-forms/shared';
import type {
  FieldArrayStore,
  FieldStore,
  FieldValue,
  FormStore,
} from '../types';
import { getFieldArrayStore } from './getFieldArrayStore';
import { getFieldStore } from './getFieldStore';

type ErrorResponseOptions = Partial<{
  shouldActive: boolean;
}>;

/**
 * Sets an error response if a form error was not set at any field or field
 * array.
 *
 * @param form The form of the errors.
 * @param formErrors The form errors.
 * @param options The error options.
 */
export function setErrorResponse<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  formErrors: FormErrors<TFieldValues, FieldValue>,
  { shouldActive = true }: ErrorResponseOptions
): void {
  // Combine errors that were not set for any field or field array into one
  // general form error response message
  const message = Object.entries(formErrors)
    .reduce<string[]>((errors, [name, error]) => {
      if (
        [
          getFieldStore(form, name as TFieldName) as Maybe<
            FieldStore<TFieldValues, TFieldName>
          >,
          getFieldArrayStore(form, name as TFieldArrayName) as Maybe<
            FieldArrayStore<TFieldValues, TFieldArrayName>
          >,
        ].every(
          (fieldOrFieldArray) =>
            !fieldOrFieldArray || (shouldActive && !fieldOrFieldArray.active)
        )
      ) {
        errors.push(error);
      }
      return errors;
    }, [])
    .join('. ');

  // If there is a error message, set it as form response
  if (message) {
    form.response = {
      status: 'error',
      message,
    };
  }
}
