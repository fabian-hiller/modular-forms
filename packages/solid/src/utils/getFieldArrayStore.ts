import {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  ResponseData,
} from '@modular-forms/shared';
import { createSignal } from 'solid-js';
import { FieldArrayStore, FieldValue, FormStore } from '../types';
import { getInitialArrayItems } from './getInitialArrayItems';

/**
 * Returns the store of a field array.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 *
 * @returns The reactive store.
 */
export function getFieldArrayStore<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldArrayName
): FieldArrayStore<TFieldValues, TFieldArrayName> {
  // Get store of specified field array
  let fieldArray = form.internal.fieldArrays[name];

  // Initialize store on first request
  if (!fieldArray) {
    // Create initial items of field array
    const initialItems = getInitialArrayItems(form, name);

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
        getInitialItems,
        setInitialItems,
        getStartItems,
        setStartItems,
        setItems,
        setError,
        setActive,
        setTouched,
        setDirty,
        validate: [],
        consumers: new Set(),
      },
      name,
      get items() {
        return getItems();
      },
      get error() {
        return getError();
      },
      get active() {
        return getActive();
      },
      get touched() {
        return getTouched();
      },
      get dirty() {
        return getDirty();
      },
    };

    // Add store of field array to form
    form.internal.fieldArrays[name] = fieldArray;

    // Add name of field array to form
    form.internal.setFieldArrayNames((names) => [...names, name]);
  }

  // Return store of field array
  return fieldArray;
}
