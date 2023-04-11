import { FieldValues } from './field';
import { IsTuple, TupleKeys, ArrayKey } from './utils';

/**
 * Returns a path of a type that leads to a field value.
 */
type ValuePath<
  TKey extends string | number,
  TValue,
  TFieldValue
> = TValue extends string[]
  ? `${TKey}` | `${TKey}.${ValuePaths<TValue, TFieldValue>}`
  : TValue extends TFieldValue | Blob
  ? `${TKey}`
  : `${TKey}.${ValuePaths<TValue, TFieldValue>}`;

/**
 * Returns all paths of a type that lead to a field value.
 */
type ValuePaths<TValue, TFieldValue> = TValue extends Array<infer TChild>
  ? IsTuple<TValue> extends true
    ? {
        [TKey in TupleKeys<TValue>]-?: ValuePath<
          TKey & string,
          TValue[TKey],
          TFieldValue
        >;
      }[TupleKeys<TValue>]
    : ValuePath<ArrayKey, TChild, TFieldValue>
  : {
      [TKey in keyof TValue]-?: ValuePath<
        TKey & string,
        TValue[TKey],
        TFieldValue
      >;
    }[keyof TValue];

/**
 * See {@link ValuePaths}
 */
export type FieldPath<
  TFieldValues extends FieldValues<TFieldValue>,
  TFieldValue
> = ValuePaths<TFieldValues, TFieldValue>;

/**
 * Returns the value of a field value or array path of a type.
 */
type PathValue<TValue, TPath, TFieldValue> =
  TPath extends `${infer TKey1}.${infer TKey2}`
    ? TKey1 extends keyof TValue
      ? TKey2 extends
          | ValuePaths<TValue[TKey1], TFieldValue>
          | ArrayPaths<TValue[TKey1], TFieldValue>
        ? PathValue<TValue[TKey1], TKey2, TFieldValue>
        : never
      : TKey1 extends `${ArrayKey}`
      ? TValue extends Array<infer TChild>
        ? PathValue<
            TChild,
            TKey2 &
              (
                | ValuePaths<TChild, TFieldValue>
                | ArrayPaths<TChild, TFieldValue>
              ),
            TFieldValue
          >
        : never
      : never
    : TPath extends keyof TValue
    ? TValue[TPath]
    : never;

/**
 * See {@link PathValue}
 */
export type FieldPathValue<
  TFieldValues extends FieldValues<TFieldValue>,
  TFieldPath extends FieldPath<TFieldValues, TFieldValue>,
  TFieldValue
> = PathValue<TFieldValues, TFieldPath, TFieldValue>;

/**
 * Returns a path of a type that leads to a field array.
 */
type ArrayPath<
  TKey extends string | number,
  Value,
  TFieldValue
> = Value extends Array<any>
  ? `${TKey}` | `${TKey}.${ArrayPaths<Value, TFieldValue>}`
  : Value extends FieldValues<TFieldValue>
  ? `${TKey}.${ArrayPaths<Value, TFieldValue>}`
  : never;

/**
 * Returns all paths of a type that lead to a field array.
 */
type ArrayPaths<TValue, TFieldValue> = TValue extends Array<infer TChild>
  ? IsTuple<TValue> extends true
    ? {
        [TKey in TupleKeys<TValue>]-?: ArrayPath<
          TKey & string,
          TValue[TKey],
          TFieldValue
        >;
      }[TupleKeys<TValue>]
    : ArrayPath<ArrayKey, TChild, TFieldValue>
  : {
      [TKey in keyof TValue]-?: ArrayPath<
        TKey & string,
        TValue[TKey],
        TFieldValue
      >;
    }[keyof TValue];

/**
 * See {@link ArrayPaths}
 */
export type FieldArrayPath<
  TFieldValues extends FieldValues<TFieldValue>,
  TFieldValue
> = ArrayPaths<TFieldValues, TFieldValue>;

/**
 * See {@link PathValue}
 */
export type FieldArrayPathValue<
  TFieldValues extends FieldValues<TFieldValue>,
  TFieldArrayPath extends FieldArrayPath<TFieldValues, TFieldValue>,
  TFieldValue
> = PathValue<TFieldValues, TFieldArrayPath, TFieldValue> & Array<unknown>;
