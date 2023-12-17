import { batch, untrack } from 'solid-js';
import type {
  FieldPath,
  FieldValue,
  FieldValues,
  FormStore,
  InternalFieldStore,
  Maybe,
  ResponseData,
} from '../types/index.js';
import { isFieldDirty } from './isFieldDirty';
import { updateFormDirty } from './updateFormDirty';

/**
 * Updates the dirty state of a field.
 *
 * @param form The form of the field.
 * @param field The store of the field.
 */
export function updateFieldDirty<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFielName extends FieldPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData>,
  field: InternalFieldStore<TFieldValues, TFielName>
): void {
  untrack(() => {
    // Check if field is dirty
    const dirty = isFieldDirty(
      field.startValue.get() as Maybe<FieldValue>,
      field.value.get() as Maybe<FieldValue>
    );

    // Update dirty state of field if necessary
    if (dirty !== field.dirty.get()) {
      batch(() => {
        field.dirty.set(dirty);

        // Update dirty state of form
        updateFormDirty(form, dirty);
      });
    }
  });
}
