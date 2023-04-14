import type { NoSerialize, QRL } from '@builder.io/qwik';

/**
 * Returns a type with optional keys.
 */
export type PartialKey<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

/**
 * Checks if an array type is a tuple type.
 */
export type IsTuple<T extends Array<any>> = number extends T['length']
  ? false
  : true;

/**
 * Returns its own keys for a tuple type.
 */
export type TupleKeys<T extends Array<any>> = Exclude<keyof T, keyof any[]>;

/**
 * Can be used to index an array or tuple type.
 */
export type ArrayKey = number;

/**
 * Returns an optional type.
 */
export type Maybe<T> = T | undefined;

/**
 * Returns an optional value type.
 */
export type MaybeValue<T> = T | null | undefined;

/**
 * Returns an optional promise type.
 */
export type MaybePromise<T> = T | Promise<T>;

/**
 * Returns an optional array type.
 */
export type MaybeArray<T> = T | T[];

/**
 * Returns an optional function type.
 */
export type MaybeFunction<T> = T | (() => T);

/**
 * Returns an optional QRL type.
 */
export type MaybeQRL<T> = T | QRL<T>;

/**
 * Returns an optional QRL type.
 */
export type MaybeNoSerialize<T> = T | NoSerialize<T>;
