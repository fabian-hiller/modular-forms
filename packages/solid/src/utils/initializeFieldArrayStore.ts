import { createSignal } from 'solid-js';
import type {
  FieldArrayPath,
  FieldValues,
  FormStore,
  InternalFieldArrayStore,
  ResponseData,
} from '../types';
import { getFieldArrayStore } from './getFieldArrayStore';
import { getPathValue } from './getPathValue';
import { getUniqueId } from './getUniqueId';

/**
 * Initializes and returns the store of a field array.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 *
 * @returns The reactive store.
 */
export function initializeFieldArrayStore<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: TFieldArrayName
): InternalFieldArrayStore {
  // Initialize store on first request
  if (!getFieldArrayStore(form, name)) {
    // Create initial items of field array
    const initialItems =
      getPathValue(name, form.internal.initialValues!)?.map(() =>
        getUniqueId()
      ) || [];

    // Create signals of field array store
    const [getInitialItems, setInitialItems] = createSignal(initialItems);
    const [getStartItems, setStartItems] = createSignal(initialItems);
    const [getItems, setItems] = createSignal(initialItems);
    const [getError, setError] = createSignal('');
    const [getActive, setActive] = createSignal(false);
    const [getTouched, setTouched] = createSignal(false);
    const [getDirty, setDirty] = createSignal(false);

    // Add store of field array to form
    form.internal.fieldArrays[name] = {
      // Signals
      getInitialItems,
      setInitialItems,
      getStartItems,
      setStartItems,
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

      // Other
      validate: [],
      consumers: new Set(),
    };

    // Add name of field array to form
    form.internal.setFieldArrayNames((names) => [...names, name]);
  }

  // Return store of field array
  return getFieldArrayStore(form, name)!;
}
