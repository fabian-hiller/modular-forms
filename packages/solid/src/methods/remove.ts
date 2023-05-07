import { batch, untrack } from 'solid-js';
import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormStore,
  ResponseData,
} from '../types';
import {
  getFieldArrayState,
  getFieldArrayStore,
  getFieldState,
  getPathIndex,
  setFieldArrayState,
  setFieldState,
  updateFieldArrayDirty,
  validateIfRequired,
} from '../utils';

/**
 * Value type of the remove options.
 */
export type RemoveOptions = {
  at: number;
};

/**
 * Removes a item of the field array.
 *
 * @param form The form of the field array.
 * @param name The name of field array.
 * @param options The remove options.
 */
export function remove<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: FieldArrayPath<TFieldValues>,
  { at: index }: RemoveOptions
): void {
  // Get store of specified field array
  const fieldArray = getFieldArrayStore(form, name);

  // Continue if specified field array exists
  if (fieldArray) {
    untrack(() => {
      // Get last index of field array
      const lastIndex = fieldArray.items.get().length - 1;

      // Continue if specified index is valid
      if (index >= 0 && index <= lastIndex) {
        // Create function to filter a name
        const filterName = (value: string) =>
          value.startsWith(`${name}.`) && getPathIndex(name, value) > index;

        // Create function to sort by path index
        const sortPathIndex = (
          pathA: FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>,
          pathB: FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>
        ) => getPathIndex(name, pathA) - getPathIndex(name, pathB);

        // Create function to get previous index name
        const getPrevIndexName = <T extends string>(
          fieldOrFieldArrayName: T,
          fieldOrFieldArrayIndex: number
        ): T =>
          fieldOrFieldArrayName.replace(
            `${name}.${fieldOrFieldArrayIndex}`,
            `${name}.${fieldOrFieldArrayIndex - 1}`
          ) as T;

        batch(() => {
          // Move state of each field after the removed index back by one index
          form.internal.fieldNames
            .get()
            .filter(filterName)
            .sort(sortPathIndex)
            .forEach((fieldName) => {
              setFieldState(
                form,
                getPrevIndexName(fieldName, getPathIndex(name, fieldName)),
                getFieldState(form, fieldName)!
              );
            });

          // Move state of each field array after the removed index back by one index
          form.internal.fieldArrayNames
            .get()
            .filter(filterName)
            .sort(sortPathIndex)
            .forEach((fieldArrayName) => {
              setFieldArrayState(
                form,
                getPrevIndexName(
                  fieldArrayName,
                  getPathIndex(name, fieldArrayName)
                ),
                getFieldArrayState(form, fieldArrayName)!
              );
            });

          // Delete item from field array
          fieldArray.items.set((prevItem) => {
            const nextItems = [...prevItem];
            nextItems.splice(index, 1);
            return nextItems;
          });

          // Set touched at field array and form to true
          fieldArray.touched.set(true);
          form.internal.touched.set(true);

          // Update dirty state at field array and form
          updateFieldArrayDirty(form, fieldArray);

          // Validate field array if necessary
          validateIfRequired(form, fieldArray, name, {
            on: ['touched', 'input'],
          });
        });
      }
    });
  }
}
