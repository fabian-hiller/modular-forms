import type { FieldValues, FormStore, Maybe, ResponseData } from '../types';
import { getFieldAndArrayStores } from './getFieldAndArrayStores';

/**
 * Updates the invalid state of the form.
 *
 * @param form The store of the form.
 * @param dirty Whether there is an error.
 */
export function updateFormInvalid<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  invalid?: Maybe<boolean>
): void {
  form.invalid.value =
    invalid ||
    getFieldAndArrayStores(form).some(
      (fieldOrFieldArray) =>
        fieldOrFieldArray.active.peek() && fieldOrFieldArray.error.peek()
    );
}
