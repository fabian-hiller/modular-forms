import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormOptions,
  FormResponse,
  FormStore,
  PartialValues,
  ResponseData,
} from '../types/index.js';
import { createSignal } from './createSignal';

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
  const fieldNames = createSignal<FieldPath<TFieldValues>[]>([]);
  const fieldArrayNames = createSignal<FieldArrayPath<TFieldValues>[]>([]);
  const element = createSignal<HTMLFormElement>();
  const submitCount = createSignal(0);
  const submitting = createSignal(false);
  const submitted = createSignal(false);
  const validating = createSignal(false);
  const touched = createSignal(false);
  const dirty = createSignal(false);
  const invalid = createSignal(false);
  const response = createSignal<FormResponse<TResponseData>>({});

  // Return form functions and state
  return {
    internal: {
      // Props
      initialValues,
      validate,
      validateOn,
      revalidateOn,

      // Signals
      fieldNames,
      fieldArrayNames,
      element,
      submitCount,
      submitting,
      submitted,
      validating,
      touched,
      dirty,
      invalid,
      response,

      // Stores
      fields: {},
      fieldArrays: {},

      // Other
      validators: new Set(),
    },
    get element() {
      return element.get();
    },
    get submitCount() {
      return submitCount.get();
    },
    get submitting() {
      return submitting.get();
    },
    get submitted() {
      return submitted.get();
    },
    get validating() {
      return validating.get();
    },
    get touched() {
      return touched.get();
    },
    get dirty() {
      return dirty.get();
    },
    get invalid() {
      return invalid.get();
    },
    get response() {
      return response.get();
    },
  };
}
