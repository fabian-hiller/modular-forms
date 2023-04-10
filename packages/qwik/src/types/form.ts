import type {
  NoSerialize,
  QRL,
  QwikSubmitEvent,
  Signal,
} from '@builder.io/qwik';
import type { ActionStore } from '@builder.io/qwik-city';
import type { MaybePromise, Maybe } from '@modular-forms/shared';
import type { FieldStore, FieldValue, FieldValues } from './field';
import type { FieldArrayStore } from './fieldArray';
import type { FieldArrayPath, FieldPath, TypeInfoPath } from './path';
import type { MaybeQRL } from './utils';

/**
 * Function type to handle the submission of the form.
 */
export type SubmitHandler<TFieldValues extends FieldValues> = MaybeQRL<
  (
    values: TFieldValues,
    event: QwikSubmitEvent<HTMLFormElement>
  ) => MaybePromise<unknown>
>;

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
 * Value type of the response status.
 */
export type ResponseStatus = 'info' | 'error' | 'success';

/**
 * Value type of the response data.
 */
export type ResponseData = Maybe<Record<string, any> | Array<any>>;

/**
 * Value type of the form response.
 */
export type FormResponse<TResponseData extends ResponseData = undefined> =
  Partial<{
    status: ResponseStatus;
    message: string;
    data: TResponseData;
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
export type FormDataInfo<TFieldValues extends FieldValues> = Partial<{
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
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
> = {
  values: PartialValues<TFieldValues>;
  errors: FormErrors<TFieldValues>;
  response: FormResponse<TResponseData>;
};

/**
 * Value type of the form options.
 */
export type FormOptions<
  TFieldValues extends FieldValues,
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
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
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
