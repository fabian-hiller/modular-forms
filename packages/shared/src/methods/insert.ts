import type {
  FieldArrayPath,
  FieldArrayPathValue,
  FieldPath,
  FieldValues,
  FormStore,
  InitializeStoreDeps,
  Maybe,
  ResponseData,
} from '../types';
import {
  getFieldArrayStore,
  getPathIndex,
  getFieldState,
  getUniqueId,
  validateIfRequired,
  getFieldArrayState,
  getFieldNames,
  getFieldArrayNames,
  setFieldArrayStore,
  setFieldArrayValue,
  setFieldStore,
} from '../utils';

/**
 * Value type of the insert options.
 */
export type InsertOptions<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
  TFieldArrayValues extends FieldArrayPathValue<TFieldValues, TFieldArrayName>
> = {
  at?: Maybe<number>;
  value: TFieldArrayValues[number];
};

/**
 * Inserts a new item into the field array.
 *
 * @param deps The function dependencies.
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param options The insert options.
 */
export function insert<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
  TFieldArrayValues extends FieldArrayPathValue<TFieldValues, TFieldArrayName>
>(
  deps: InitializeStoreDeps<
    TFieldValues,
    TResponseData,
    TFieldName,
    TFieldArrayName
  >,
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldArrayName,
  options: InsertOptions<TFieldValues, TFieldArrayName, TFieldArrayValues>
): void {
  // Get store of specified field array
  const fieldArray = getFieldArrayStore(form, name);

  // Continue if specified field array exists
  if (fieldArray) {
    // Get length of field array
    const arrayLength = fieldArray.items.length;

    // Destructure options
    const { at: index = arrayLength, value } = options;

    // Continue if specified index is valid
    if (index >= 0 && index <= arrayLength) {
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
        getFieldNames(form)
          .filter(filterName)
          .sort()
          .reverse()
          .forEach((fieldName) => {
            setFieldStore(
              deps.initializeFieldStore,
              form,
              getNextIndexName(fieldName, getPathIndex(name, fieldName)),
              getFieldState(form, fieldName)!
            );
          });

        // Move field arrays that come after new item one index further
        getFieldArrayNames(form)
          .filter(filterName)
          .sort()
          .reverse()
          .forEach((fieldArrayName) => {
            setFieldArrayStore(
              deps.initializeFieldArrayStore,
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
      setFieldArrayValue(deps, form, name, { at: index, value });

      // Insert item into field array
      fieldArray.items.splice(index, 0, getUniqueId());

      // Set touched at field array and form to true
      fieldArray.touched = true;
      form.touched = true;

      // Set dirty at field array and form to true
      fieldArray.dirty = true;
      form.dirty = true;

      // Validate field array if required with delay to allow new fields to be
      // mounted beforehand
      setTimeout(
        () =>
          validateIfRequired(form, fieldArray, name, {
            on: ['touched', 'input'],
          }),
        500
      );
    }
  }
}
