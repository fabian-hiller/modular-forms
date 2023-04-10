import { FieldPath, FieldPathValue } from './path';
import { Maybe, MaybePromise } from './utils';

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

/**
 * Value type of the internal raw field state.
 */
export type RawFieldState<
  TFieldValues extends FieldValues<TFieldValue>,
  TFieldName extends FieldPath<TFieldValues, TFieldValue>,
  TFieldValue
> = {
  startValue: Maybe<FieldPathValue<TFieldValues, TFieldName, TFieldValue>>;
  value: Maybe<FieldPathValue<TFieldValues, TFieldName, TFieldValue>>;
  error: string;
  touched: boolean;
  dirty: boolean;
};
