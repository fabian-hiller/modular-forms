import { FieldValue } from './field';

/**
 * Returns a deep partial type.
 * TODO: Delete me
 */
export type DeepPartial<T> = T extends FieldValue
  ? T
  : { [K in keyof T]?: DeepPartial<T[K]> };
