import { batch, untrack } from 'solid-js';
import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormStore,
  RawFieldArrayState,
  RawFieldState,
  ResponseData,
} from '../types';
import {
  getFieldArrayNames,
  getFieldArrayState,
  getFieldArrayStore,
  getFieldNames,
  getFieldState,
  getPathIndex,
  setFieldArrayState,
  setFieldState,
  updateFieldArrayDirty,
} from '../utils';

/**
 * Value type of the replace options.
 */
export type SwapOptions = {
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
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: FieldArrayPath<TFieldValues>,
  { at: index1, and: index2 }: SwapOptions
): void {
  // Get store of specified field array
  const fieldArray = getFieldArrayStore(form, name);

  // Continue if specified field array exists
  if (fieldArray) {
    untrack(() => {
      // Get last index of field array
      const lastIndex = fieldArray.items.get().length - 1;

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
          FieldPath<TFieldValues>,
          RawFieldState<TFieldValues, FieldPath<TFieldValues>>
        >();
        const fieldArrayStateMap = new Map<
          FieldArrayPath<TFieldValues>,
          RawFieldArrayState
        >();

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
            fieldStateMap.set(fieldName, getFieldState(form, fieldName)!)
          );

        // Add state of each required field array to map
        getFieldArrayNames(form)
          .filter(filterName)
          .forEach((fieldArrayName) =>
            fieldArrayStateMap.set(
              fieldArrayName,
              getFieldArrayState(form, fieldArrayName)!
            )
          );

        batch(() => {
          // Finally swap state of fields
          fieldStateMap.forEach((fieldState, fieldName) =>
            setFieldState(form, swapIndex(fieldName), fieldState)
          );

          // Finally swap state of field arrays
          fieldArrayStateMap.forEach((fieldArrayState, fieldArrayName) =>
            setFieldArrayState(form, swapIndex(fieldArrayName), fieldArrayState)
          );

          // Swap items of field array
          fieldArray.items.set((prevItems) => {
            const nextItems = [...prevItems];
            nextItems[index1] = prevItems[index2];
            nextItems[index2] = prevItems[index1];
            return nextItems;
          });

          // Set touched at field array and form to true;
          fieldArray.touched.set(true);
          form.internal.touched.set(true);

          // Update dirty state at field array and form
          updateFieldArrayDirty(form, fieldArray);
        });
      }
    });
  }
}
