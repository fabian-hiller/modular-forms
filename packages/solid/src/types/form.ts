import {
  FormResponse,
  Maybe,
  MaybePromise,
  ResponseData,
  ValidationMode,
} from '@modular-forms/shared';
import { Accessor, Setter } from 'solid-js';
import { FieldStore, FieldValue, FieldValues } from './field';
import { FieldArrayStore } from './fieldArray';
import { FieldArrayPath, FieldPath } from './path';

/**
 * Value type of the submit event object.
 */
export type SubmitEvent = Event & {
  submitter: HTMLElement;
} & {
  currentTarget: HTMLFormElement;
  target: Element;
};

/**
 * Function type to handle the submission of the form.
 */
export type SubmitHandler<TFieldValues extends FieldValues> = (
  values: TFieldValues,
  event: SubmitEvent
) => MaybePromise<unknown>;

/**
 * Value type of the form errors.
 */
export type FormErrors<TFieldValues extends FieldValues> = {
  [name in
    | FieldPath<TFieldValues>
    | FieldArrayPath<TFieldValues>]?: Maybe<string>;
} & { [name: string]: string };

/**
 * Function type to validate a form.
 */
export type ValidateForm<TFieldValues extends FieldValues> = (
  values: PartialValues<TFieldValues>
) => MaybePromise<FormErrors<TFieldValues>>;

/**
 * Value type of the fields store.
 */
export type FieldsStore<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = {
  [Name in TFieldName]?: FieldStore<TFieldValues, Name>;
};

/**
 * Value type of the field arrays store.
 */
export type FieldArraysStore<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  [Name in TFieldArrayName]?: FieldArrayStore<TFieldValues, Name>;
};

/**
 * Value type of the partial field values.
 */
export type PartialValues<Value> = Value extends string[] | Blob[] | File[]
  ? Value
  : Value extends FieldValue
  ? Maybe<Value>
  : { [Key in keyof Value]?: PartialValues<Value[Key]> };

/**
 * Value type of the form options.
 */
export type FormOptions<TFieldValues extends FieldValues> = Partial<{
  initialValues: PartialValues<TFieldValues>;
  validateOn: ValidationMode;
  revalidateOn: ValidationMode;
  validate: ValidateForm<TFieldValues>;
}>;

/**
 * Value type of the form store.
 */
export type FormStore<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  internal: {
    fields: FieldsStore<TFieldValues, TFieldName>;
    fieldArrays: FieldArraysStore<TFieldValues, TFieldArrayName>;
    getFieldNames: Accessor<TFieldName[]>;
    setFieldNames: Setter<TFieldName[]>;
    getFieldArrayNames: Accessor<TFieldArrayName[]>;
    setFieldArrayNames: Setter<TFieldArrayName[]>;
    setElement: Setter<HTMLFormElement>;
    setSubmitCount: Setter<number>;
    setSubmitting: Setter<boolean>;
    setSubmitted: Setter<boolean>;
    setValidating: Setter<boolean>;
    setTouched: Setter<boolean>;
    setDirty: Setter<boolean>;
    setInvalid: Setter<boolean>;
    setResponse: Setter<FormResponse>;
    validate: ValidateForm<TFieldValues> | undefined;
    validators: Set<number>;
    initialValues: PartialValues<TFieldValues>;
    validateOn: ValidationMode;
    revalidateOn: ValidationMode;
  };
  element: HTMLFormElement | undefined;
  submitCount: number;
  submitting: boolean;
  submitted: boolean;
  validating: boolean;
  touched: boolean;
  dirty: boolean;
  invalid: boolean;
  response: FormResponse<TResponseData>;
};

/**
 * Utility type to extract the field values from the form store.
 */
export type FormValues<TFormStore extends FormStore<any, any, any, any>> =
  TFormStore extends FormStore<infer TFieldValues, any, any, any>
    ? TFieldValues
    : never;
