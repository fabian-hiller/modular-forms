import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormStore,
  InitializeStoreDeps,
  RawFieldArrayState,
  RawFieldState,
  ResponseData,
} from '../types';
import {
  getFieldArrayStore,
  getPathIndex,
  getFieldState,
  setFieldStore,
  updateFieldArrayDirty,
  getFieldArrayState,
  setFieldArrayStore,
  getFieldNames,
  getFieldArrayNames,
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
 * @param deps The function dependencies.
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param options The move options.
 */
export function move<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  deps: InitializeStoreDeps<
    TFieldValues,
    TResponseData,
    TFieldName,
    TFieldArrayName
  >,
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldArrayName,
  { from: fromIndex, to: toIndex }: MoveOptions
): void {
  // Get store of specified field array
  const fieldArray = getFieldArrayStore(form, name);

  // Continue if specified field array exists
  if (fieldArray) {
    // Get last index of field array
    const lastIndex = fieldArray.items.length - 1;

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
      const getToIndexName = <T extends string>(fieldOrFieldArrayName: T): T =>
        fieldOrFieldArrayName.replace(
          `${name}.${fromIndex}`,
          `${name}.${toIndex}`
        ) as T;

      // Create list of all affected field and field array names
      const fieldNames = getFieldNames(form).filter(filterName).sort();
      const fieldArrayNames = getFieldArrayNames(form)
        .filter(filterName)
        .sort();

      // Reverse names if "from" index is greater than "to" index
      if (fromIndex > toIndex) {
        fieldNames.reverse();
        fieldArrayNames.reverse();
      }

      // Create field and field array state map
      const fieldStateMap = new Map<
        TFieldName,
        RawFieldState<TFieldValues, TFieldName>
      >();
      const fieldArrayStateMap = new Map<TFieldArrayName, RawFieldArrayState>();

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
          setFieldStore(
            deps.initializeFieldStore,
            form,
            getPrevIndexName(fieldName, fieldIndex),
            fieldState
          );
        }
      });

      // Finally move fields with "from" index to "to" index
      fieldStateMap.forEach((fieldState, fieldName) => {
        setFieldStore(
          deps.initializeFieldStore,
          form,
          getToIndexName(fieldName),
          fieldState
        );
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
          setFieldArrayStore(
            deps.initializeFieldArrayStore,
            form,
            getPrevIndexName(fieldArrayName, fieldArrayIndex),
            fieldArrayState
          );
        }
      });

      // Finally move field arrays with "from" index to "to" index
      fieldArrayStateMap.forEach((fieldArrayState, fieldArrayName) => {
        setFieldArrayStore(
          deps.initializeFieldArrayStore,
          form,
          getToIndexName(fieldArrayName),
          fieldArrayState
        );
      });

      // Swap items of field array
      const nextItems = [...fieldArray.items];
      nextItems.splice(toIndex, 0, nextItems.splice(fromIndex, 1)[0]);
      fieldArray.items = nextItems;

      // Set touched at field array and form to true
      fieldArray.touched = true;
      form.touched = true;

      // Update dirty state at field array and form
      updateFieldArrayDirty(form, fieldArray);
    }
  }
}
