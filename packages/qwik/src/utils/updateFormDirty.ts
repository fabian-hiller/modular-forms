import type { FieldValues, Maybe, ResponseData } from '@modular-forms/shared';
import type {
  FieldArrayPath,
  FieldPath,
  FieldValue,
  FormStore,
} from '../types';
import { getFieldAndArrayStores } from './getFieldAndArrayStores';

/**
 * Updates the dirty state of the form.
 *
 * @param form The store of the form.
 * @param dirty Whether dirty state is true.
 */
export function updateFormDirty<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  dirty?: Maybe<boolean>
): void {
  form.dirty =
    dirty ||
    getFieldAndArrayStores(form).some(
      (fieldOrFieldArray) => fieldOrFieldArray.active && fieldOrFieldArray.dirty
    );
}
