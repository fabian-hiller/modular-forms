import {
  FieldElement,
  FieldValues,
  Maybe,
  ValidateField,
} from '@modular-forms/shared';
import { createSignal } from 'solid-js';
import {
  FieldPath,
  FieldPathValue,
  FieldStore,
  FieldValue,
  FormState,
} from '../types';
import { getInitialValue } from './getInitialValue';

type FieldOtions<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldName extends FieldPath<TFieldValues>
> = Partial<{
  initialValue: [FieldPathValue<TFieldValues, TFieldName>];
  validate: ValidateField<Maybe<FieldPathValue<TFieldValues, TFieldName>>>[];
}>;

/**
 * Returns the internal store of a field of the form.
 *
 * @param form The form that contains the field.
 * @param name The name of the field.
 * @param options The field options.
 *
 * @returns The store of a field.
 */
export function getField<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldName extends FieldPath<TFieldValues>
>(
  form: FormState<TFieldValues>,
  name: TFieldName,
  options: FieldOtions<TFieldValues, TFieldName> = {}
): FieldStore<TFieldValues, TFieldName> {
  // Destructure options and set default values
  const { initialValue, validate = [] } = options;

  // Get specified field
  let field = form.internal.fields.get(name) as Maybe<
    FieldStore<TFieldValues, TFieldName>
  >;

  // If field does not already exist, initialize it
  if (!field) {
    // Create initial input of field
    const initialInput = initialValue
      ? initialValue[0]
      : getInitialValue(form, name);

    // Create field signals
    const [getElements, setElements] = createSignal<FieldElement[]>([]);
    const [getInitialInput, setInitialInput] =
      createSignal<Maybe<FieldPathValue<TFieldValues, TFieldName>>>(
        initialInput
      );
    const [getInput, setInput] =
      createSignal<Maybe<FieldPathValue<TFieldValues, TFieldName>>>(
        initialInput
      );
    const [getError, setError] = createSignal('');
    const [getActive, setActive] = createSignal(false);
    const [getTouched, setTouched] = createSignal(false);
    const [getDirty, setDirty] = createSignal(false);

    // Create form field object
    field = {
      consumers: new Set(),
      getElements,
      setElements,
      getInitialInput,
      setInitialInput,
      getInput,
      setInput,
      getError,
      setError,
      getActive,
      setActive,
      getTouched,
      setTouched,
      getDirty,
      setDirty,
      validate,
    };

    // Add field to form fields
    form.internal.fields.set(name, field as any);

    // Add name of field to field names
    form.internal.setFieldNames((fieldNames) => [...fieldNames, name]);

    // Otherwise if validate is specefied, replace it
  } else if (options.validate) {
    form.internal.fields.set(name, { ...field, validate } as any);
    field.validate = validate;
  }

  // Return field
  return field;
}
