import type {
  FieldArrayPath,
  FieldValues,
  FormStore,
  ResponseData,
} from '@modular-forms/core';
import { getPathValue, getUniqueId } from '@modular-forms/core';
import { createSignal } from 'solid-js';
import type { FieldArrayStore } from '../types';

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
): FieldArrayStore<TFieldValues, TFieldArrayName> {
  // Get store of specified field array
  let fieldArray = form.internal.fieldArrays[name];

  // Initialize store on first request
  if (!fieldArray) {
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

    // Create form field array object
    fieldArray = {
      internal: {
        get initialItems() {
          return getInitialItems();
        },
        set initialItems(value) {
          setInitialItems(() => value);
        },
        get startItems() {
          return getStartItems();
        },
        set startItems(value) {
          setStartItems(() => value);
        },
        validate: [],
        consumers: [],
      },
      name,
      get items() {
        return getItems();
      },
      set items(value) {
        setItems(value);
      },
      get error() {
        return getError();
      },
      set error(value) {
        setError(value);
      },
      get active() {
        return getActive();
      },
      set active(value) {
        setActive(value);
      },
      get touched() {
        return getTouched();
      },
      set touched(value) {
        setTouched(value);
      },
      get dirty() {
        return getDirty();
      },
      set dirty(value) {
        setDirty(value);
      },
    };

    // Add store of field array to form
    form.internal.fieldArrays[name] = fieldArray;

    // Add name of field array to form
    form.internal.fieldArrayNames = [...form.internal.fieldArrayNames!, name];
  }

  // Return store of field array
  return fieldArray;
}
