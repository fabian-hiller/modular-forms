import { batch } from '@preact/signals';
import type {
  FieldPath,
  FieldValue,
  FieldValues,
  FormStore,
  InternalFieldStore,
  Maybe,
  ResponseData,
} from '../types';
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
  // Check if field is dirty
  const dirty = isFieldDirty(
    field.startValue.peek() as Maybe<FieldValue>,
    field.value.peek() as Maybe<FieldValue>
  );

  // Update dirty state of field if necessary
  if (dirty !== field.dirty.peek()) {
    batch(() => {
      field.dirty.value = dirty;

      // Update dirty state of form
      updateFormDirty(form, dirty);
    });
  }
}
