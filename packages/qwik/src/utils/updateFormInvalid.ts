import type { FieldValues, Maybe, ResponseData } from '@modular-forms/shared';
import type {
  FieldArrayPath,
  FieldPath,
  FieldValue,
  FormStore,
} from '../types';
import { getFieldAndArrayStores } from './getFieldAndArrayStores';

/**
 * Updates the invalid state of the form.
 *
 * @param form The store of the form.
 * @param dirty Whether there is an error.
 */
export function updateFormInvalid<
  TFieldValues extends FieldValues<FieldValue>,
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
