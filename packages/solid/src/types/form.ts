import { Accessor, Setter } from 'solid-js';
import { FieldStore, FieldValues } from './field';
import { FieldArrayStore } from './fieldArray';
import { DeepPartial } from './utils';

/**
 * Value type of the response status.
 */
type ResponseStatus = 'info' | 'error' | 'success';

/**
 * Value type of the form response.
 */
export type Response =
  | {
      status: ResponseStatus;
      message: string;
    }
  | {};

/**
 * Value type of the validation mode.
 */
export type ValidationMode = 'input' | 'change' | 'submit';

/**
 * Value type of the external and internal form state.
 */
export type FormState<TFieldValues extends FieldValues> = {
  internal: {
    validators: Set<number>;
    initialValues: DeepPartial<TFieldValues> | {};
    validateOn: ValidationMode;
    revalidateOn: ValidationMode;
    fields: Map<string, FieldStore<TFieldValues>>; // TODO: Replace string
    fieldArrays: Map<string, FieldArrayStore>; // TODO: Replace string
    getFieldNames: Accessor<string[]>; // TODO: Replace string
    setFieldNames: Setter<string[]>; // TODO: Replace string
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
