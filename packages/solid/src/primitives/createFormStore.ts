import { createSignal } from 'solid-js';
import type {
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
  TResponseData extends ResponseData = undefined
>({
  initialValues = {} as PartialValues<TFieldValues>,
  validateOn = 'submit',
  revalidateOn = 'input',
  validate,
}: FormOptions<TFieldValues> = {}): FormStore<TFieldValues, TResponseData> {
  // Create signals of form store
  const [getFieldNames, setFieldNames] = createSignal<
    FieldPath<TFieldValues>[]
  >([]);
  const [getFieldArrayNames, setFieldArrayNames] = createSignal<
    FieldArrayPath<TFieldValues>[]
  >([]);
  const [getElement, setElement] = createSignal<HTMLFormElement>();
  const [getSubmitCount, setSubmitCount] = createSignal(0);
  const [getSubmitting, setSubmitting] = createSignal(false);
  const [getSubmitted, setSubmitted] = createSignal(false);
  const [getValidating, setValidating] = createSignal(false);
  const [getTouched, setTouched] = createSignal(false);
  const [getDirty, setDirty] = createSignal(false);
  const [getInvalid, setInvalid] = createSignal(false);
  const [getResponse, setResponse] = createSignal<FormResponse<TResponseData>>(
    {}
  );

  // Return form functions and state
  return {
    internal: {
      // Props
      initialValues,
      validate,
      validateOn,
      revalidateOn,

      // Signals
      getFieldNames,
      setFieldNames,
      getFieldArrayNames,
      setFieldArrayNames,
      getElement,
      setElement,
      getSubmitCount,
      setSubmitCount,
      getSubmitting,
      setSubmitting,
      getSubmitted,
      setSubmitted,
      getValidating,
      setValidating,
      getTouched,
      setTouched,
      getDirty,
      setDirty,
      getInvalid,
      setInvalid,
      getResponse,
      setResponse,

      // Stores
      fields: {},
      fieldArrays: {},

      // Other
      validators: new Set(),
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
