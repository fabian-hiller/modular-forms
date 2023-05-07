import { signal } from '@preact/signals-react';
import { useMemo } from 'react';
import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormOptions,
  FormResponse,
  FormStore,
  MaybeValue,
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
export function useFormStore<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData = undefined
>({
  initialValues = {} as PartialValues<TFieldValues>,
  validateOn = 'submit',
  revalidateOn = 'change',
  validate,
}: FormOptions<TFieldValues> = {}): FormStore<TFieldValues, TResponseData> {
  return useMemo(
    () => ({
      internal: {
        // Props
        initialValues,
        validate,
        validateOn,
        revalidateOn,

        // Signals
        fieldNames: signal<FieldPath<TFieldValues>[]>([]),
        fieldArrayNames: signal<FieldArrayPath<TFieldValues>[]>([]),

        // Stores
        fields: {},
        fieldArrays: {},

        // Other
        validators: new Set(),
      },

      // Signals
      element: signal<MaybeValue<HTMLFormElement>>(null),
      submitCount: signal(0),
      submitting: signal(false),
      submitted: signal(false),
      validating: signal(false),
      touched: signal(false),
      dirty: signal(false),
      invalid: signal(false),
      response: signal<FormResponse<TResponseData>>({}),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
}
