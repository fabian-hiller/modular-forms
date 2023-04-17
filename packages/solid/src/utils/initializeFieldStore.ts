import { createSignal } from 'solid-js';
import type {
  FieldElement,
  FieldPath,
  FieldPathValue,
  FieldValues,
  FormStore,
  InternalFieldStore,
  Maybe,
  ResponseData,
} from '../types';
import { getFieldStore } from './getFieldStore';
import { getPathValue } from './getPathValue';

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
): InternalFieldStore<TFieldValues, TFieldName> {
  // Initialize store on first request
  if (!getFieldStore(form, name)) {
    // Get initial value of field
    const initialValue = getPathValue(name, form.internal.initialValues);

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
      // Signals
      getElements,
      setElements,
      getInitialValue,
      setInitialValue,
      getStartValue,
      setStartValue,
      getValue,
      setValue,
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

    // Add name of field to form
    form.internal.setFieldNames((names) => [...names, name]);
  }

  // Return store of field
  return getFieldStore(form, name)!;
}
