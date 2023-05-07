import { createSignal } from '../primitives';
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
    const initial =
      getPathValue(name, form.internal.initialValues!)?.map(() =>
        getUniqueId()
      ) || [];

    // Create signals of field array store
    const initialItems = createSignal(initial);
    const startItems = createSignal(initial);
    const items = createSignal(initial);
    const error = createSignal('');
    const active = createSignal(false);
    const touched = createSignal(false);
    const dirty = createSignal(false);

    // Add store of field array to form
    form.internal.fieldArrays[name] = {
      // Signals
      initialItems,
      startItems,
      items,
      error,
      active,
      touched,
      dirty,

      // Other
      validate: [],
      consumers: new Set(),
    };

    // Add name of field array to form
    form.internal.fieldArrayNames.set((names) => [...names, name]);
  }

  // Return store of field array
  return getFieldArrayStore(form, name)!;
}
