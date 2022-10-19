import { batch, untrack } from 'solid-js';
import {
  FieldValues,
  FieldArrayPath,
  FieldArrayPathValue,
  DeepPartial,
  FieldPath,
  FormState,
} from '../types';
import {
  getFieldIndex,
  getFieldArray,
  getPathValue,
  setFieldState,
  getField,
  getUniqueId,
} from '../utils';

type ReplaceOptions<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
  TFieldArrayValues extends FieldArrayPathValue<TFieldValues, TFieldArrayName> &
    Array<unknown>
> = {
  at: number;
  value?: DeepPartial<TFieldArrayValues[number]>;
};

/**
 * Replaces a item of the field array.
 *
 * @param form The form that contains the field array.
 * @param name The field array to be modified.
 * @param options The replace options.
 */
export function replace<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
  TFieldArrayValues extends FieldArrayPathValue<TFieldValues, TFieldArrayName> &
    Array<unknown>
>(
  form: FormState<TFieldValues>,
  name: TFieldArrayName,
  options: ReplaceOptions<TFieldValues, TFieldArrayName, TFieldArrayValues>
): void {
  // Sync state updates and prevent unnecessary recalculation
  batch(() => {
    // Ignores tracking of reactive dependencies
    untrack(() => {
      // Destructure options
      const { at: index, value } = options;

      // Get specified field array
      const fieldArray = getFieldArray(form, name);

      // Get last index of field array
      const lastIndex = fieldArray.getItems().length - 1;

      // Continue if specified index is valid
      if (index >= 0 && index <= lastIndex) {
        (form.internal.getFieldNames() as TFieldName[])
          .filter(
            (fieldName) =>
              fieldName.startsWith(name) &&
              getFieldIndex(name, fieldName) === index
          )
          .forEach((fieldName) => {
            // Get initial input
            const initialInput = getPathValue(
              fieldName.replace(
                `${name}.${getFieldIndex(name, fieldName)}.`,
                ''
              ),
              value
            );

            // Replace state of field
            setFieldState(getField(form, fieldName), {
              elements: [],
              initialInput,
              input: initialInput,
              error: '',
              dirty: false,
              touched: false,
            });
          });

        // Replace item at field array
        fieldArray.setItems((prevItems) => {
          const nextItems = [...prevItems];
          nextItems[index] = getUniqueId();
          return nextItems;
        });

        // Set touched at field array and form to true
        fieldArray.setTouched(true);
        form.internal.setTouched(true);

        // Set dirty at field array and form to true
        fieldArray.setDirty(true);
        form.internal.setDirty(true);
      }
    });
  });
}
