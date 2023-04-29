import type { Accessor, Setter } from 'solid-js';
import type { FieldValue, FieldValues, InternalFieldStore } from './field';
import type { InternalFieldArrayStore } from './fieldArray';
import type { FieldArrayPath, FieldPath } from './path';
import type { Maybe, MaybePromise } from './utils';

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
  [Name in FieldPath<TFieldValues>]?: InternalFieldStore<TFieldValues, Name>;
};

/**
 * Value type of the field arrays store.
 */
export type FieldArraysStore<TFieldValues extends FieldValues> = {
  [Name in FieldArrayPath<TFieldValues>]?: InternalFieldArrayStore;
};

/**
 * Value type of the partial field values.
 */
export type PartialValues<TValue> = TValue extends string[] | File[]
  ? TValue
  : TValue extends FieldValue
  ? Maybe<TValue>
  : { [Key in keyof TValue]?: PartialValues<TValue[Key]> };

/**
 * Value type of the internal form store.
 */
export type InternalFormStore<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
> = {
  // Props
  initialValues: PartialValues<TFieldValues>;
  validate: Maybe<ValidateForm<TFieldValues>>;
  validateOn: ValidationMode;
  revalidateOn: ValidationMode;

  // Signals
  getFieldNames: Accessor<FieldPath<TFieldValues>[]>;
  setFieldNames: Setter<FieldPath<TFieldValues>[]>;
  getFieldArrayNames: Accessor<FieldArrayPath<TFieldValues>[]>;
  setFieldArrayNames: Setter<FieldArrayPath<TFieldValues>[]>;
  getElement: Accessor<Maybe<HTMLFormElement>>;
  setElement: Setter<Maybe<HTMLFormElement>>;
  getSubmitCount: Accessor<number>;
  setSubmitCount: Setter<number>;
  getSubmitting: Accessor<boolean>;
  setSubmitting: Setter<boolean>;
  getSubmitted: Accessor<boolean>;
  setSubmitted: Setter<boolean>;
  getValidating: Accessor<boolean>;
  setValidating: Setter<boolean>;
  getTouched: Accessor<boolean>;
  setTouched: Setter<boolean>;
  getDirty: Accessor<boolean>;
  setDirty: Setter<boolean>;
  getInvalid: Accessor<boolean>;
  setInvalid: Setter<boolean>;
  getResponse: Accessor<FormResponse<TResponseData>>;
  setResponse: Setter<FormResponse<TResponseData>>;

  // Stores
  fields: FieldsStore<TFieldValues>;
  fieldArrays: FieldArraysStore<TFieldValues>;

  // Other
  validators: Set<number>;
};

/**
 * Value type of the form store.
 */
export type FormStore<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
> = {
  internal: InternalFormStore<TFieldValues, TResponseData>;
  get element(): HTMLFormElement | undefined;
  get submitCount(): number;
  get submitting(): boolean;
  get submitted(): boolean;
  get validating(): boolean;
  get touched(): boolean;
  get dirty(): boolean;
  get invalid(): boolean;
  get response(): FormResponse<TResponseData>;
};

/**
 * Utility type to extract the field values from the form store.
 */
export type FormValues<TFormStore extends FormStore<any, any>> =
  TFormStore extends FormStore<infer TFieldValues, any> ? TFieldValues : never;

/**
 * Value type of the form options.
 */
export type FormOptions<TFieldValues extends FieldValues> = Partial<{
  initialValues: PartialValues<TFieldValues>;
  validateOn: ValidationMode;
  revalidateOn: ValidationMode;
  validate: ValidateForm<TFieldValues>;
}>;
