import { useStore } from '@builder.io/qwik';
import type {
  FieldArrayPath,
  FieldPath,
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
  TResponseData extends ResponseData = undefined,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>
>(
  options: FormOptions<TFieldValues, TResponseData>
): FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName> {
  // Destructure options
  const {
    loader,
    action,
    validate,
    validateOn = 'submit',
    revalidateOn = 'input',
  } = options;

  // Create and return form store
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
