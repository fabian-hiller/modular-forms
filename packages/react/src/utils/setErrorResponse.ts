import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormErrors,
  FormStore,
  Maybe,
  ResponseData,
} from '../types';
import { getFieldArrayStore } from './getFieldArrayStore';
import { getFieldStore } from './getFieldStore';

/**
 * Value type of the error response options.
 */
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
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  formErrors: FormErrors<TFieldValues>,
  { shouldActive = true }: ErrorResponseOptions
): void {
  // Combine errors that were not set for any field or field array into one
  // general form error response message
  const message = Object.entries<Maybe<string>>(formErrors)
    .reduce<string[]>((errors, [name, error]) => {
      if (
        [
          getFieldStore(form, name as FieldPath<TFieldValues>),
          getFieldArrayStore(form, name as FieldArrayPath<TFieldValues>),
        ].every(
          (fieldOrFieldArray) =>
            !fieldOrFieldArray ||
            (shouldActive && !fieldOrFieldArray.active.peek())
        )
      ) {
        errors.push(error!);
      }
      return errors;
    }, [])
    .join(' ');

  // If there is a error message, set it as form response
  if (message) {
    form.response.value = {
      status: 'error',
      message,
    };
  }
}
