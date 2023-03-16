import { Accessor, Setter } from 'solid-js';
import { FieldStore, FieldValues } from './field';
import { FieldArrayStore } from './fieldArray';
import { FieldArrayPath, FieldPath } from './path';
import { DeepPartial, MaybePromise } from './utils';

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
) => MaybePromise<void>;

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
) => MaybePromise<FormErrors<TFieldValues>>;

/**
 * Value type of the external and internal form state.
 */
export type FormState<TFieldValues extends FieldValues> = {
  internal: {
    validators: Set<number>;
    initialValues: DeepPartial<TFieldValues> | {};
    validateOn: ValidationMode;
    revalidateOn: ValidationMode;
    validate: ValidateForm<TFieldValues> | undefined;
    fields: Map<string, FieldStore<TFieldValues>>; // TODO: Replace string
    fieldArrays: Map<string, FieldArrayStore>; // TODO: Replace string
    getFieldNames: Accessor<string[]>; // TODO: Replace string
    setFieldNames: Setter<string[]>; // TODO: Replace string
    getFieldArrayNames: Accessor<string[]>; // TODO: Replace string
    setFieldArrayNames: Setter<string[]>; // TODO: Replace string
    setElement: Setter<HTMLFormElement>;
    setSubmitCount: Setter<number>;
    setSubmitting: Setter<boolean>;
    setSubmitted: Setter<boolean>;
    setValidating: Setter<boolean>;
    setTouched: Setter<boolean>;
    setDirty: Setter<boolean>;
    setInvalid: Setter<boolean>;
    setResponse: Setter<FormResponse>;
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
 * Utility type to extract the field values from the form state.
 */
export type FormValues<TFormState extends FormState<any>> =
  TFormState extends FormState<infer TFieldValues> ? TFieldValues : never;
