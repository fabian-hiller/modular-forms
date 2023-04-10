import type {
  NoSerialize,
  QRL,
  QwikSubmitEvent,
  Signal,
} from '@builder.io/qwik';
import type { ActionStore } from '@builder.io/qwik-city';
import type {
  FieldValues,
  FormResponse,
  MaybePromise,
  Maybe,
  ResponseData,
  ValidationMode,
  FieldArrayPath,
  FieldPath,
  FormErrors,
} from '@modular-forms/shared';
import type { FieldStore, FieldValue } from './field';
import type { FieldArrayStore } from './fieldArray';
import type { TypeInfoPath } from './path';
import type { MaybeQRL } from './utils';

/**
 * Function type to handle the submission of the form.
 */
export type SubmitHandler<TFieldValues extends FieldValues<FieldValue>> =
  MaybeQRL<
    (
      values: TFieldValues,
      event: QwikSubmitEvent<HTMLFormElement>
    ) => MaybePromise<unknown>
  >;

/**
 * Function type to validate a form.
 */
export type ValidateForm<TFieldValues extends FieldValues<FieldValue>> = (
  values: PartialValues<TFieldValues>
) => MaybePromise<FormErrors<TFieldValues, FieldValue>>;

/**
 * Value type of the fields store.
 */
export type FieldsStore<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldName extends FieldPath<TFieldValues, FieldValue>
> = {
  [Name in TFieldName]: FieldStore<TFieldValues, Name>;
};

/**
 * Value type of the field arrays store.
 */
export type FieldArraysStore<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
> = {
  [Name in TFieldArrayName]: FieldArrayStore<TFieldValues, Name>;
};

/**
 * Value type of the initial field values.
 */
export type InitialValues<Value> = Value extends
  | string[]
  | NoSerialize<Blob[]>
  | NoSerialize<File[]>
  ? Value
  : Value extends FieldValue
  ? Maybe<Value>
  : { [Key in keyof Required<Value>]: InitialValues<Value[Key]> };

/**
 * Value type of the partial field values.
 */
export type PartialValues<Value> = Value extends
  | string[]
  | NoSerialize<Blob[]>
  | NoSerialize<File[]>
  ? Value
  : Value extends FieldValue
  ? Maybe<Value>
  : { [Key in keyof Value]?: PartialValues<Value[Key]> };

/**
 * Value type of the form data info.
 */
export type FormDataInfo<TFieldValues extends FieldValues<FieldValue>> =
  Partial<{
    arrays: TypeInfoPath<TFieldValues, any[]>[];
    booleans: TypeInfoPath<TFieldValues, boolean>[];
    dates: TypeInfoPath<TFieldValues, Date>[];
    files: TypeInfoPath<TFieldValues, NoSerialize<Blob> | NoSerialize<File>>[];
    numbers: TypeInfoPath<TFieldValues, number>[];
  }>;

/**
 * Value type of the form action store.
 */
export type FormActionStore<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData
> = {
  values: PartialValues<TFieldValues>;
  errors: FormErrors<TFieldValues, FieldValue>;
  response: FormResponse<TResponseData>;
};

/**
 * Value type of the form options.
 */
export type FormOptions<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData
> = {
  loader: Signal<InitialValues<TFieldValues>>;
  action?: Maybe<
    ActionStore<
      FormActionStore<TFieldValues, TResponseData>,
      PartialValues<TFieldValues>,
      true
    >
  >;
  validate?: Maybe<QRL<ValidateForm<TFieldValues>>>;
  validateOn?: Maybe<ValidationMode>;
  revalidateOn?: Maybe<ValidationMode>;
};

/**
 * Value type of the form store.
 */
export type FormStore<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
> = {
  internal: {
    fields: FieldsStore<TFieldValues, TFieldName>;
    fieldArrays: FieldArraysStore<TFieldValues, TFieldArrayName>;
    validate: QRL<ValidateForm<TFieldValues>> | undefined;
    validators: number[];
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
