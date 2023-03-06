import type { FieldValue, FieldValues } from './field';
import type { ArrayKey, IsTuple, TupleKeys } from './utils';

/**
 * Returns a path of a type that leads to a field value.
 */
type ValuePath<K extends string | number, V> = V extends string[]
  ? `${K}` | `${K}.${ValuePaths<V>}`
  : V extends FieldValue | Blob
  ? `${K}`
  : `${K}.${ValuePaths<V>}`;

/**
 * Returns all paths of a type that lead to a field value.
 */
type ValuePaths<T> = T extends Array<infer V>
  ? IsTuple<T> extends true
    ? {
        [K in TupleKeys<T>]-?: ValuePath<K & string, T[K]>;
      }[TupleKeys<T>]
    : ValuePath<ArrayKey, V>
  : {
      [K in keyof T]-?: ValuePath<K & string, T[K]>;
    }[keyof T];

/**
 * See {@link ValuePaths}
 */
export type FieldPath<TFieldValues extends FieldValues> =
  ValuePaths<TFieldValues>;

/**
 * Returns the value of a field value or array path of a type.
 */
type PathValue<
  T,
  P extends ValuePaths<T> | ArrayPaths<T>
> = P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? R extends ValuePaths<T[K]>
      ? PathValue<T[K], R>
      : never
    : K extends `${ArrayKey}`
    ? T extends Array<infer V>
      ? PathValue<V, R & ValuePaths<V>>
      : never
    : never
  : P extends keyof T
  ? T[P]
  : never;

/**
 * See {@link PathValue}
 */
export type FieldPathValue<
  TFieldValues extends FieldValues,
  TFieldPath extends FieldPath<TFieldValues>
> = PathValue<TFieldValues, TFieldPath>;

/**
 * Returns a path of a type that leads to a field array.
 */
type ArrayPath<K extends string | number, V> = V extends Array<any>
  ? `${K}` | `${K}.${ArrayPaths<V>}`
  : V extends FieldValues
  ? `${K}.${ArrayPaths<V>}`
  : never;

/**
 * Returns all paths of a type that lead to a field array.
 */
type ArrayPaths<T> = T extends Array<infer V>
  ? IsTuple<T> extends true
    ? {
        [K in TupleKeys<T>]-?: ArrayPath<K & string, T[K]>;
      }[TupleKeys<T>]
    : ArrayPath<ArrayKey, V>
  : {
      [K in keyof T]-?: ArrayPath<K & string, T[K]>;
    }[keyof T];

/**
 * See {@link ArrayPaths}
 */
export type FieldArrayPath<TFieldValues extends FieldValues> =
  ArrayPaths<TFieldValues>;

/**
 * See {@link PathValue}
 */
export type FieldArrayPathValue<
  TFieldValues extends FieldValues,
  TFieldArrayPath extends FieldArrayPath<TFieldValues>
> = PathValue<TFieldValues, TFieldArrayPath> & Array<FieldValue | FieldValues>;
