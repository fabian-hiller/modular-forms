import type {
  FieldElement,
  FieldPath,
  FieldPathValue,
  FieldStore,
  FieldType,
  FieldValues,
  Maybe,
  MaybeArray,
  MaybeNoSerialize,
} from '../types';

/**
 * Returns the current input of the element.
 *
 * @param element The field element.
 * @param field The store of the field.
 * @param type The data type to capture.
 * @param deps The function dependencies.
 *
 * @returns The element input.
 */
export function getElementInput<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
>(
  element: FieldElement,
  field: FieldStore<TFieldValues, TFieldName>,
  type: Maybe<FieldType<any>>,
  maybeNoSerialize: <TValue extends MaybeArray<File>>(
    value: TValue
  ) => MaybeNoSerialize<TValue> = (value) => value
): FieldPathValue<TFieldValues, TFieldName> {
  const { checked, files, options, value, valueAsDate, valueAsNumber } =
    element as HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement;
  return (
    !type || type === 'string'
      ? value
      : type === 'string[]'
      ? options
        ? [...options]
            .filter((e) => e.selected && !e.disabled)
            .map((e) => e.value)
        : checked
        ? [...((field.value || []) as string[]), value]
        : ((field.value || []) as string[]).filter((v) => v !== value)
      : type === 'number'
      ? valueAsNumber
      : type === 'boolean'
      ? checked
      : type === 'File' && files
      ? maybeNoSerialize(files[0])
      : type === 'File[]' && files
      ? maybeNoSerialize([...files])
      : type === 'Date' && valueAsDate
      ? valueAsDate
      : field.value
  ) as FieldPathValue<TFieldValues, TFieldName>;
}
