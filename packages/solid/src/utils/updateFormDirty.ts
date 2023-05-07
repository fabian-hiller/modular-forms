import { untrack } from 'solid-js';
import type { FieldValues, FormStore, Maybe, ResponseData } from '../types';
import { getFieldAndArrayStores } from './getFieldAndArrayStores';

/**
 * Updates the dirty state of the form.
 *
 * @param form The store of the form.
 * @param dirty Whether dirty state is true.
 */
export function updateFormDirty<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(form: FormStore<TFieldValues, TResponseData>, dirty?: Maybe<boolean>): void {
  untrack(() =>
    form.internal.dirty.set(
      dirty ||
        getFieldAndArrayStores(form).some(
          (fieldOrFieldArray) =>
            fieldOrFieldArray.active.get() && fieldOrFieldArray.dirty.get()
        )
    )
  );
}
