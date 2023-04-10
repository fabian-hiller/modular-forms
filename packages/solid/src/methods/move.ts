import { RawFieldArrayState } from '@modular-forms/shared';
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
  getPathIndex,
  getFieldState,
  setFieldState,
  updateFieldArrayDirty,
  getFieldArrayState,
  setFieldArrayState,
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
        // Create filter name function
        const filterName = (value: string) => {
          if (value.startsWith(name)) {
            const fieldIndex = getPathIndex(name, value);
            return (
              (fieldIndex >= fromIndex && fieldIndex <= toIndex) ||
              (fieldIndex <= fromIndex && fieldIndex >= toIndex)
            );
          }
        };

        // Create list of all affected field names
        const fieldNames = form.internal
          .getFieldNames()
          .filter(filterName)
          .sort() as TFieldName[];

        // Create list of all affected field array names
        const fieldArrayNames = form.internal
          .getFieldArrayNames()
          .filter(filterName)
          .sort() as TFieldArrayName[];

        // Reverse field and field array names if "from" index is smaller than
        //  "to" index
        if (fromIndex > toIndex) {
          fieldNames.reverse();
          fieldArrayNames.reverse();
        }

        // Create field and field array state map
        const fieldStateMap = new Map<TFieldName, RawFieldState>();
        const fieldArrayStateMap = new Map<
          TFieldArrayName,
          RawFieldArrayState
        >();

        // Add state of "from" fields to map and move all fields in between
        // forward or backward
        fieldNames.forEach((fieldName) => {
          // Get specified field
          const field = getField(form, fieldName);

          // Get index of current field
          const fieldIndex = getPathIndex(name, fieldName);

          // Add state of field to map if it is "from" index
          if (fieldIndex === fromIndex) {
            fieldStateMap.set(fieldName, getFieldState(field));

            // Otherwise replace state of previous field with state of current
            // field
          } else {
            setFieldState(
              getField(
                form,
                fieldName.replace(
                  `${name}.${fieldIndex}`,
                  fromIndex < toIndex
                    ? `${name}.${fieldIndex - 1}`
                    : `${name}.${fieldIndex + 1}`
                ) as TFieldName
              ),
              getFieldState(field)
            );
          }

          // Reset current field, because due to nested field arrays, this
          // field may not exist in following array item
          setFieldState(field, {
            elements: [],
            initialInput: undefined,
            input: undefined,
            error: '',
            dirty: false,
            touched: false,
          });
        });

        // Finally move fields with "from" index to "to" index
        fieldStateMap.forEach((fieldState, fieldName) => {
          setFieldState(
            getField(
              form,
              fieldName.replace(
                `${name}.${fromIndex}`,
                `${name}.${toIndex}`
              ) as TFieldName
            ),
            fieldState
          );
        });

        // Add state of "from" field arrays to map and move all field arrays in
        // between forward or backward
        fieldArrayNames.forEach((fieldArrayName) => {
          // Get specified field array
          const fieldArray = getFieldArray(form, fieldArrayName);

          // Get index of current field array
          const fieldArrayIndex = getPathIndex(name, fieldArrayName);

          // Add state of field to map if it is "from" index
          if (fieldArrayIndex === fromIndex) {
            fieldArrayStateMap.set(
              fieldArrayName,
              getFieldArrayState(fieldArray)
            );

            // Otherwise replace state of previous field array with state of
            // current field array
          } else {
            setFieldArrayState(
              getFieldArray(
                form,
                fieldArrayName.replace(
                  `${name}.${fieldArrayIndex}`,
                  fromIndex < toIndex
                    ? `${name}.${fieldArrayIndex - 1}`
                    : `${name}.${fieldArrayIndex + 1}`
                ) as TFieldArrayName
              ),
              getFieldArrayState(fieldArray)
            );
          }

          // Reset current field array, because due to nested field arrays,
          // this field array may not exist in following array item
          setFieldArrayState(fieldArray, {
            initialItems: [],
            items: [],
            error: '',
            dirty: false,
            touched: false,
          });
        });

        // Finally move field arrays with "from" index to "to" index
        fieldArrayStateMap.forEach((fieldArrayState, fieldArrayName) => {
          setFieldArrayState(
            getFieldArray(
              form,
              fieldArrayName.replace(
                `${name}.${fromIndex}`,
                `${name}.${toIndex}`
              ) as TFieldArrayName
            ),
            fieldArrayState
          );
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
