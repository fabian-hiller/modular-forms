import { batch, untrack } from 'solid-js';
import { FieldArrayPath, FieldPath, FieldValues, FormState } from '../types';
import {
  getField,
  getFieldArray,
  getPathIndex,
  getFieldState,
  setFieldState,
  updateFieldArrayDirty,
  validateIfNecessary,
  getFieldArrayState,
  setFieldArrayState,
} from '../utils';

type RemoveOptions = {
  at: number;
};

/**
 * Removes a item of the field array.
 *
 * @param form The form that contains the field array.
 * @param name The field array to be modified.
 * @param options The remove options.
 */
export function remove<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormState<TFieldValues>,
  name: TFieldArrayName,
  options: RemoveOptions
): void {
  // Destructure options
  const { at: index } = options;

  // Sync state updates and prevent unnecessary recalculation
  batch(() => {
    // Ignores tracking of reactive dependencies
    untrack(() => {
      // Get specified field array
      const fieldArray = getFieldArray(form, name);

      // Get last index of field array
      const lastIndex = fieldArray.getItems().length - 1;

      // Continue if specified index is valid
      if (index >= 0 && index <= lastIndex) {
        // Create filter name function
        const filterName = (value: string) =>
          value.startsWith(`${name}.`) && getPathIndex(name, value) >= index;

        // Get each field name that follows the given index
        (form.internal.getFieldNames() as TFieldName[])
          .filter(filterName)
          .sort()
          .forEach((fieldName) => {
            // Get specified field
            const field = getField(form, fieldName);

            // Get index of current field
            const fieldIndex = getPathIndex(name, fieldName);

            // Set state of previous field to current field
            if (fieldIndex > index) {
              setFieldState(
                getField(
                  form,
                  fieldName.replace(
                    `${name}.${fieldIndex}`,
                    `${name}.${fieldIndex - 1}`
                  ) as TFieldName
                ),
                getFieldState(field)
              );
            }

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

            // We do not delete fields of the last field array item from
            // internal map so that newly added fields are not initialized
            // with wrong initial values
          });

        // Get each field array name that follows the given index
        (form.internal.getFieldArrayNames() as TFieldArrayName[])
          .filter(filterName)
          .sort()
          .forEach((fieldArrayName) => {
            // Get specified field array
            const fieldArray = getFieldArray(form, fieldArrayName);

            // Get index of current field array
            const fieldArrayIndex = getPathIndex(name, fieldArrayName);

            // Set state of previous field array to current field array
            if (fieldArrayIndex > index) {
              setFieldArrayState(
                getFieldArray(
                  form,
                  fieldArrayName.replace(
                    `${name}.${fieldArrayIndex}`,
                    `${name}.${fieldArrayIndex - 1}`
                  ) as TFieldArrayName
                ),
                getFieldArrayState(fieldArray)
              );
            }

            // Reset current field array, because due to nested field arrays,
            // this field array may not exist in the following array item
            setFieldArrayState(fieldArray, {
              initialItems: [],
              items: [],
              error: '',
              dirty: false,
              touched: false,
            });

            // We do not delete field arrays of the last field array item from
            // internal map so that newly added field arrays are not
            // initialized with wrong initial values
          });

        // Delete item from field array
        fieldArray.setItems((prevItems) => {
          const nextItems = [...prevItems];
          nextItems.splice(index, 1);
          return nextItems;
        });

        // Set touched at field array and form to true;
        fieldArray.setTouched(true);
        form.internal.setTouched(true);

        // Update dirty state at field array and form
        updateFieldArrayDirty(form, fieldArray);

        // Validate field array items if necessary
        validateIfNecessary(form, name, { on: 'input' });
      }
    });
  });
}
