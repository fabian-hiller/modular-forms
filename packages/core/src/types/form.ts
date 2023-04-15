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
export type FormResponse<TResponseData extends ResponseData> = Partial<{
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
export type FieldsStore<TFieldValues extends FieldValues> = {
  [Name in FieldPath<TFieldValues>]?: FieldStore<TFieldValues, Name>;
};

/**
 * Value type of the field arrays store.
 */
export type FieldArraysStore<TFieldValues extends FieldValues> = {
  [Name in FieldArrayPath<TFieldValues>]?: FieldArrayStore<TFieldValues, Name>;
};

/**
 * Value type of the initial field values.
 */
export type InitialValues<TValue> = TValue extends
  | string[]
  | MaybeNoSerialize<Blob[]>
  | MaybeNoSerialize<File[]>
  ? TValue
  : TValue extends FieldValue
  ? Maybe<TValue>
  : { [Key in keyof Required<TValue>]: InitialValues<TValue[Key]> };

/**
 * Value type of the partial field values.
 */
export type PartialValues<TValue> = TValue extends
  | string[]
  | MaybeNoSerialize<Blob[]>
  | MaybeNoSerialize<File[]>
  ? TValue
  : TValue extends FieldValue
  ? Maybe<TValue>
  : { [Key in keyof TValue]?: PartialValues<TValue[Key]> };

/**
 * Value type of the internal form store.
 */
export type InternalFormStore<TFieldValues extends FieldValues> = {
  initialValues?: PartialValues<TFieldValues>;
  fields: FieldsStore<TFieldValues>;
  fieldNames?: FieldPath<TFieldValues>[];
  fieldArrays: FieldArraysStore<TFieldValues>;
  fieldArrayNames?: FieldArrayPath<TFieldValues>[];
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
  TResponseData extends ResponseData
> = {
  internal: InternalFormStore<TFieldValues>;
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
export type FormValues<TFormStore extends FormStore<any, any>> =
  TFormStore extends FormStore<infer TFieldValues, any> ? TFieldValues : never;
