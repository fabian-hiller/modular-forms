import { FieldPath, FieldValues } from '../types';

/**
 * Returns the index of the field in the field array.
 *
 * @param präfix The field array name to get the index from.
 * @param name The field name to get the index from.
 *
 * @returns The field index in the array.
 */
export function getFieldIndex<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
>(präfix: string, name: TFieldName): number {
  return +name.replace(`${präfix}.`, '').split('.')[0];
}
