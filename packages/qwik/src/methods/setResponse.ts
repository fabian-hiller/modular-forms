import type {
  FieldValues,
  FormResponse,
  ResponseData,
} from '@modular-forms/shared';
import type {
  FieldArrayPath,
  FieldPath,
  FieldValue,
  FormStore,
} from '../types';

type ResponseOptions = Partial<{
  duration: number;
}>;

/**
 * Sets the response of the form.
 *
 * @param form The form of the response.
 * @param response The response object.
 * @param options The response options.
 */
export function setResponse<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  response: FormResponse<TResponseData>,
  options: ResponseOptions = {}
): void {
  // Destructure options
  const { duration } = options;

  // Set new response
  form.response = response;

  // If necessary, remove new response after specified duration if response has
  // not been changed in meantime
  if (duration) {
    setTimeout(() => {
      if (form.response === response) {
        form.response = {};
      }
    }, duration);
  }
}
