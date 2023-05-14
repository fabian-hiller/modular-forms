import { useStore } from '@builder.io/qwik';
import type {
  FieldValues,
  FormOptions,
  FormStore,
  ResponseData,
} from '../types';
import { getInitialStores } from '../utils';

/**
 * Creates and returns the store of the form.
 *
 * @param options The form options.
 *
 * @returns The reactive store.
 */
export function useFormStore<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData = undefined
>({
  loader,
  action,
  validate,
  validateOn = 'submit',
  revalidateOn = 'input',
}: FormOptions<TFieldValues, TResponseData>): FormStore<
  TFieldValues,
  TResponseData
> {
  return useStore(() => {
    const [fields, fieldArrays] = getInitialStores(loader, action);
    return {
      internal: {
        fields,
        fieldArrays,
        validate,
        validators: [],
        validateOn,
        revalidateOn,
      },
      element: undefined,
      submitCount: 0,
      submitting: false,
      submitted: false,
      validating: false,
      touched: false,
      dirty: false,
      invalid: false,
      response: action?.value?.response || {},
    };
  });
}
