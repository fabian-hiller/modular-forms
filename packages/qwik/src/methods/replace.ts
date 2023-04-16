import type {
  FieldArrayPath,
  FieldArrayPathValue,
  FieldValues,
  FormStore,
  ResponseData,
} from '../types';
import { getFieldArrayStore, getUniqueId, setFieldArrayValue } from '../utils';

/**
 * Value type of the replace options.
 */
export type ReplaceOptions<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  at: number;
  value: FieldArrayPathValue<TFieldValues, TFieldArrayName>[number];
};

/**
 * Replaces a item of the field array.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param options The replace options.
 */
export function replace<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: TFieldArrayName,
  options: ReplaceOptions<TFieldValues, TFieldArrayName>
): void {
  // Get store of specified field array
  const fieldArray = getFieldArrayStore(form, name);

  // Continue if specified field array exists
  if (fieldArray) {
    // Destructure options
    const { at: index } = options;

    // Get last index of field array
    const lastIndex = fieldArray.items.length - 1;

    // Continue if specified index is valid
    if (index >= 0 && index <= lastIndex) {
      // Replace value of field array
      setFieldArrayValue(form, name, options);

      // Replace item at field array
      fieldArray.items[index] = getUniqueId();

      // Set touched at field array and form to true
      fieldArray.touched = true;
      form.touched = true;

      // Set dirty at field array and form to true
      fieldArray.dirty = true;
      form.dirty = true;
    }
  }
}
