import type { FieldValues, ResponseData } from '@modular-forms/shared';
import type {
  FieldArrayPath,
  FieldArrayPathValue,
  FieldPath,
  FieldValue,
  FormStore,
} from '../types';
import { getFieldArrayStore, getUniqueId, setFieldArrayValue } from '../utils';

type ReplaceOptions<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
  TFieldArrayValues extends FieldArrayPathValue<TFieldValues, TFieldArrayName>
> = {
  at: number;
  value: TFieldArrayValues[number];
};

/**
 * Replaces a item of the field array.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param options The replace options.
 */
export function replace<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
  TFieldArrayValues extends FieldArrayPathValue<TFieldValues, TFieldArrayName>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldArrayName,
  options: ReplaceOptions<TFieldValues, TFieldArrayName, TFieldArrayValues>
): void {
  // Destructure options
  const { at: index } = options;

  // Get store of specified field array
  const fieldArray = getFieldArrayStore(form, name);

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
