import { MaybePromise } from './utils';

/**
 * HTML element type of a field.
 */
export type FieldElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

/**
 * Value type of the form fields.
 */
export type FieldValues<TFieldValue> = {
  [name: string]:
    | TFieldValue
    | FieldValues<TFieldValue>
    | (TFieldValue | FieldValues<TFieldValue>)[];
};

/**
 * Function type to validate a field.
 */
export type ValidateField<TFieldValue> = (
  value: TFieldValue | undefined
) => MaybePromise<string>;
