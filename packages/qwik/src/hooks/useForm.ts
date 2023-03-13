import type { JSX } from '@builder.io/qwik/jsx-runtime';
import {
  Field,
  type FieldProps,
  Form,
  type FormProps,
  type FieldArrayProps,
  FieldArray,
} from '../components';
import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormOptions,
  FormStore,
} from '../types';
import { useFormStore } from './useFormStore';

/**
 * Creates and returns the store of the form as well as a linked Form, Field
 * and FieldArray component.
 *
 * @param options The form options.
 *
 * @returns The store and linked components.
 */
export function useForm<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>
>(
  options: FormOptions<TFieldValues>
): [
  FormStore<TFieldValues, TFieldName, TFieldArrayName>,
  {
    Form: (
      props: Omit<
        FormProps<TFieldValues, TFieldName, TFieldArrayName>,
        'of' | 'action'
      >
    ) => JSX.Element;
    Field: <
      TFieldName extends FieldPath<TFieldValues>,
      TFieldArrayName extends FieldArrayPath<TFieldValues>
    >(
      props: Omit<FieldProps<TFieldValues, TFieldName, TFieldArrayName>, 'of'>
    ) => JSX.Element;
    FieldArray: <
      TFieldName extends FieldPath<TFieldValues>,
      TFieldArrayName extends FieldArrayPath<TFieldValues>
    >(
      props: Omit<
        FieldArrayProps<TFieldValues, TFieldName, TFieldArrayName>,
        'of'
      >
    ) => JSX.Element;
  }
] {
  // Use form store
  const form = useFormStore(options);

  // Return form store and linked components
  return [
    form,
    {
      Form: (
        props: Omit<
          FormProps<TFieldValues, TFieldName, TFieldArrayName>,
          'of' | 'action'
        >
      ) => Form({ of: form, action: options.action, ...props }),
      Field: <
        TFieldName extends FieldPath<TFieldValues>,
        TFieldArrayName extends FieldArrayPath<TFieldValues>
      >(
        props: Omit<FieldProps<TFieldValues, TFieldName, TFieldArrayName>, 'of'>
      ) => Field({ of: form, ...props }),
      FieldArray: <
        TFieldName extends FieldPath<TFieldValues>,
        TFieldArrayName extends FieldArrayPath<TFieldValues>
      >(
        props: Omit<
          FieldArrayProps<TFieldValues, TFieldName, TFieldArrayName>,
          'of'
        >
      ) => FieldArray({ of: form, ...props }),
    },
  ];
}
