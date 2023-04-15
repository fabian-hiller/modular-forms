import type {
  FieldElement,
  FieldPath,
  FieldPathValue,
  FieldValues,
  FormStore,
  Maybe,
  ResponseData,
} from '@modular-forms/core';
import { getFieldStore, getPathValue } from '@modular-forms/core';
import { createSignal } from 'solid-js';
import type { FieldStore } from '../types';

/**
 * Initializes and returns the store of a field.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 *
 * @returns The reactive store.
 */
export function initializeFieldStore<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: TFieldName
): FieldStore<TFieldValues, TFieldName> {
  // Initialize store on first request
  if (!getFieldStore(form, name)) {
    // Get initial value of field
    const initialValue = getPathValue(name, form.internal.initialValues!);

    // Create signals of field store
    const [getElements, setElements] = createSignal<FieldElement[]>([]);
    const [getInitialValue, setInitialValue] =
      createSignal<Maybe<FieldPathValue<TFieldValues, TFieldName>>>(
        initialValue
      );
    const [getStartValue, setStartValue] =
      createSignal<Maybe<FieldPathValue<TFieldValues, TFieldName>>>(
        initialValue
      );
    const [getValue, setValue] =
      createSignal<Maybe<FieldPathValue<TFieldValues, TFieldName>>>(
        initialValue
      );
    const [getError, setError] = createSignal('');
    const [getActive, setActive] = createSignal(false);
    const [getTouched, setTouched] = createSignal(false);
    const [getDirty, setDirty] = createSignal(false);

    // Add store of field to form
    form.internal.fields[name] = {
      internal: {
        get initialValue() {
          return getInitialValue();
        },
        set initialValue(value) {
          setInitialValue(() => value);
        },
        get startValue() {
          return getStartValue();
        },
        set startValue(value) {
          setStartValue(() => value);
        },
        get elements() {
          return getElements();
        },
        set elements(value) {
          setElements(value);
        },
        validate: [],
        consumers: [],
      },
      name,
      get value() {
        return getValue();
      },
      set value(value) {
        setValue(() => value);
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

    // Add name of field to form
    form.internal.fieldNames = [...form.internal.fieldNames!, name];
  }

  // Return store of field
  return getFieldStore(form, name)!;
}
