import { signal } from '@preact/signals-react';
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
): InternalFieldStore<TFieldValues, TFieldName>;

export function initializeFieldStore(
  form: FormStore<FieldValues, ResponseData>,
  name: string
): InternalFieldStore<FieldValues, string> {
  // Initialize store on first request
  if (!getFieldStore(form, name)) {
    // Get initial value of field
    const initialValue = getPathValue(name, form.internal.initialValues);

    // Add store of field to form
    // @ts-expect-error
    form.internal.fields[name] = {
      // Signals
      elements: signal<FieldElement[]>([]),
      initialValue:
        signal<Maybe<FieldPathValue<FieldValues, string>>>(initialValue),
      startValue:
        signal<Maybe<FieldPathValue<FieldValues, string>>>(initialValue),
      value: signal<Maybe<FieldPathValue<FieldValues, string>>>(initialValue),
      error: signal(''),
      active: signal(false),
      touched: signal(false),
      dirty: signal(false),

      // Other
      validate: [],
      validateOn: undefined,
      revalidateOn: undefined,
      transform: [],
      consumers: new Set(),
    };

    // Add name of field to form
    form.internal.fieldNames.value = [...form.internal.fieldNames.peek(), name];
  }

  // Return store of field
  return getFieldStore(form, name)!;
}
