import { signal } from '@preact/signals';
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

    // Add store of field array to form
    form.internal.fieldArrays[name] = {
      // Signals
      initialItems: signal(initialItems),
      startItems: signal(initialItems),
      items: signal(initialItems),
      error: signal(''),
      active: signal(false),
      touched: signal(false),
      dirty: signal(false),

      // Other
      validate: [],
      consumers: new Set(),
    };

    // Add name of field array to form
    form.internal.fieldArrayNames.value = [
      ...form.internal.fieldArrayNames.peek(),
      name,
    ];
  }

  // Return store of field array
  return getFieldArrayStore(form, name)!;
}
