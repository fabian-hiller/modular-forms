import { batch, untrack } from 'solid-js';
import {
  DeepPartial,
  FieldArrayPath,
  FieldArrayPathValue,
  FieldPath,
  FieldValues,
  FormState,
} from '../types';
import {
  getField,
  getFieldArray,
  getFieldIndex,
  getFieldState,
  getPathValue,
  getUniqueId,
  getValuePaths,
  setFieldState,
  validateIfNecessary,
} from '../utils';

type InsertOptions<
  TFieldValues extends FieldValues,
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
  TFieldValues extends FieldValues,
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
              const initialInput = getPathValue(path, value);
              setFieldState(
                getField(
                  form,
                  `${name}.${index}${path && `.${path}`}` as TFieldName
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

          // Otherwise, move fields of items that come after new item one index
          // further and add new item by changing state of fields at specified
          // index
        } else {
          // Get each field name that follows the given index
          (form.internal.getFieldNames() as TFieldName[])
            .filter(
              (fieldName) =>
                fieldName.startsWith(name) &&
                getFieldIndex(name, fieldName) >= index
            )
            .reverse()
            .forEach((fieldName) => {
              // Get index of current field
              const fieldIndex = getFieldIndex(name, fieldName);

              // Set state of previous field to current field
              setFieldState(
                getField(
                  form,
                  fieldName.replace(
                    `${name}.${fieldIndex}`,
                    `${name}.${fieldIndex + 1}`
                  ) as TFieldName
                ),
                getFieldState(getField(form, fieldName))
              );

              // Reset state of every field of inserted field array item
              if (fieldIndex === index) {
                const initialInput = getPathValue(
                  fieldName.replace(`${name}.${fieldIndex}.`, ''),
                  value
                );
                setFieldState(getField(form, fieldName), {
                  elements: [],
                  initialInput,
                  input: initialInput,
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

        // Validate field array items if necessary
        validateIfNecessary(form, name, { on: 'input' });
      }
    });
  });
}
