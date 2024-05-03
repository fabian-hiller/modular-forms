import { untrack } from 'solid-js';
import type {
  FieldValues,
  FormResponse,
  FormStore,
  Maybe,
  ResponseData,
} from '../types/index.js';

/**
 * Value type of the set response options.
 */
export type SetResponseOptions = Partial<{
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
  { duration }: Maybe<SetResponseOptions> = {}
): void {
  // Set new response
  form.internal.response.set(response);

  // If necessary, remove new response after specified duration if response has
  // not been changed in meantime
  if (duration) {
    setTimeout(() => {
      if (untrack(form.internal.response.get) === response) {
        form.internal.response.set({});
      }
    }, duration);
  }
}
