import { useStore } from '@builder.io/qwik';
import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormStore,
  ResponseData,
} from '@modular-forms/shared';
import type { FormOptions } from '../types';
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
  TResponseData extends ResponseData = undefined,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>
>({
  loader,
  action,
  validate,
  validateOn = 'submit',
  revalidateOn = 'input',
}: FormOptions<TFieldValues, TResponseData>): FormStore<
  TFieldValues,
  TResponseData,
  TFieldName,
  TFieldArrayName
> {
  return useStore(
    () => {
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
    },
    { deep: true }
  );
}
