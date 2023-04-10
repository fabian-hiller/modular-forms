import type {
  ArrayKey,
  FieldValues,
  IsTuple,
  TupleKeys,
} from '@modular-forms/shared';
import type { FieldValue } from './field';

/**
 * Returns a path of a type that leads to a field value.
 */
type ValuePath<Key extends string | number, Value> = Value extends string[]
  ? `${Key}` | `${Key}.${ValuePaths<Value>}`
  : Value extends FieldValue | Blob
  ? `${Key}`
  : `${Key}.${ValuePaths<Value>}`;

/**
 * Returns all paths of a type that lead to a field value.
 */
type ValuePaths<Data> = Data extends Array<infer Child>
  ? IsTuple<Data> extends true
    ? {
        [Key in TupleKeys<Data>]-?: ValuePath<Key & string, Data[Key]>;
      }[TupleKeys<Data>]
    : ValuePath<ArrayKey, Child>
  : {
      [Key in keyof Data]-?: ValuePath<Key & string, Data[Key]>;
    }[keyof Data];

/**
 * See {@link ValuePaths}
 */
export type FieldPath<TFieldValues extends FieldValues<FieldValue>> =
  ValuePaths<TFieldValues>;

/**
 * Returns the value of a field value or array path of a type.
 */
type PathValue<
  Data,
  Path extends ValuePaths<Data> | ArrayPaths<Data>
> = Path extends `${infer Key1}.${infer Key2}`
  ? Key1 extends keyof Data
    ? Key2 extends ValuePaths<Data[Key1]> | ArrayPaths<Data[Key1]>
      ? PathValue<Data[Key1], Key2>
      : never
    : Key1 extends `${ArrayKey}`
    ? Data extends Array<infer Child>
      ? PathValue<Child, Key2 & (ValuePaths<Child> | ArrayPaths<Child>)>
      : never
    : never
  : Path extends keyof Data
  ? Data[Path]
  : never;

/**
 * See {@link PathValue}
 */
export type FieldPathValue<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldPath extends FieldPath<TFieldValues>
> = PathValue<TFieldValues, TFieldPath>;

/**
 * Returns a path of a type that leads to a field array.
 */
type ArrayPath<Key extends string | number, Value> = Value extends Array<any>
  ? `${Key}` | `${Key}.${ArrayPaths<Value>}`
  : Value extends FieldValues<FieldValue>
  ? `${Key}.${ArrayPaths<Value>}`
  : never;

/**
 * Returns all paths of a type that lead to a field array.
 */
type ArrayPaths<Data> = Data extends Array<infer Child>
  ? IsTuple<Data> extends true
    ? {
        [Key in TupleKeys<Data>]-?: ArrayPath<Key & string, Data[Key]>;
      }[TupleKeys<Data>]
    : ArrayPath<ArrayKey, Child>
  : {
      [Key in keyof Data]-?: ArrayPath<Key & string, Data[Key]>;
    }[keyof Data];

/**
 * See {@link ArrayPaths}
 */
export type FieldArrayPath<TFieldValues extends FieldValues<FieldValue>> =
  ArrayPaths<TFieldValues>;

/**
 * See {@link PathValue}
 */
export type FieldArrayPathValue<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldArrayPath extends FieldArrayPath<TFieldValues>
> = PathValue<TFieldValues, TFieldArrayPath> & Array<unknown>;

/**
 * Returns a template path of a specified type.
 */
type TypeTemplatePath<
  Key extends string | number,
  Value,
  Type
> = Value extends Type
  ? Value extends Array<any> | Record<string, any>
    ? `${Key}` | `${Key}.${TypeTemplatePaths<Value, Type>}`
    : `${Key}`
  : Value extends
      | FieldValues<FieldValue>
      | (FieldValue | FieldValues<FieldValue>)[]
  ? `${Key extends number ? '$' : Key}.${TypeTemplatePaths<Value, Type>}`
  : never;

/**
 * Returns all template paths of a specified type.
 */
type TypeTemplatePaths<Data, Type> = Data extends Array<infer Child>
  ? IsTuple<Data> extends true
    ? {
        [Key in TupleKeys<Data>]-?: TypeTemplatePath<
          Key & string,
          Data[Key],
          Type
        >;
      }[TupleKeys<Data>]
    : TypeTemplatePath<ArrayKey, Child, Type>
  : {
      [Key in keyof Data]-?: TypeTemplatePath<Key & string, Data[Key], Type>;
    }[keyof Data];

/**
 * See {@link TypePaths}
 */
export type TypeInfoPath<
  TFieldValues extends FieldValues<FieldValue>,
  Type
> = TypeTemplatePaths<TFieldValues, Type>;
