import { createSignal } from 'solid-js';
import {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormOptions,
  FormResponse,
  FormStore,
  PartialValues,
  ResponseData,
} from '../types';

/**
 * Creates and returns the store of the form.
 *
 * @param options The form options.
 *
 * @returns The reactive store.
 */
export function createFormStore<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData = undefined,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>
>(
  options: FormOptions<TFieldValues> = {}
): FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName> {
  // Destructure options and set default values
  const {
    initialValues = {} as PartialValues<TFieldValues>,
    validateOn = 'submit',
    revalidateOn = 'input',
    validate,
  } = options;

  // Create all necessary signals
  const [getFieldNames, setFieldNames] = createSignal<TFieldName[]>([]);
  const [getFieldArrayNames, setFieldArrayNames] = createSignal<
    TFieldArrayName[]
  >([]);
  const [getElement, setElement] = createSignal<HTMLFormElement>();
  const [getSubmitCount, setSubmitCount] = createSignal(0);
  const [getSubmitting, setSubmitting] = createSignal(false);
  const [getSubmitted, setSubmitted] = createSignal(false);
  const [getValidating, setValidating] = createSignal(false);
  const [getTouched, setTouched] = createSignal(false);
  const [getDirty, setDirty] = createSignal(false);
  const [getInvalid, setInvalid] = createSignal(false);
  const [getResponse, setResponse] = createSignal<FormResponse>({});

  // Return form functions and state
  return {
    internal: {
      fields: {},
      fieldArrays: {},
      getFieldNames,
      setFieldNames,
      getFieldArrayNames,
      setFieldArrayNames,
      setElement,
      setSubmitCount,
      setSubmitting,
      setSubmitted,
      setValidating,
      setTouched,
      setDirty,
      setInvalid,
      setResponse,
      validate,
      validators: new Set(),
      initialValues,
      validateOn,
      revalidateOn,
    },
    get element() {
      return getElement();
    },
    get submitCount() {
      return getSubmitCount();
    },
    get submitting() {
      return getSubmitting();
    },
    get submitted() {
      return getSubmitted();
    },
    get validating() {
      return getValidating();
    },
    get touched() {
      return getTouched();
    },
    get dirty() {
      return getDirty();
    },
    get invalid() {
      return getInvalid();
    },
    get response() {
      return getResponse();
    },
  };
}
