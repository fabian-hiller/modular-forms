import type {
  FieldArrayPath,
  FieldArrayPathValue,
  FieldPath,
  FieldPathValue,
  FieldValues,
  Maybe,
} from '@modular-forms/shared';
import type { FieldValue, PartialValues } from '../types';

/**
 * Returns the value of a dot path in an object.
 *
 * @param path The dot path.
 * @param object The object.
 *
 * @returns The value or undefined.
 */
export function getPathValue<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldName extends FieldPath<TFieldValues, FieldValue>
>(
  path: TFieldName,
  object: PartialValues<TFieldValues>
): Maybe<FieldPathValue<TFieldValues, TFieldName, FieldValue>>;
export function getPathValue<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(
  path: TFieldArrayName,
  object: PartialValues<TFieldValues>
): Maybe<FieldArrayPathValue<TFieldValues, TFieldArrayName, FieldValue>>;
export function getPathValue(path: string, object: Record<string, any>): any {
  return path.split('.').reduce<any>((value, key) => value?.[key], object);
}
