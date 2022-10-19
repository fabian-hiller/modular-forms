import { batch, untrack } from 'solid-js';
import { FieldArrayPath, FieldPath, FieldValues, FormState } from '../types';
import {
  getField,
  getFieldArray,
  getFieldIndex,
  getFieldState,
  setFieldState,
  updateFieldArrayDirty,
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
        // Get each field name that follows the given index
        (form.internal.getFieldNames() as TFieldName[])
          .filter(
            (fieldName) =>
              fieldName.startsWith(name) &&
              getFieldIndex(name, fieldName) >= index
          )
          .forEach((fieldName) => {
            // Get index of current field
            const fieldIndex = getFieldIndex(name, fieldName);

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
                getFieldState(getField(form, fieldName))
              );
            }

            // Instead of deleting, reset state of every field of last field
            // array item, so that field cannot be initialized with incorrect
            // initial values
            if (fieldIndex === lastIndex) {
              setFieldState(getField(form, fieldName), {
                elements: [],
                initialInput: undefined,
                input: undefined,
                error: '',
                dirty: false,
                touched: false,
              });
            }
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
      }
    });
  });
}
