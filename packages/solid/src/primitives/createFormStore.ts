import type {
  ResponseData,
  FormResponse,
  FieldValues,
  FieldArrayPath,
  FieldPath,
  PartialValues,
} from '@modular-forms/core';
import { createSignal } from 'solid-js';
import type { FormOptions, FormStore } from '../types';

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
      initialValues,
      fields: {},
      get fieldNames() {
        return getFieldNames();
      },
      set fieldNames(value) {
        setFieldNames(value);
      },
      fieldArrays: {},
      get fieldArrayNames() {
        return getFieldArrayNames();
      },
      set fieldArrayNames(value) {
        setFieldArrayNames(value);
      },
      validate,
      validators: [],
      validateOn,
      revalidateOn,
    },
    get element() {
      return getElement();
    },
    set element(value) {
      setElement(value);
    },
    get submitCount() {
      return getSubmitCount();
    },
    set submitCount(value) {
      setSubmitCount(value);
    },
    get submitting() {
      return getSubmitting();
    },
    set submitting(value) {
      setSubmitting(value);
    },
    get submitted() {
      return getSubmitted();
    },
    set submitted(value) {
      setSubmitted(value);
    },
    get validating() {
      return getValidating();
    },
    set validating(value) {
      setValidating(value);
    },
    get touched() {
      return getTouched();
    },
    set touched(value) {
      setTouched(value);
    },
    get dirty() {
      return getDirty();
    },
    set dirty(value) {
      setDirty(value);
    },
    get invalid() {
      return getInvalid();
    },
    set invalid(value) {
      setInvalid(value);
    },
    get response() {
      return getResponse();
    },
    set response(value) {
      setResponse(value);
    },
  };
}
