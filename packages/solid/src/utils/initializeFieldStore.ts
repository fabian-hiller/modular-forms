import { createSignal } from '../primitives';
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
    const initial = getPathValue(name, form.internal.initialValues);

    // Create signals of field store
    const elements = createSignal<FieldElement[]>([]);
    const initialValue =
      createSignal<Maybe<FieldPathValue<TFieldValues, TFieldName>>>(initial);
    const startValue =
      createSignal<Maybe<FieldPathValue<TFieldValues, TFieldName>>>(initial);
    const value =
      createSignal<Maybe<FieldPathValue<TFieldValues, TFieldName>>>(initial);
    const error = createSignal('');
    const active = createSignal(false);
    const touched = createSignal(false);
    const dirty = createSignal(false);

    // Add store of field to form
    form.internal.fields[name] = {
      // Signals
      elements,
      initialValue,
      startValue,
      value,
      error,
      active,
      touched,
      dirty,

      // Other
      validate: [],
      transform: [],
      consumers: new Set(),
    };

    // Add name of field to form
    form.internal.fieldNames.set((names) => [...names, name]);
  }

  // Return store of field
  return getFieldStore(form, name)!;
}
