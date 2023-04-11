import {
  FieldArrayPath,
  FieldElement,
  FieldPath,
  FieldPathValue,
  FieldValues,
  Maybe,
  ResponseData,
} from '@modular-forms/shared';
import { createSignal } from 'solid-js';
import { FieldStore, FieldValue, FormStore } from '../types';
import { getInitialFieldValue } from './getInitialFieldValue';

/**
 * Returns the store of a field.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 *
 * @returns The reactive store.
 */
export function getFieldStore<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldName
): FieldStore<TFieldValues, TFieldName> {
  // Get store of specified field
  let field = form.internal.fields[name];

  // Initialize store on first request
  if (!field) {
    // Get initial value of field
    const initialValue = getInitialFieldValue(form, name);

    // Create signals of field store
    const [getElements, setElements] = createSignal<FieldElement[]>([]);
    const [getInitialValue, setInitialValue] =
      createSignal<Maybe<FieldPathValue<TFieldValues, TFieldName, FieldValue>>>(
        initialValue
      );
    const [getStartValue, setStartValue] =
      createSignal<Maybe<FieldPathValue<TFieldValues, TFieldName, FieldValue>>>(
        initialValue
      );
    const [getValue, setValue] =
      createSignal<Maybe<FieldPathValue<TFieldValues, TFieldName, FieldValue>>>(
        initialValue
      );
    const [getError, setError] = createSignal('');
    const [getActive, setActive] = createSignal(false);
    const [getTouched, setTouched] = createSignal(false);
    const [getDirty, setDirty] = createSignal(false);

    // Create initial store of field
    field = {
      internal: {
        getElements,
        setElements,
        getInitialValue,
        setInitialValue,
        getStartValue,
        setStartValue,
        setValue,
        setError,
        setActive,
        setTouched,
        setDirty,
        validate: [],
        consumers: new Set(),
      },
      name,
      get value() {
        return getValue();
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

    // Add store of field to form
    form.internal.fields[name] = field;

    // Add name of field to form
    form.internal.setFieldNames((names) => [...names, name]);
  }

  // Return store of field
  return field;
}
