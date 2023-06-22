import { batch } from '@preact/signals-react';
import type {
  FieldArrayPath,
  FieldArrayPathValue,
  FieldValues,
  FormStore,
  Maybe,
  ResponseData,
} from '../types';
import {
  getFieldArrayStore,
  getFieldArrayState,
  getFieldState,
  getPathIndex,
  getUniqueId,
  setFieldArrayState,
  setFieldArrayValue,
  setFieldState,
  sortArrayPathIndex,
  validateIfRequired,
} from '../utils';

/**
 * Value type of the insert options.
 */
export type InsertOptions<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  at?: Maybe<number>;
  value: FieldArrayPathValue<TFieldValues, TFieldArrayName>[number];
};

/**
 * Inserts a new item into the field array.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param options The insert options.
 */
export function insert<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: TFieldArrayName,
  options: InsertOptions<TFieldValues, TFieldArrayName>
): void {
  // Get store of specified field array
  const fieldArray = getFieldArrayStore(form, name);

  // Continue if specified field array exists
  if (fieldArray) {
    // Get length of field array
    const arrayLength = fieldArray.items.peek().length;

    // Destructure options
    const { at: index = arrayLength, value } = options;

    // Continue if specified index is valid
    if (index >= 0 && index <= arrayLength) {
      batch(() => {
        // If item is not inserted at end, move fields and field arrays of items
        // that come after new item one index further
        if (index < arrayLength) {
          // Create function to filter a name
          const filterName = (value: string) =>
            value.startsWith(`${name}.`) && getPathIndex(name, value) >= index;

          // Create function to get next index name
          const getNextIndexName = <T extends string>(
            fieldOrFieldArrayName: T,
            fieldOrFieldArrayIndex: number
          ): T =>
            fieldOrFieldArrayName.replace(
              `${name}.${fieldOrFieldArrayIndex}`,
              `${name}.${fieldOrFieldArrayIndex + 1}`
            ) as T;

          // Move fields that come after new item one index further
          form.internal.fieldNames
            .peek()
            .filter(filterName)
            .sort(sortArrayPathIndex(name))
            .reverse()
            .forEach((fieldName) => {
              setFieldState(
                form,
                getNextIndexName(fieldName, getPathIndex(name, fieldName)),
                getFieldState(form, fieldName)!
              );
            });

          // Move field arrays that come after new item one index further
          form.internal.fieldArrayNames
            .peek()
            .filter(filterName)
            .sort(sortArrayPathIndex(name))
            .reverse()
            .forEach((fieldArrayName) => {
              setFieldArrayState(
                form,
                getNextIndexName(
                  fieldArrayName,
                  getPathIndex(name, fieldArrayName)
                ),
                getFieldArrayState(form, fieldArrayName)!
              );
            });
        }

        // Set value of new field array item
        setFieldArrayValue(form, name, { at: index, value });

        // Insert item into field array
        const nextItems = [...fieldArray.items.peek()];
        nextItems.splice(index, 0, getUniqueId());
        fieldArray.items.value = nextItems;

        // Set touched at field array and form to true
        fieldArray.touched.value = true;
        form.touched.value = true;

        // Set dirty at field array and form to true
        fieldArray.dirty.value = true;
        form.dirty.value = true;
      });
    }

    // Validate field array if required with delay to allow new fields to be
    // mounted beforehand
    setTimeout(
      () =>
        validateIfRequired(form, fieldArray, name, {
          on: ['touched', 'change'],
        }),
      250
    );
  }
}
