import type {
  FieldArrayPath,
  FieldArrayPathValue,
  FieldPath,
  FieldValues,
  FormStore,
  InitializeStoreDeps,
  ResponseData,
} from '../types';
import { getFieldArrayStore, getUniqueId, setFieldArrayValue } from '../utils';

/**
 * Value type of the replace options.
 */
export type ReplaceOptions<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
  TFieldArrayValues extends FieldArrayPathValue<TFieldValues, TFieldArrayName>
> = {
  at: number;
  value: TFieldArrayValues[number];
};

/**
 * Replaces a item of the field array.
 *
 * @param deps The function dependencies.
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param options The replace options.
 */
export function replace<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
  TFieldArrayValues extends FieldArrayPathValue<TFieldValues, TFieldArrayName>
>(
  deps: InitializeStoreDeps<
    TFieldValues,
    TResponseData,
    TFieldName,
    TFieldArrayName
  >,
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldArrayName,
  options: ReplaceOptions<TFieldValues, TFieldArrayName, TFieldArrayValues>
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
      setFieldArrayValue(deps, form, name, options);

      // Replace item at field array
      const nextItems = [...fieldArray.items];
      nextItems[index] = getUniqueId();
      fieldArray.items = nextItems;

      // Set touched at field array and form to true
      fieldArray.touched = true;
      form.touched = true;

      // Set dirty at field array and form to true
      fieldArray.dirty = true;
      form.dirty = true;
    }
  }
}
