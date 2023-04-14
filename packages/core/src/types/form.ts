import type { FieldStore, FieldValue, FieldValues } from './field';
import type { FieldArrayStore } from './fieldArray';
import type { FieldArrayPath, FieldPath } from './path';
import type { Maybe, MaybeNoSerialize, MaybePromise, MaybeQRL } from './utils';

/**
 * Value type of the validation mode.
 */
export type ValidationMode = 'touched' | 'input' | 'change' | 'blur' | 'submit';

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
 * Value type of the initial field values.
 */
export type InitialValues<Value> = Value extends
  | string[]
  | MaybeNoSerialize<Blob[]>
  | MaybeNoSerialize<File[]>
  ? Value
  : Value extends FieldValue
  ? Maybe<Value>
  : { [Key in keyof Required<Value>]: InitialValues<Value[Key]> };

/**
 * Value type of the partial field values.
 */
export type PartialValues<Value> = Value extends
  | string[]
  | MaybeNoSerialize<Blob[]>
  | MaybeNoSerialize<File[]>
  ? Value
  : Value extends FieldValue
  ? Maybe<Value>
  : { [Key in keyof Value]?: PartialValues<Value[Key]> };

/**
 * Value type of the internal form store.
 */
export type InternalFormStore<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  initialValues?: PartialValues<TFieldValues>;
  fields: FieldsStore<TFieldValues, TFieldName>;
  fieldNames?: TFieldName[];
  fieldArrays: FieldArraysStore<TFieldValues, TFieldArrayName>;
  fieldArrayNames?: TFieldArrayName[];
  validate: Maybe<MaybeQRL<ValidateForm<TFieldValues>>>;
  validators: number[];
  validateOn: ValidationMode;
  revalidateOn: ValidationMode;
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
  internal: InternalFormStore<TFieldValues, TFieldName, TFieldArrayName>;
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
 * Value type of the initialize store dependencies.
 */
export type InitializeStoreDeps<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  initializeFieldStore: (
    form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
    name: TFieldName
  ) => FieldStore<TFieldValues, TFieldName>;
  initializeFieldArrayStore: (
    form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
    name: TFieldArrayName
  ) => FieldArrayStore<TFieldValues, TFieldArrayName>;
};

/**
 * Utility type to extract the field values from the form store.
 */
export type FormValues<TFormStore extends FormStore<any, any, any, any>> =
  TFormStore extends FormStore<infer TFieldValues, any, any, any>
    ? TFieldValues
    : never;
