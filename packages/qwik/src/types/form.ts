import type {
  NoSerialize,
  QRL,
  QwikSubmitEvent,
  Signal,
} from '@builder.io/qwik';
import type { ActionStore } from '@builder.io/qwik-city';
import type { FieldStore, FieldValue, FieldValues } from './field';
import type { FieldArrayStore } from './fieldArray';
import type { FieldArrayPath, FieldPath, TypeInfoPath } from './path';
import type { Maybe, MaybePromise, MaybeQRL } from './utils';

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
  [name in FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>]?: string;
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
type ResponseStatus = 'info' | 'error' | 'success';

/**
 * Value type of the form response.
 */
export type FormResponse = Partial<{
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
  files: TypeInfoPath<TFieldValues, NoSerialize<Blob> | NoSerialize<File>>[];
  numbers: TypeInfoPath<TFieldValues, number>[];
}>;

/**
 * Value type of the form action store.
 */
export type FormActionStore<TFieldValues extends FieldValues> = {
  values: PartialValues<TFieldValues>;
  errors: FormErrors<TFieldValues>;
  response: FormResponse;
};

/**
 * Value type of the form options.
 */
export type FormOptions<TFieldValues extends FieldValues> = {
  loader: Signal<InitialValues<TFieldValues>>;
  action?: ActionStore<
    FormActionStore<TFieldValues>,
    PartialValues<TFieldValues>,
    true
  >;
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
  };
  element: HTMLFormElement | undefined;
  submitCount: number;
  submitting: boolean;
  submitted: boolean;
  validating: boolean;
  touched: boolean;
  dirty: boolean;
  invalid: boolean;
  response: FormResponse;
};

/**
 * Utility type to extract the field values from the form store.
 */
export type FormValues<TFormStore extends FormStore<any, any, any>> =
  TFormStore extends FormStore<infer TFieldValues, any, any>
    ? TFieldValues
    : never;
