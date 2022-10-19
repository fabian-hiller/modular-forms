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
  getFieldIndex,
  getFieldState,
  setFieldState,
  updateFieldArrayDirty,
} from '../utils';

type MoveOptions = {
  from: number;
  to: number;
};

/**
 * Moves a field of the field array to a new position and rearranges all fields
 * in between.
 *
 * @param form The form that contains the field array.
 * @param name The field array to be modified.
 * @param options The move options.
 */
export function move<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormState<TFieldValues>,
  name: TFieldArrayName,
  options: MoveOptions
): void {
  // Sync state updates and prevent unnecessary recalculation
  batch(() => {
    // Ignores tracking of reactive dependencies
    untrack(() => {
      // Destructure options
      const { from: fromIndex, to: toIndex } = options;

      // Get specified field array
      const fieldArray = getFieldArray(form, name);

      // Get last index of field array
      const lastIndex = fieldArray.getItems().length - 1;

      // Continue if specified indexes are valid
      if (
        fromIndex >= 0 &&
        fromIndex <= lastIndex &&
        toIndex >= 0 &&
        toIndex <= lastIndex &&
        fromIndex !== toIndex
      ) {
        // Create list of all affected field names
        const fieldNames = (
          form.internal.getFieldNames() as TFieldName[]
        ).filter((fieldName) => {
          if (fieldName.startsWith(name)) {
            const fieldIndex = getFieldIndex(name, fieldName);
            return (
              (fieldIndex >= fromIndex && fieldIndex <= toIndex) ||
              (fieldIndex <= fromIndex && fieldIndex >= toIndex)
            );
          }
        });

        // Reverse field names if "from" index is smaller than "to" index
        if (fromIndex > toIndex) {
          fieldNames.reverse();
        }

        // Create field state map
        const fieldStateMap = new Map<string, RawFieldState>();

        // Replace "to" field with "from" field and move all fields in between
        // forward or backward
        fieldNames.forEach((fieldName) => {
          // Get specified field
          const field = getField(form, fieldName);

          // Get index of current field
          const fieldIndex = getFieldIndex(name, fieldName);

          // Add state of field to map if it is "from" index
          if (fieldIndex === fromIndex) {
            fieldStateMap.set(fieldName, getFieldState(field));
          }

          // Replace state of "to" field with state of "from" field if it is
          // "to" index
          if (fieldIndex === toIndex) {
            setFieldState(
              field,
              fieldStateMap.get(
                fieldName.replace(`${name}.${toIndex}`, `${name}.${fromIndex}`)
              )!
            );

            // Otherwise replace state of current field with state of next
            // field
          } else {
            setFieldState(
              field,
              getFieldState(
                getField(
                  form,
                  fieldName.replace(
                    `${name}.${fieldIndex}`,
                    fromIndex < toIndex
                      ? `${name}.${fieldIndex + 1}`
                      : `${name}.${fieldIndex - 1}`
                  ) as TFieldName
                )
              )
            );
          }
        });

        // Swap items of field array
        fieldArray.setItems((prevItems) => {
          const nextItems = [...prevItems];
          nextItems.splice(toIndex, 0, nextItems.splice(fromIndex, 1)[0]);
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
