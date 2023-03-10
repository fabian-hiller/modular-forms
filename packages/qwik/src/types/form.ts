import type { QRL, Signal } from '@builder.io/qwik';
import type { FieldStore, FieldValue, FieldValues } from './field';
import type { FieldArrayStore } from './fieldArray';
import type { FieldArrayPath, FieldPath } from './path';
import type { DeepPartial } from './utils';

/**
 * Value type of the form errors.
 */
export type FormErrors<TFieldValues extends FieldValues> = {
  [name in FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>]?: string;
};

/**
 * Function type to validate a form.
 */
export type ValidateForm<TFieldValues extends FieldValues> = (
  values: DeepPartial<TFieldValues>
) => FormErrors<TFieldValues> | Promise<FormErrors<TFieldValues>>;

/**
 * Value type of the response status.
 */
type ResponseStatus = 'info' | 'error' | 'success';

/**
 * Value type of the form response.
 */
export type Response = Partial<{
  status: ResponseStatus;
  message: string;
}>;

/**
 * Value type of the validation mode.
 */
export type ValidationMode = 'touched' | 'input' | 'change' | 'blur' | 'submit';

/**
 * Value type of the fields store.
 */
export type FieldsStore<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = {
  [Name in TFieldName]: FieldStore<TFieldValues, Name>;
};

/**
 * Value type of the field arrays store.
 */
export type FieldArraysStore<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  [Name in TFieldArrayName]: FieldArrayStore<TFieldValues, Name>;
};

/**
 * Returns deep partial field values.
 */
export type FormLoader<T> = T extends FieldValue
  ? T | undefined
  : { [K in keyof T]: FormLoader<T[K]> };

/**
 * Value type of the form options.
 */
export type FormOptions<TFieldValues extends FieldValues> = {
  loader: Signal<FormLoader<TFieldValues>>;
  validate?: QRL<ValidateForm<TFieldValues>>;
  validateOn?: ValidationMode;
  revalidateOn?: ValidationMode;
};

/**
 * Value type of the form store.
 */
export type FormStore<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  internal: {
    fields: FieldsStore<TFieldValues, TFieldName>;
    fieldArrays: FieldArraysStore<TFieldValues, TFieldArrayName>;
    validate: QRL<ValidateForm<TFieldValues>> | undefined;
    validators: number[];
    validateOn: ValidationMode;
    revalidateOn: ValidationMode;
    autoFocus?: string;
  };
  element: HTMLFormElement | undefined;
  submitCount: number;
  submitting: boolean;
  submitted: boolean;
  validating: boolean;
  touched: boolean;
  dirty: boolean;
  invalid: boolean;
  response: Response;
};

export type FormValues<TFormState extends FormStore<any, any, any>> =
  TFormState extends FormStore<infer TFieldValues, any, any>
    ? TFieldValues
    : never;
