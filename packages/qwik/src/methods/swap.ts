import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormStore,
  RawFieldArrayState,
  RawFieldState,
} from '../types';
import {
  getFieldArrayStore,
  getFieldArrayState,
  getFieldState,
  getPathIndex,
  getFieldNames,
  setFieldStore,
  getFieldArrayNames,
  setFieldArrayStore,
  updateFieldArrayDirty,
} from '../utils';

type SwapOptions = {
  at: number;
  and: number;
};

/**
 * Swaps two fields of a field array by their index.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param options The swap options.
 */
export function swap<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TFieldName, TFieldArrayName>,
  name: TFieldArrayName,
  options: SwapOptions
): void {
  // Destructure options
  const { at: index1, and: index2 } = options;

  // Get store of specified field array
  const fieldArray = getFieldArrayStore(form, name);

  // Get last index of field array
  const lastIndex = fieldArray.items.length - 1;

  // Continue if specified indexes are valid
  if (
    index1 >= 0 &&
    index1 <= lastIndex &&
    index2 >= 0 &&
    index2 <= lastIndex &&
    index1 !== index2
  ) {
    // Create prefix for each index
    const index1Prefix = `${name}.${index1}`;
    const index2Prefix = `${name}.${index2}`;

    // Create field and field array state map
    const fieldStateMap = new Map<
      TFieldName,
      RawFieldState<TFieldValues, TFieldName>
    >();
    const fieldArrayStateMap = new Map<TFieldArrayName, RawFieldArrayState>();

    // Create filter name function
    const filterName = <T extends string>(value: T) =>
      value.startsWith(`${name}.`) &&
      [index1, index2].includes(getPathIndex(name, value));

    // Create swap index function
    const swapIndex = <T extends string>(value: T): T =>
      (value.startsWith(index1Prefix)
        ? value.replace(index1Prefix, index2Prefix)
        : value.replace(index2Prefix, index1Prefix)) as T;

    // Add state of each required field to map
    getFieldNames(form)
      .filter(filterName)
      .forEach((fieldName) =>
        fieldStateMap.set(fieldName, getFieldState(form, fieldName))
      );

    // Finally swap state of fields
    fieldStateMap.forEach((fieldState, fieldName) =>
      setFieldStore(form, swapIndex(fieldName), fieldState)
    );

    // Add state of each required field array to map
    getFieldArrayNames(form)
      .filter(filterName)
      .forEach((fieldArrayName) =>
        fieldArrayStateMap.set(
          fieldArrayName,
          getFieldArrayState(form, fieldArrayName)
        )
      );

    // Finally swap state of field arrays
    fieldArrayStateMap.forEach((fieldArrayState, fieldArrayName) =>
      setFieldArrayStore(form, swapIndex(fieldArrayName), fieldArrayState)
    );

    // Swap items of field array
    const itemIndex1 = fieldArray.items[index1];
    fieldArray.items[index1] = fieldArray.items[index2];
    fieldArray.items[index2] = itemIndex1;

    // Set touched at field array and form to true;
    fieldArray.touched = true;
    form.touched = true;

    // Update dirty state at field array and form
    updateFieldArrayDirty(form, fieldArray);
  }
}
