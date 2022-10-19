import { batch, untrack } from 'solid-js';
import {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormState,
  RawFieldState,
} from '../types';
import {
  getField,
  getFieldArray,
  getFieldState,
  setFieldState,
  updateFieldArrayDirty,
} from '../utils';

type SwapOptions = {
  at: number;
  and: number;
};

/**
 * Swaps two fields of a field array by their index.
 *
 * @param form The form that contains the field array.
 * @param name The field array to be modified.
 * @param options The swap options.
 */
export function swap<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormState<TFieldValues>,
  name: TFieldArrayName,
  options: SwapOptions
): void {
  // Sync state updates and prevent unnecessary recalculation
  batch(() => {
    // Ignores tracking of reactive dependencies
    untrack(() => {
      // Destructure options
      const { at: index1, and: index2 } = options;

      // Get specified field array
      const fieldArray = getFieldArray(form, name);

      // Get last index of field array
      const lastIndex = fieldArray.getItems().length - 1;

      // Continue if specified indexes are valid
      if (
        index1 >= 0 &&
        index1 <= lastIndex &&
        index2 >= 0 &&
        index2 <= lastIndex &&
        index1 !== index2
      ) {
        // Create prefix for each index
        const index1Prefix = `${name}.${index1}.`;
        const index2Prefix = `${name}.${index2}.`;

        // Create field state map
        const fieldStateMap = new Map<string, RawFieldState>();

        // Swap each required field
        (form.internal.getFieldNames() as TFieldName[])
          .filter(
            (fieldName) =>
              fieldName.startsWith(index1Prefix) ||
              fieldName.startsWith(index2Prefix)
          )
          .forEach((fieldName) => {
            // Get specified field
            const field = getField(form, fieldName);

            // Add state of field to map
            fieldStateMap.set(fieldName, getFieldState(field));

            // Create swap name of field
            const swapFieldName = (
              fieldName.startsWith(index1Prefix)
                ? fieldName.replace(index1Prefix, index2Prefix)
                : fieldName.replace(index2Prefix, index1Prefix)
            ) as FieldPath<TFieldValues>;

            // Set state of field to field to be swapped with
            setFieldState(
              field,
              fieldStateMap.get(swapFieldName) ||
                getFieldState(getField(form, swapFieldName))
            );
          });

        // Swap items of field array
        fieldArray.setItems((prevItems) => {
          const nextItems = [...prevItems];
          nextItems[index1] = prevItems[index2];
          nextItems[index2] = prevItems[index1];
          return nextItems;
        });

        // Set touched at field array and form to true;
        fieldArray.setTouched(true);
        form.internal.setTouched(true);

        // Update dirty state at field array and form
        updateFieldArrayDirty(form, fieldArray);
      }
    });
  });
}
