import { createSignal } from 'solid-js';
import {
  FieldArrayPath,
  FieldArrayStore,
  FieldValues,
  FormState,
  ValidateFieldArray,
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
 * @param props The properties to be merged.
 *
 * @returns The store of a field array.
 */
export function getFieldArray<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormState<TFieldValues>,
  name: TFieldArrayName,
  options: FieldArrayOptions = {}
): FieldArrayStore {
  // Destructure options and set default values
  const { validate = [] } = options;

  // Get specified field
  let field = form.internal.fieldArrays.get(name);

  // If field does not already exist, initialize it
  if (!field) {
    // Create initial items of field array
    const initialItems = getInitialArrayItems(form, name);

    // Create field signals
    const [getInitialItems, setInitialItems] = createSignal(initialItems);
    const [getItems, setItems] = createSignal(initialItems);
    const [getError, setError] = createSignal('');
    const [getActive, setActive] = createSignal(false);
    const [getTouched, setTouched] = createSignal(false);
    const [getDirty, setDirty] = createSignal(false);

    // Create form field object
    field = {
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

    // Add field to form fields
    form.internal.fieldArrays.set(name, field as any);

    // Otherwise if props are specefied, merge it
  } else if (options.validate) {
    form.internal.fieldArrays.set(name, { ...field, validate } as any);
    field.validate = validate;
  }

  // Return field array
  return field;
}
