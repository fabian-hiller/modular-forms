import { FieldValues } from '@modular-forms/shared';
import { batch, untrack } from 'solid-js';
import {
  DeepPartial,
  FieldArrayPath,
  FieldArrayPathValue,
  FieldPath,
  FieldValue,
  FormState,
} from '../types';
import {
  getField,
  getFieldArray,
  getPathIndex,
  getFieldState,
  getPathValue,
  getUniqueId,
  getValuePaths,
  setFieldState,
  validateIfNecessary,
  setFieldArrayState,
  getFieldArrayState,
} from '../utils';

type InsertOptions<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
  TFieldArrayValues extends FieldArrayPathValue<TFieldValues, TFieldArrayName> &
    Array<unknown>
> = Partial<{
  at: number;
  value: DeepPartial<TFieldArrayValues[number]>;
}>;

/**
 * Inserts a new item into the field array.
 *
 * @param form The form that contains the field array.
 * @param name The field array to be modified.
 * @param options The insert options.
 */
export function insert<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
  TFieldArrayValues extends FieldArrayPathValue<TFieldValues, TFieldArrayName> &
    Array<unknown>
>(
  form: FormState<TFieldValues>,
  name: TFieldArrayName,
  options: InsertOptions<TFieldValues, TFieldArrayName, TFieldArrayValues> = {}
): void {
  // Sync state updates and prevent unnecessary recalculation
  batch(() => {
    // Ignores tracking of reactive dependencies
    untrack(() => {
      // Get specified field array
      const fieldArray = getFieldArray(form, name);

      // Get length of field array
      const arrayLength = fieldArray.getItems().length;

      // Destructure options
      const { at: index = arrayLength, value } = options;

      // Continue if specified index is valid
      if (index >= 0 && index <= arrayLength) {
        // Create fields for specified values when item is inserted at end
        if (index === arrayLength) {
          if (value !== undefined) {
            getValuePaths(value).forEach((path) => {
              // Get initial input
              const initialInput = getPathValue(path, value);

              // Since we only reset state of affected fields when removing an
              // array item and do not delete fields from internal map, as they
              // could otherwise be initialized with incorrect initial values,
              // state of fields must be set to specified initial value here
              setFieldState(
                getField(
                  form,
                  `${name}.${index}${path ? `.${path}` : ''}` as TFieldName
                ),
                {
                  elements: [],
                  initialInput,
                  input: initialInput,
                  error: '',
                  dirty: false,
                  touched: false,
                }
              );
            });
          }

          // Otherwise, move fields and field arrays of items that come after
          // new item one index further and add new item by changing state of
          // fields and field arrays at specified index
        } else {
          // Create filter name function
          const filterName = (value: string) =>
            value.startsWith(`${name}.`) && getPathIndex(name, value) >= index;

          // Get each field name that follows the given index
          (form.internal.getFieldNames() as TFieldName[])
            .filter(filterName)
            // Sort and reverse array so that loop starts with last index
            .sort()
            .reverse()
            .forEach((fieldName) => {
              // Get specified field
              const field = getField(form, fieldName);

              // Get index of current field
              const fieldIndex = getPathIndex(name, fieldName);

              // Set state of current field to next field
              setFieldState(
                getField(
                  form,
                  fieldName.replace(
                    `${name}.${fieldIndex}`,
                    `${name}.${fieldIndex + 1}`
                  ) as TFieldName
                ),
                getFieldState(field)
              );

              // Reset state of every field of inserted field array item
              if (fieldIndex === index) {
                const initialInput = getPathValue(
                  fieldName.replace(
                    new RegExp(`${name}\.${fieldIndex}\.?`),
                    ''
                  ),
                  value
                );
                setFieldState(field, {
                  elements: [],
                  initialInput,
                  input: initialInput,
                  error: '',
                  dirty: false,
                  touched: false,
                });
              }
            });

          // Get each field array name that follows the given index
          (form.internal.getFieldArrayNames() as TFieldArrayName[])
            .filter(filterName)
            // Sort and reverse array so that loop starts with last index
            .sort()
            .reverse()
            .forEach((fieldArrayName) => {
              // Get specified field array
              const fieldArray = getFieldArray(form, fieldArrayName);

              // Get index of current field array
              const fieldArrayIndex = getPathIndex(name, fieldArrayName);

              // Set state of current field array to next field array
              setFieldArrayState(
                getFieldArray(
                  form,
                  fieldArrayName.replace(
                    `${name}.${fieldArrayIndex}`,
                    `${name}.${fieldArrayIndex + 1}`
                  ) as TFieldArrayName
                ),
                getFieldArrayState(fieldArray)
              );

              // Reset state of every field array of inserted field array item
              if (fieldArrayIndex === index) {
                const initialItems = (
                  getPathValue(
                    fieldArrayName.replace(
                      new RegExp(`${name}\.${fieldArrayIndex}\.?`),
                      ''
                    ),
                    value
                  ) || []
                ).map(() => getUniqueId());
                setFieldArrayState(fieldArray, {
                  initialItems,
                  items: initialItems,
                  error: '',
                  dirty: false,
                  touched: false,
                });
              }
            });
        }

        // Insert item into field array
        fieldArray.setItems((prevItems) => {
          const nextItems = [...prevItems];
          nextItems.splice(index, 0, getUniqueId());
          return nextItems;
        });

        // Set touched at field array and form to true
        fieldArray.setTouched(true);
        form.internal.setTouched(true);

        // Set dirty at field array and form to true
        fieldArray.setDirty(true);
        form.internal.setDirty(true);

        // Validate field array with delay if necessary to allow new fields to
        // be mounted beforehand
        setTimeout(() =>
          validateIfNecessary(form, fieldArray, name, {
            on: ['touched', 'input'],
          })
        );
      }
    });
  });
}
