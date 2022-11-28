import { FieldValue } from './field';

/**
 * Checks if an array type is a tuple type.
 */
export type IsTuple<T extends any[]> = number extends T['length']
  ? false
  : true;

/**
 * Returns its own keys for a tuple type.
 */
export type TupleKeys<T extends any[]> = Exclude<keyof T, keyof any[]>;

/**
 * Can be used to index an array or tuple type.
 */
export type ArrayKey = number;

/**
 * Returns a deep partial type.
 */
export type DeepPartial<T> = T extends FieldValue
  ? T
  : { [K in keyof T]?: DeepPartial<T[K]> };

/**
 * Returns an optional type.
 */
export type Maybe<T> = T | undefined;
