import type {
  FieldArrayPath,
  FieldArrayPathValue,
  FieldPath,
  FieldPathValue,
  FieldValues,
  Maybe,
  PartialValues,
} from '../types/index.js';

/**
 * Returns the value of a dot path in an object.
 *
 * @param path The dot path.
 * @param object The object.
 *
 * @returns The value or undefined.
 */
export function getPathValue<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
>(
  path: TFieldName,
  object: PartialValues<TFieldValues>
): Maybe<FieldPathValue<TFieldValues, TFieldName>>;

/**
 * Returns the value of a dot path in an object.
 *
 * @param path The dot path.
 * @param object The object.
 *
 * @returns The value or undefined.
 */
export function getPathValue<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  path: TFieldArrayName,
  object: PartialValues<TFieldValues>
): Maybe<FieldArrayPathValue<TFieldValues, TFieldArrayName>>;

export function getPathValue(path: string, object: Record<string, any>): any {
  return path.split('.').reduce<any>((value, key) => value?.[key], object);
}
