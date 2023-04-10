import {
  FieldElement,
  FieldPath,
  FieldPathValue,
  FieldValues,
  Maybe,
} from '@modular-forms/shared';
import { untrack } from 'solid-js';
import { FieldStore, FieldValue } from '../types';

/**
 * Returns the current input of the element.
 *
 * @param element The field element.
 *
 * @returns The current element input.
 */
export function getElementInput<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldName extends FieldPath<TFieldValues, FieldValue>
>(
  element: FieldElement,
  field: FieldStore<TFieldValues, TFieldName>
): FieldPathValue<TFieldValues, TFieldName, FieldValue> {
  const { checked, files, multiple, options, type, value } =
    element as HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement;
  const getInput = () => untrack(field.getInput);
  let input: Maybe<FieldPathValue<TFieldValues, TFieldName, FieldValue>>,
    parsed: number;
  return (
    type === 'number' || type === 'range'
      ? // Return values as number
        ((input = getInput()),
        (parsed = parseFloat(value)),
        input === undefined || !isNaN(parsed) ? parsed : input)
      : type === 'checkbox'
      ? value && value !== 'on'
        ? // Return value as array of string
          checked
          ? [...((getInput() || []) as string[]), value]
          : ((getInput() || []) as string[]).filter((v) => v !== value)
        : // Return value as boolean
          checked
      : type === 'file'
      ? multiple
        ? // Return value as file list
          files
        : // Return value as single file
          files?.[0]
      : options && multiple
      ? // Return value as array of strings
        [...options]
          .filter((e) => e.selected && !e.disabled)
          .map((e) => e.value)
      : // Return value as string
        value
  ) as FieldPathValue<TFieldValues, TFieldName, FieldValue>;
}
