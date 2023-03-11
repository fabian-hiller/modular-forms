import { noSerialize } from '@builder.io/qwik';
import type {
  FieldElement,
  FieldPath,
  FieldPathValue,
  FieldStore,
  FieldValues,
} from '../types';

/**
 * Returns the current input of the element.
 *
 * @param element The field element.
 *
 * @returns The element input.
 */
export function getElementInput<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
>(
  element: FieldElement,
  field: FieldStore<TFieldValues, TFieldName>
): FieldPathValue<TFieldValues, TFieldName> {
  const { checked, files, multiple, options, type, value } =
    element as HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement;
  let parsed: number;
  return (
    type === 'number' || type === 'range'
      ? // Return values as number
        ((parsed = parseFloat(value)),
        field.value === undefined || !isNaN(parsed) ? parsed : field.value)
      : type === 'checkbox'
      ? value && value !== 'on'
        ? // Return value as array of string
          checked
          ? [...((field.value || []) as string[]), value]
          : ((field.value || []) as string[]).filter((v) => v !== value)
        : // Return value as boolean
          checked
      : type === 'file'
      ? multiple
        ? // Return value as array of files
          noSerialize([...files!])
        : // Return value as single file
          noSerialize(files![0])
      : options && multiple
      ? // Return value as array of strings
        [...options]
          .filter((e) => e.selected && !e.disabled)
          .map((e) => e.value)
      : // Return value as string
        value
  ) as FieldPathValue<TFieldValues, TFieldName>;
}
