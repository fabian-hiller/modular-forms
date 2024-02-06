import { batch, untrack } from 'solid-js';
import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormStore,
  RawFieldArrayState,
  RawFieldState,
  ResponseData,
} from '../types/index.js';
import {
  getFieldArrayNames,
  getFieldArrayState,
  getFieldArrayStore,
  getFieldNames,
  getFieldState,
  getPathIndex,
  setFieldArrayState,
  setFieldState,
  sortArrayPathIndex,
  updateFieldArrayDirty,
} from '../utils';

/**
 * Value type of the move options.
 */
export type MoveOptions = {
  from: number;
  to: number;
};

/**
 * Moves a field of the field array to a new position and rearranges all fields
 * in between.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param options The move options.
 */
export function move<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: FieldArrayPath<TFieldValues>,
  { from: fromIndex, to: toIndex }: MoveOptions
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
        fromIndex >= 0 &&
        fromIndex <= lastIndex &&
        toIndex >= 0 &&
        toIndex <= lastIndex &&
        fromIndex !== toIndex
      ) {
        // Create function to filter a name
        const filterName = (value: string) => {
          if (value.startsWith(name)) {
            const fieldIndex = getPathIndex(name, value);
            return (
              (fieldIndex >= fromIndex && fieldIndex <= toIndex) ||
              (fieldIndex <= fromIndex && fieldIndex >= toIndex)
            );
          }
        };

        // Create function to get previous index name
        const getPrevIndexName = <T extends string>(
          fieldOrFieldArrayName: T,
          fieldOrFieldArrayIndex: number
        ): T =>
          fieldOrFieldArrayName.replace(
            `${name}.${fieldOrFieldArrayIndex}`,
            fromIndex < toIndex
              ? `${name}.${fieldOrFieldArrayIndex - 1}`
              : `${name}.${fieldOrFieldArrayIndex + 1}`
          ) as T;

        // Create function to get "to" index name
        const getToIndexName = <T extends string>(
          fieldOrFieldArrayName: T
        ): T =>
          fieldOrFieldArrayName.replace(
            `${name}.${fromIndex}`,
            `${name}.${toIndex}`
          ) as T;

        // Create list of all affected field and field array names
        const fieldNames = getFieldNames(form)
          .filter(filterName)
          .sort(sortArrayPathIndex(name));
        const fieldArrayNames = getFieldArrayNames(form)
          .filter(filterName)
          .sort(sortArrayPathIndex(name));

        // Reverse names if "from" index is greater than "to" index
        if (fromIndex > toIndex) {
          fieldNames.reverse();
          fieldArrayNames.reverse();
        }

        // Create field and field array state map
        const fieldStateMap = new Map<
          FieldPath<TFieldValues>,
          RawFieldState<TFieldValues, FieldPath<TFieldValues>>
        >();
        const fieldArrayStateMap = new Map<
          FieldArrayPath<TFieldValues>,
          RawFieldArrayState
        >();

        batch(() => {
          // Add state of "from" fields to map and move all fields in between forward
          // or backward
          fieldNames.forEach((fieldName) => {
            // Get state of current field
            const fieldState = getFieldState(form, fieldName)!;

            // Get index of current field
            const fieldIndex = getPathIndex(name, fieldName);

            // Add state of field to map if it is "from" index
            if (fieldIndex === fromIndex) {
              fieldStateMap.set(fieldName, fieldState);

              // Otherwise replace state of previous field with state of current
              // field
            } else {
              setFieldState(
                form,
                getPrevIndexName(fieldName, fieldIndex),
                fieldState
              );
            }
          });

          // Finally move fields with "from" index to "to" index
          fieldStateMap.forEach((fieldState, fieldName) => {
            setFieldState(form, getToIndexName(fieldName), fieldState);
          });

          // Add state of "from" field arrays to map and move all field arrays in
          // between forward or backward
          fieldArrayNames.forEach((fieldArrayName) => {
            // Get state of current field array
            const fieldArrayState = getFieldArrayState(form, fieldArrayName)!;

            // Get index of current field array
            const fieldArrayIndex = getPathIndex(name, fieldArrayName);

            // Add state of field to map if it is "from" index
            if (fieldArrayIndex === fromIndex) {
              fieldArrayStateMap.set(fieldArrayName, fieldArrayState);

              // Otherwise replace state of previous field array with state of
              // current field array
            } else {
              setFieldArrayState(
                form,
                getPrevIndexName(fieldArrayName, fieldArrayIndex),
                fieldArrayState
              );
            }
          });

          // Finally move field arrays with "from" index to "to" index
          fieldArrayStateMap.forEach((fieldArrayState, fieldArrayName) => {
            setFieldArrayState(
              form,
              getToIndexName(fieldArrayName),
              fieldArrayState
            );
          });

          // Swap items of field array
          fieldArray.items.set((prevItems) => {
            const nextItems = [...prevItems];
            nextItems.splice(toIndex, 0, nextItems.splice(fromIndex, 1)[0]);
            return nextItems;
          });

          // Set touched at field array and form to true
          fieldArray.touched.set(true);
          form.internal.touched.set(true);

          // Update dirty state at field array and form
          updateFieldArrayDirty(form, fieldArray);
        });
      }
    });
  }
}
