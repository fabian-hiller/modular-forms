import { MaybePromise } from './utils';

/**
 * HTML element type of a field.
 */
export type FieldElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

/**
 * Function type to validate a field.
 */
export type ValidateField<TFieldValue> = (
  value: TFieldValue | undefined
) => MaybePromise<string>;
