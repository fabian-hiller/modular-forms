import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormStore,
  Maybe,
  ResponseData,
} from '../types';
import { getFieldAndArrayStores } from './getFieldAndArrayStores';

/**
 * Updates the invalid state of the form.
 *
 * @param form The store of the form.
 * @param dirty Whether there is an error.
 */
export function updateFormInvalid<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  invalid?: Maybe<boolean>
): void {
  form.invalid =
    invalid ||
    getFieldAndArrayStores(form).some(
      (fieldOrFieldArray) => fieldOrFieldArray.active && fieldOrFieldArray.error
    );
}
