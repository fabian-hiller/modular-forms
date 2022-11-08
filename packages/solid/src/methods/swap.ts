import { batch, untrack } from 'solid-js';
import {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormState,
  RawFieldArrayState,
  RawFieldState,
} from '../types';
import {
  getField,
  getFieldArray,
  getFieldArrayState,
  getFieldState,
  getPathIndex,
  setFieldArrayState,
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
        const index1Prefix = `${name}.${index1}`;
        const index2Prefix = `${name}.${index2}`;

        // Create field and field array state map
        const fieldStateMap = new Map<TFieldName, RawFieldState>();
        const fieldArrayStateMap = new Map<
          TFieldArrayName,
          RawFieldArrayState
        >();

        // Create filter name function
        const filterName = (value: string) =>
          value.startsWith(`${name}.`) &&
          [index1, index2].includes(getPathIndex(name, value));

        // Create swap index function
        const swapIndex = (value: string) =>
          value.startsWith(index1Prefix)
            ? value.replace(index1Prefix, index2Prefix)
            : value.replace(index2Prefix, index1Prefix);

        // Swap each required field
        (form.internal.getFieldNames() as TFieldName[])
          .filter(filterName)
          .forEach((fieldName) => {
            // Get specified field
            const field = getField(form, fieldName);

            // Add state of field to map
            fieldStateMap.set(fieldName, getFieldState(field));

            // Reset current field, because due to nested field arrays, this
            // field may not exist in the following array item
            setFieldState(field, {
              elements: [],
              initialInput: undefined,
              input: undefined,
              error: '',
              dirty: false,
              touched: false,
            });
          });

        // Finally swap state of fields
        fieldStateMap.forEach((fieldState, fieldName) => {
          setFieldState(
            getField(form, swapIndex(fieldName) as TFieldName),
            fieldState
          );
        });

        // Swap each required field array
        (form.internal.getFieldArrayNames() as TFieldArrayName[])
          .filter(filterName)
          .forEach((fieldArrayName) => {
            // Get specified field array
            const fieldArray = getFieldArray(form, fieldArrayName);

            // Add state of field array to map
            fieldArrayStateMap.set(
              fieldArrayName,
              getFieldArrayState(fieldArray)
            );

            // Reset current field array, because due to nested field arrays,
            // this field array may not exist in the following array item
            setFieldArrayState(fieldArray, {
              initialItems: [],
              items: [],
              error: '',
              dirty: false,
              touched: false,
            });
          });

        // Finally swap state of field arrays
        fieldArrayStateMap.forEach((fieldArrayState, fieldArrayName) => {
          setFieldArrayState(
            getFieldArray(form, swapIndex(fieldArrayName) as TFieldArrayName),
            fieldArrayState
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
