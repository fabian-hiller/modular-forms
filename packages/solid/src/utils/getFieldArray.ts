import { FieldValues, ValidateFieldArray } from '@modular-forms/shared';
import { createSignal } from 'solid-js';
import {
  FieldArrayPath,
  FieldArrayStore,
  FieldValue,
  FormState,
} from '../types';
import { getInitialItems as getInitialArrayItems } from './getInitialItems';

type FieldArrayOptions = Partial<{
  validate: ValidateFieldArray<number[]>[];
}>;

/**
 * Returns the internal store of a field array of the form.
 *
 * @param form The form that contains the field array.
 * @param name The name of the field array.
 * @param options The field array options.
 *
 * @returns The store of a field array.
 */
export function getFieldArray<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormState<TFieldValues>,
  name: TFieldArrayName,
  options: FieldArrayOptions = {}
): FieldArrayStore {
  // Destructure options and set default values
  const { validate = [] } = options;

  // Get specified field array
  let fieldArray = form.internal.fieldArrays.get(name);

  // If field does not already exist, initialize it
  if (!fieldArray) {
    // Create initial items of field array
    const initialItems = getInitialArrayItems(form, name);

    // Create field array signals
    const [getInitialItems, setInitialItems] = createSignal(initialItems);
    const [getItems, setItems] = createSignal(initialItems);
    const [getError, setError] = createSignal('');
    const [getActive, setActive] = createSignal(false);
    const [getTouched, setTouched] = createSignal(false);
    const [getDirty, setDirty] = createSignal(false);

    // Create form field array object
    fieldArray = {
      consumers: new Set(),
      getInitialItems,
      setInitialItems,
      getItems,
      setItems,
      getError,
      setError,
      getActive,
      setActive,
      getTouched,
      setTouched,
      getDirty,
      setDirty,
      validate,
    };

    // Add field array to form field arrays
    form.internal.fieldArrays.set(name, fieldArray as any);

    // Add name of field array to field array names
    form.internal.setFieldArrayNames((fieldArrayNames) => [
      ...fieldArrayNames,
      name,
    ]);

    // Otherwise if props are specefied, merge it
  } else if (options.validate) {
    form.internal.fieldArrays.set(name, { ...fieldArray, validate } as any);
    fieldArray.validate = validate;
  }

  // Return field array
  return fieldArray;
}
