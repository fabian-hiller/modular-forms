import { Accessor, Setter } from 'solid-js';
import { FieldStore, FieldValues } from './field';
import { FieldArrayStore } from './fieldArray';
import { FieldArrayPath, FieldPath } from './path';
import { DeepPartial } from './utils';

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
export type ValidationMode = 'input' | 'change' | 'submit';

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
    setResponse: Setter<Response>;
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
