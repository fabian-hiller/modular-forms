import type {
  FieldValues,
  FormResponse,
  FormStore,
  Maybe,
  ResponseData,
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
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  response: FormResponse<TResponseData>,
  options: Maybe<ResponseOptions> = {}
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
